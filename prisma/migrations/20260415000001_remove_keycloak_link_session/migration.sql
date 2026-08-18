-- Drop KeycloakLinkSession table and its enum (replaced by direct keycloak-qr provider flow)
ALTER TABLE "KeycloakLinkSession" DROP CONSTRAINT "KeycloakLinkSession_userId_fkey";

DROP INDEX "KeycloakLinkSession_userId_idx";

DROP TABLE "KeycloakLinkSession";

DROP TYPE "KeycloakLinkSessionStatus";
