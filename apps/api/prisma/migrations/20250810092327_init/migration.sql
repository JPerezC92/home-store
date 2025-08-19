-- CreateTable
CREATE TABLE "payment_method" (
    "payment_method_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("payment_method_id")
);

-- CreateTable
CREATE TABLE "income" (
    "income_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "sender_name" VARCHAR(100),
    "payment_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "payment_method_id" TEXT NOT NULL,

    CONSTRAINT "income_pkey" PRIMARY KEY ("income_id")
);

-- CreateTable
CREATE TABLE "expense" (
    "expense_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "payment_method_id" TEXT NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("expense_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_name_key" ON "payment_method"("name");

-- CreateIndex
CREATE INDEX "payment_method_name_active_idx" ON "payment_method"("name", "active");

-- AddForeignKey
ALTER TABLE "income" ADD CONSTRAINT "income_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_method"("payment_method_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_method"("payment_method_id") ON DELETE RESTRICT ON UPDATE CASCADE;
