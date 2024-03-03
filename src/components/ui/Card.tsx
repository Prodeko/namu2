// import Wallet from "@public/wallet.jpg";
import { cva } from "class-variance-authority";
import Image from "next/image";
import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

const styles = cva(
  "relative h-48 flex-1 cursor-pointer overflow-hidden rounded-3xl md:h-64 lg:h-80",
);

interface BaseProps {
  imgFile: string;
  imgAltText: string;
  topText?: string;
  middleText?: string;
  bottomText?: string;
}

interface ButtonProps extends ComponentProps<"button">, BaseProps {
  as: "button";
  className?: string;
}
interface LinkProps extends ComponentProps<"a">, BaseProps {
  as: "a";
  href: string;
  className?: string;
}

type Props = LinkProps | ButtonProps;

const Content = ({
  imgFile,
  imgAltText,
  bottomText,
  middleText,
  topText,
}: BaseProps) => {
  return (
    <div className="relative h-full w-full bg-primary-50 text-left">
      <Image
        src={`/${imgFile}`}
        alt={imgAltText}
        style={{ objectFit: "cover" }}
        fill
        priority
      />
      <div className="absolute flex h-full w-full flex-col-reverse bg-[linear-gradient(to_top,theme(colors.black/80%),theme(colors.black/0%))] px-6 py-8">
        {bottomText && (
          <span className="text-xl text-neutral-100">{bottomText}</span>
        )}
        <span className="text-4xl font-medium text-neutral-50">
          {middleText}
        </span>
        <span className="text-2xl text-neutral-100">{topText}</span>
      </div>
    </div>
  );
};

const Card = ({
  imgFile,
  imgAltText,
  bottomText,
  middleText,
  topText,
  className,
  ...props
}: Props) => {
  if (props.as === "a") {
    return (
      <a className={styles()} {...props}>
        <Content
          imgFile={imgFile}
          imgAltText={imgAltText}
          bottomText={bottomText}
          middleText={middleText}
          topText={topText}
        />
      </a>
    );
  }
  return (
    <button type="button" className={cn(styles(), className)} {...props}>
      <Content
        imgFile={imgFile}
        imgAltText={imgAltText}
        bottomText={bottomText}
        middleText={middleText}
        topText={topText}
      />
    </button>
  );
};

export default Card;
