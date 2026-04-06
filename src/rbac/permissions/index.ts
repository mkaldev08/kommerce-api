import { ACADEMY } from './academy.permissions'
import { CUSTOMERS } from './customers.permissions'
import { GAMING } from './gaming.permissions'
import { INVENTORY } from './inventory.permissions'
import { SALES } from './sales.permissions'
import { SHARED } from './shared.permissions'

type ValueOf<T> = T[keyof T]

export type PermissionOperation =
  | ValueOf<typeof SHARED>
  | ValueOf<typeof INVENTORY>
  | ValueOf<typeof CUSTOMERS>
  | ValueOf<typeof ACADEMY>
  | ValueOf<typeof GAMING>
  | ValueOf<typeof SALES>

export { ACADEMY, CUSTOMERS, GAMING, INVENTORY, SALES, SHARED }
