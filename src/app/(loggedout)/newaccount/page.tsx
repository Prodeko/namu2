import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { BottomCard } from "@/components/ui/BottomCard";
import { CenteredTitle } from "@/components/ui/BottomCard/CenteredTitle";

import { HeroSection } from "../login/HeroSection";
import { CreateAccountForm } from "./CreateAccountForm";

const Shop = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const params = await searchParams;
  // Pre-fill only when arriving from the Keycloak callback (?from=keycloak).
  // On a plain reload the param is absent so fields stay empty, even though
  // the Keycloak session is still live (createAccountAction reads sub directly).
  const kcSession =
    params.from === "keycloak" ? await getServerSession(authOptions) : null;
  const kcData = kcSession?.user?.keycloakSub
    ? ({
        hasKeycloakSession: true,
        kcEmail: kcSession.user.email ?? undefined,
        kcFirstName: kcSession.user.given_name ?? undefined,
        kcLastName: kcSession.user.family_name ?? undefined,
      } as const)
    : undefined;

  return (
    <div className="flex h-dvh w-[100vw] flex-col-reverse lg:flex-row landscape:justify-between landscape:gap-6 landscape:p-6">
      <span className="hidden w-full lg:block">
        <HeroSection />
      </span>
      <BottomCard>
        <CenteredTitle title="Create a new account" />
        <CreateAccountForm kcData={kcData} />
      </BottomCard>
    </div>
  );
};

export default Shop;
