-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Budget_projectId_type_key" ON "Budget"("projectId", "type");

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
