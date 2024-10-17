import Image from "next/image";
import { ComponentPropsWithRef } from "react";

interface ButtonProps extends ComponentPropsWithRef<"a"> {
  text: string;
  href: string;
}

export const MobilePayButton = ({ text, href, ...props }: ButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      className="flex w-[25rem] items-center justify-center gap-2 rounded-md bg-[#5A78FF] px-10 py-3 text-xl font-medium text-white"
      {...props}
    >
      <Image
        src={"/mobilepay_white.png"}
        alt="mobilepay"
        width={25}
        height={25}
      />
      {text}
    </a>
  );
};
