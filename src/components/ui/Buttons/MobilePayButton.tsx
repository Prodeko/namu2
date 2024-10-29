import Image from "next/image";
import { ComponentPropsWithRef } from "react";

import { getBlobUrlByName } from "@/common/blobServiceUtils";

interface ButtonProps extends ComponentPropsWithRef<"a"> {
  text: string;
  href: string;
}

export const MobilePayButton = ({ text, href, ...props }: ButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#5A78FF] px-10 py-3 text-xl font-medium text-white md:w-[25rem]"
      {...props}
    >
      <div className="relative h-6 w-6">
        <Image
          src={getBlobUrlByName("mobilepay_white.png")}
          alt="mobilepay"
          layout="fill"
          objectFit="cover"
        />
      </div>
      {text}
    </a>
  );
};
