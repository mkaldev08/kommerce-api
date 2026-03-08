import type { FastifyInstance } from "fastify";
import { authenticateUser } from "./controllers/authenticate-controller";
import { CreateCategoryController } from "./controllers/create-category-controller";
import { CreateProductController } from "./controllers/create-product-controller";
import { CreateCompany } from "./controllers/create-company-controller";
import { CreateCustomerController } from "./controllers/create-customer-controller";
import { DeleteProductController } from "./controllers/delete-product-controller";
import { DeleteCustomerController } from "./controllers/delete-customer-controller";
import { FindCompaniesByOwnerId } from "./controllers/find-companies-by-owner-id-controller";
import { FindCompanyById } from "./controllers/find-company-by-id-controller";
import { FindOneCompanyByOwnerId } from "./controllers/find-one-company-by-owner-id-controller";
import { FindCustomerByIdController } from "./controllers/find-customer-by-id-controller";
import { GetAllProvinces } from "./controllers/get-all-provinces-controller";
import { GetProductByIdController } from "./controllers/get-product-by-id-controller";
import { GetBusinessUnitByIdController } from "./controllers/get-business-unit-by-id-controller";
import { GetBusinessUnitsByCompanyIdController } from "./controllers/get-business-units-by-company-id-controller";
import { GetMunicipalitiesByProvinceId } from "./controllers/get-municipalities-by-province-id-controller";
import { ListCategoriesController } from "./controllers/list-categories-controller";
import { ListProductsController } from "./controllers/list-products-controller";
import { ListCustomersController } from "./controllers/list-customers-controller";
import { logoutUser } from "./controllers/logout-controller";
import { registerUser } from "./controllers/register-user-controller";
import { UpdateProductController } from "./controllers/update-product-controller";
import { UpdateCustomerController } from "./controllers/update-customer-controller";
import { createSaleController } from "./controllers/create-sale-controller";
import { listSalesController } from "./controllers/list-sales-controller";
import { getSaleController } from "./controllers/get-sale-controller";
import { updateSaleStatusController } from "./controllers/update-sale-status-controller";
import { openCashRegisterController } from "./controllers/open-cash-register-controller";
import { closeCashRegisterController } from "./controllers/close-cash-register-controller";
import { openWorkShiftController } from "./controllers/open-work-shift-controller";
import { closeWorkShiftController } from "./controllers/close-work-shift-controller";
import { createCashMovementController } from "./controllers/create-cash-movement-controller";
import { getOpenCashRegisterController } from "./controllers/get-open-cash-register-controller";
import { getOpenWorkShiftController } from "./controllers/get-open-work-shift-controller";
import { listCashMovementsController } from "./controllers/list-cash-movements-controller";

export function appRoutes(app: FastifyInstance) {
  app.post("/companies/:ownerId", CreateCompany);
  app.get("/companies/:companyId", FindCompanyById);
  app.get("/companies/owner/:ownerId", FindCompaniesByOwnerId);

  app.get("/owner/:ownerId/company", FindOneCompanyByOwnerId);
  app.post("/logout", logoutUser);

  app.get(
    "/business-units/company/:companyId",
    GetBusinessUnitsByCompanyIdController,
  );

  app.get("/business-units/:businessUnitId", GetBusinessUnitByIdController);

  app.get("/provinces", GetAllProvinces);
  app.get(
    "/provinces/:provinceId/municipalities",
    GetMunicipalitiesByProvinceId,
  );

  app.get("/inventory/products", ListProductsController);
  app.get("/inventory/products/:productId", GetProductByIdController);
  app.get("/inventory/categories", ListCategoriesController);
  app.post("/inventory/categories", CreateCategoryController);
  app.post("/inventory/products", CreateProductController);
  app.patch("/inventory/products/:productId", UpdateProductController);
  app.delete("/inventory/products/:productId", DeleteProductController);

  app.get("/customers", ListCustomersController);
  app.get("/customers/:id", FindCustomerByIdController);
  app.post("/customers", CreateCustomerController);
  app.patch("/customers/:id", UpdateCustomerController);
  app.delete("/customers/:id", DeleteCustomerController);

  // Sales/Invoice routes
  app.post("/sales", createSaleController);
  app.get("/sales", listSalesController);
  app.get("/sales/:id", getSaleController);
  app.patch("/sales/:id/status", updateSaleStatusController);

  // Cash flow routes
  app.post("/cash-registers/open", openCashRegisterController);
  app.get(
    "/cash-registers/business-unit/:businessUnitId/open",
    getOpenCashRegisterController,
  );
  app.post(
    "/cash-registers/:cashRegisterId/close",
    closeCashRegisterController,
  );
  app.post("/work-shifts/open", openWorkShiftController);
  app.get(
    "/work-shifts/cash-register/:cashRegisterId/open",
    getOpenWorkShiftController,
  );
  app.post("/work-shifts/:workShiftId/close", closeWorkShiftController);
  app.post("/cash-movements", createCashMovementController);
  app.get("/cash-movements", listCashMovementsController);
}

export function nonAuthenticatedRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({ status: "ok" }));
  app.post("/users", registerUser);
  app.post("/sessions", authenticateUser);
}
