-- CreateTable
CREATE TABLE "BudgetLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parentId" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BudgetLine_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BudgetLine" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BudgetAllocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "budgetLineId" TEXT NOT NULL,
    "costCenter" TEXT NOT NULL,
    "amountPlanned" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BudgetAllocation_budgetLineId_fkey" FOREIGN KEY ("budgetLineId") REFERENCES "BudgetLine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CostEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "vendor" TEXT,
    "budgetLineId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "oneOffDate" DATETIME,
    "amountTotal" DECIMAL NOT NULL,
    "amountPerPeriod" DECIMAL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CostEntry_budgetLineId_fkey" FOREIGN KEY ("budgetLineId") REFERENCES "BudgetLine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CostSplit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "costEntryId" TEXT NOT NULL,
    "costCenter" TEXT NOT NULL,
    "percent" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CostSplit_costEntryId_fkey" FOREIGN KEY ("costEntryId") REFERENCES "CostEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "costEntryId" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PaymentSchedule_costEntryId_fkey" FOREIGN KEY ("costEntryId") REFERENCES "CostEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BudgetLine_parentId_idx" ON "BudgetLine"("parentId");

-- CreateIndex
CREATE INDEX "BudgetLine_type_idx" ON "BudgetLine"("type");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetLine_name_type_parentId_key" ON "BudgetLine"("name", "type", "parentId");

-- CreateIndex
CREATE INDEX "BudgetAllocation_year_costCenter_idx" ON "BudgetAllocation"("year", "costCenter");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetAllocation_year_budgetLineId_costCenter_key" ON "BudgetAllocation"("year", "budgetLineId", "costCenter");

-- CreateIndex
CREATE INDEX "CostEntry_type_status_idx" ON "CostEntry"("type", "status");

-- CreateIndex
CREATE INDEX "CostEntry_budgetLineId_idx" ON "CostEntry"("budgetLineId");

-- CreateIndex
CREATE UNIQUE INDEX "CostSplit_costEntryId_costCenter_key" ON "CostSplit"("costEntryId", "costCenter");

-- CreateIndex
CREATE INDEX "PaymentSchedule_dueDate_status_idx" ON "PaymentSchedule"("dueDate", "status");

-- CreateIndex
CREATE INDEX "PaymentSchedule_costEntryId_idx" ON "PaymentSchedule"("costEntryId");
