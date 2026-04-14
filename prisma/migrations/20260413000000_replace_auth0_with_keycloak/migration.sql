-- Drop the Auth0User table (existing data is intentionally discarded)
DROP TABLE IF EXISTS "Auth0User";

-- Rename the AUTH0 enum value to KEYCLOAK
ALTER TYPE "LoginMethod" RENAME VALUE 'AUTH0' TO 'KEYCLOAK';

-- Create the KeycloakUser table
CREATE TABLE "KeycloakUser" (
    "id"          SERIAL PRIMARY KEY,
    "userId"      INTEGER NOT NULL,
    "keycloakSub" VARCHAR(255) NOT NULL,
    "email"       VARCHAR(255),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KeycloakUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "KeycloakUser_userId_key" ON "KeycloakUser"("userId");
CREATE UNIQUE INDEX "KeycloakUser_keycloakSub_key" ON "KeycloakUser"("keycloakSub");
CREATE INDEX "KeycloakUser_keycloakSub_idx" ON "KeycloakUser"("keycloakSub");
