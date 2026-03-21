import type { FastifyReply, FastifyRequest } from "fastify";
import { Readable } from "node:stream";
import { z } from "zod";
import { env } from "@/env";

const paramsSchema = z.object({
  platform: z.enum(["win", "mac", "linux"]),
  assetName: z.string(),
});

interface GitHubReleaseAsset {
  id: number;
  name: string;
  url: string;
  content_type: string;
  size: number;
}

interface GitHubRelease {
  assets: GitHubReleaseAsset[];
}

async function fetchLatestRelease(): Promise<GitHubRelease> {
  const response = await fetch(
    `https://api.github.com/repos/${env.GITHUB_RELEASES_OWNER}/${env.GITHUB_RELEASES_REPO}/releases/latest`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${env.GITHUB_RELEASES_TOKEN ?? ""}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "kommerce-api-updater-proxy",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub latest release request failed with status ${response.status}`);
  }

  return (await response.json()) as GitHubRelease;
}

async function fetchReleaseAssetStream(asset: GitHubReleaseAsset): Promise<Response> {
  return fetch(asset.url, {
    headers: {
      Accept: "application/octet-stream",
      Authorization: `Bearer ${env.GITHUB_RELEASES_TOKEN ?? ""}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "kommerce-api-updater-proxy",
    },
    redirect: "follow",
  });
}

export async function getAppUpdateAssetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!env.GITHUB_RELEASES_TOKEN) {
    return reply.status(503).send({ message: "Update service is not configured." });
  }

  const { platform, assetName } = paramsSchema.parse(request.params);
  const release = await fetchLatestRelease();

  const platformChannelFile =
    platform === "mac"
      ? ["latest-mac.yml"]
      : platform === "linux"
        ? ["latest-linux.yml", "latest.yml"]
        : ["latest.yml"];

  const wantedAssetName =
    assetName === "channel"
      ? platformChannelFile.find((fileName) =>
          release.assets.some((asset) => asset.name === fileName),
        )
      : assetName;

  if (!wantedAssetName) {
    return reply.status(404).send({ message: "Update metadata not found." });
  }

  const asset = release.assets.find((item) => item.name === wantedAssetName);

  if (!asset) {
    return reply.status(404).send({ message: "Update file not found." });
  }

  const assetResponse = await fetchReleaseAssetStream(asset);

  if (!assetResponse.ok || !assetResponse.body) {
    return reply
      .status(502)
      .send({ message: "Could not fetch update file from release source." });
  }

  const contentType =
    assetResponse.headers.get("content-type") ??
    (asset.name.endsWith(".yml") ? "text/yaml; charset=utf-8" : "application/octet-stream");

  const responseStream = Readable.fromWeb(assetResponse.body as globalThis.ReadableStream);

  reply
    .status(200)
    .header("Content-Type", contentType)
    .header("Cache-Control", "no-store");

  return reply.send(responseStream);
}
