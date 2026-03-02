-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Municipality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Municipality_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "Province" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "legal_name" TEXT NOT NULL,
    "trade_name" TEXT NOT NULL,
    "commercial_registry" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "vat_regime" TEXT NOT NULL,
    "share_capital" DECIMAL NOT NULL,
    "street_address" TEXT NOT NULL,
    "postal_code" TEXT,
    "municipality_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "companies_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "Municipality" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "business_units" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "business_units_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "vat_rate" DECIMAL NOT NULL,
    "is_service" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "supplier_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stocks_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "nif" TEXT,
    "street_address" TEXT,
    "postal_code" TEXT,
    "municipality_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "customers_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "Municipality" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "street_address" TEXT NOT NULL,
    "postal_code" TEXT,
    "municipality_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "suppliers_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "Municipality" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "issue_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxable_amount" DECIMAL NOT NULL,
    "vat_amount" DECIMAL NOT NULL,
    "company_id" TEXT NOT NULL,
    "business_unit_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "cash_register_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invoices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoices_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "invoices_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL NOT NULL,
    "vat_rate" DECIMAL NOT NULL,
    "vat_amount" DECIMAL NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "vat_status" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoice_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "method" TEXT NOT NULL,
    "payment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoice_id" TEXT NOT NULL,
    "financial_plan_id" TEXT,
    "payment_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_financial_plan_id_fkey" FOREIGN KEY ("financial_plan_id") REFERENCES "financial_plans" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cash_registers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'CLOSED',
    "opened_at" DATETIME,
    "closed_at" DATETIME,
    "business_unit_id" TEXT NOT NULL,
    "operator_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "cash_registers_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cash_registers_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cash_movements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "description" TEXT,
    "movement_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cash_register_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cash_movements_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "work_shifts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME,
    "opening_balance" DECIMAL NOT NULL,
    "closing_balance" DECIMAL,
    "status" TEXT NOT NULL,
    "operator_id" TEXT NOT NULL,
    "cash_register_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "work_shifts_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_shifts_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "class_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "enrollments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "enrollment_belts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollment_id" TEXT NOT NULL,
    "belt_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "enrollment_belts_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "enrollment_belts_belt_id_fkey" FOREIGN KEY ("belt_id") REFERENCES "belts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "instructors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "belt_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "instructors_belt_id_fkey" FOREIGN KEY ("belt_id") REFERENCES "belts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "belts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "school_years" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "school_year_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "classes_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "classes_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "school_years" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tuition_fees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "due_date" DATETIME NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "belt_id" TEXT NOT NULL,
    "fee" DECIMAL NOT NULL,
    "enrollment_fee" DECIMAL NOT NULL,
    "confirmation_fee" DECIMAL NOT NULL,
    "fine_tax" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tuition_fees_belt_id_fkey" FOREIGN KEY ("belt_id") REFERENCES "belts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "financial_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "school_year_id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "due_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "financial_plans_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "school_years" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "financial_plans_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "financial_plans_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Province_name_key" ON "Province"("name");

-- CreateIndex
CREATE INDEX "Municipality_province_id_idx" ON "Municipality"("province_id");

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_name_province_id_key" ON "Municipality"("name", "province_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "companies_commercial_registry_key" ON "companies"("commercial_registry");

-- CreateIndex
CREATE INDEX "companies_owner_id_idx" ON "companies"("owner_id");

-- CreateIndex
CREATE INDEX "companies_municipality_id_idx" ON "companies"("municipality_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_units_company_id_name_key" ON "business_units"("company_id", "name");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_is_service_idx" ON "products"("is_service");

-- CreateIndex
CREATE INDEX "stocks_product_id_idx" ON "stocks"("product_id");

-- CreateIndex
CREATE INDEX "stocks_supplier_id_idx" ON "stocks"("supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_product_id_location_key" ON "stocks"("product_id", "location");

-- CreateIndex
CREATE UNIQUE INDEX "customers_nif_key" ON "customers"("nif");

-- CreateIndex
CREATE INDEX "customers_nif_idx" ON "customers"("nif");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_tax_id_key" ON "suppliers"("tax_id");

-- CreateIndex
CREATE INDEX "invoices_company_id_idx" ON "invoices"("company_id");

-- CreateIndex
CREATE INDEX "invoices_business_unit_id_idx" ON "invoices"("business_unit_id");

-- CreateIndex
CREATE INDEX "invoices_cash_register_id_idx" ON "invoices"("cash_register_id");

-- CreateIndex
CREATE INDEX "invoices_issue_date_idx" ON "invoices"("issue_date");

-- CreateIndex
CREATE INDEX "invoices_type_idx" ON "invoices"("type");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_number_series_key" ON "invoices"("number", "series");

-- CreateIndex
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_items_product_id_idx" ON "invoice_items"("product_id");

-- CreateIndex
CREATE INDEX "invoice_items_vat_status_idx" ON "invoice_items"("vat_status");

-- CreateIndex
CREATE INDEX "payments_invoice_id_idx" ON "payments"("invoice_id");

-- CreateIndex
CREATE INDEX "payments_method_idx" ON "payments"("method");

-- CreateIndex
CREATE INDEX "payments_payment_date_idx" ON "payments"("payment_date");

-- CreateIndex
CREATE INDEX "payments_financial_plan_id_idx" ON "payments"("financial_plan_id");

-- CreateIndex
CREATE INDEX "cash_registers_business_unit_id_idx" ON "cash_registers"("business_unit_id");

-- CreateIndex
CREATE INDEX "cash_registers_status_idx" ON "cash_registers"("status");

-- CreateIndex
CREATE INDEX "cash_registers_operator_id_idx" ON "cash_registers"("operator_id");

-- CreateIndex
CREATE INDEX "cash_movements_cash_register_id_idx" ON "cash_movements"("cash_register_id");

-- CreateIndex
CREATE INDEX "cash_movements_type_idx" ON "cash_movements"("type");

-- CreateIndex
CREATE INDEX "cash_movements_movement_date_idx" ON "cash_movements"("movement_date");

-- CreateIndex
CREATE INDEX "work_shifts_cash_register_id_status_idx" ON "work_shifts"("cash_register_id", "status");

-- CreateIndex
CREATE INDEX "work_shifts_operator_id_idx" ON "work_shifts"("operator_id");

-- CreateIndex
CREATE INDEX "work_shifts_start_time_idx" ON "work_shifts"("start_time");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_first_name_last_name_key" ON "students"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "enrollments_student_id_idx" ON "enrollments"("student_id");

-- CreateIndex
CREATE INDEX "enrollments_class_id_idx" ON "enrollments"("class_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_belts_enrollment_id_belt_id_key" ON "enrollment_belts"("enrollment_id", "belt_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_email_key" ON "instructors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_first_name_last_name_key" ON "instructors"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_school_year_id_key" ON "classes"("name", "school_year_id");

-- CreateIndex
CREATE INDEX "financial_plans_company_id_idx" ON "financial_plans"("company_id");

-- CreateIndex
CREATE INDEX "financial_plans_school_year_id_idx" ON "financial_plans"("school_year_id");

-- CreateIndex
CREATE INDEX "financial_plans_enrollment_id_idx" ON "financial_plans"("enrollment_id");

-- CreateIndex
CREATE INDEX "financial_plans_status_idx" ON "financial_plans"("status");

-- CreateIndex
CREATE INDEX "financial_plans_due_date_idx" ON "financial_plans"("due_date");
