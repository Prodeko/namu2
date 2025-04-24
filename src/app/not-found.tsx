import Image from "next/image";
import { HiArrowLeft } from "react-icons/hi";

import { getBlobUrlByName } from "@/common/blobServiceUtils";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { LoggedoutHeader } from "@/components/ui/Header/LoggedoutHeader";

function NotFoundPage() {
  return (
    <div className="flex h-full w-full flex-col items-center bg-neutral-50">
      <LoggedoutHeader />
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 landscape:w-[60%]">
        <Image
          src={getBlobUrlByName("namu-404.png")}
          alt="404"
          width={300}
          height={300}
          priority
        />
        <h1 className="text-5xl font-bold text-primary-400">404</h1>
        <p className="pb-4 text-lg text-neutral-800">Page not found</p>
        <ThinButton
          LeftIcon={HiArrowLeft}
          href="/login"
          text="Return to login"
          intent="primary"
          buttonType="a"
        />
      </div>
    </div>
  );
}

export default NotFoundPage;
