import { HiSparkles } from "react-icons/hi2";

import { getSession } from "@/auth/ironsession";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { CustomerWishes } from "@/components/ui/CustomerWishes";
import { PromptText } from "@/components/ui/PromptText";
import { getUserWishes } from "@/server/db/queries/wish";
import { InvalidSessionError } from "@/server/exceptions/exception";

const Wish = async () => {
  const session = await getSession();
  if (!session) {
    throw new InvalidSessionError({
      message: "Session is invalid",
      cause: "missing_session",
    });
  }
  const wishList = await getUserWishes(session.user.userId);
  return (
    <div className="no-scrollbar flex min-h-0 w-full flex-1 flex-col items-center gap-4 px-12 py-6">
      <div className="flex min-h-0 w-full max-w-screen-lg flex-1 flex-col bg-white  ">
        <CustomerWishes initialWishlist={wishList} />
      </div>
      <div className="flex items-center gap-3 ">
        <PromptText sizing="lg" text="Something missing from our catalogue?" />
        <ThinButton
          buttonType="a"
          href="/wish/new"
          text="Create a New Wish"
          intent="tertiary"
          RightIcon={HiSparkles}
        />
      </div>
    </div>
  );
};

export default Wish;

export const dynamic = "force-dynamic";
