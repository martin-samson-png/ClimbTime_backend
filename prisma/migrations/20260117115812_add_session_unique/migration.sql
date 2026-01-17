/*
  Warnings:

  - A unique constraint covering the columns `[city,name,startedAt]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sessions_city_name_startedAt_key" ON "sessions"("city", "name", "startedAt");
