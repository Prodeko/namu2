// import Wallet from "@public/wallet.jpg";
import { cva } from "class-variance-authority";
import Image from "next/image";
import { type ComponentProps, ForwardedRef } from "react";

import { cn } from "@/lib/utils";

const styles = cva(
  "relative h-40 min-w-[15rem] flex-1 cursor-pointer overflow-hidden rounded-2xl md:h-64 md:rounded-3xl lg:h-80",
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

type RefProps<T extends Props> = T extends LinkProps
  ? ForwardedRef<HTMLAnchorElement>
  : ForwardedRef<HTMLButtonElement>;

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
        className="object-cover"
        sizes="50vw"
        fill
        priority
      />
      <div className="absolute flex h-full w-full flex-col-reverse bg-[linear-gradient(to_top,theme(colors.black/80%),theme(colors.black/0%))] px-4 py-4 md:px-6 md:py-8">
        {bottomText && (
          <span className="text-lg text-neutral-100 md:text-xl">
            {bottomText}
          </span>
        )}
        <span className="text-2xl font-medium text-neutral-50 md:text-4xl">
          {middleText}
        </span>
        <span className="text-xl text-neutral-100 md:text-2xl">{topText}</span>
      </div>
    </div>
  );
};

const Card = ({
  ref,
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
      <a ref={ref as RefProps<LinkProps>} className={styles()} {...props}>
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
    <button
      ref={ref as RefProps<ButtonProps>}
      type={props.type}
      className={cn(styles(), className)}
      {...props}
    >
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

export const CardLoading = ({
  imgAltText,
  bottomText,
  middleText,
  topText,
  className,
}: Omit<Props, "imgFile">) => {
  return (
    <Card
      as="button"
      className={cn(className, "animate-pulse")}
      imgFile={""}
      imgAltText={imgAltText}
      topText={topText}
      middleText={middleText}
      bottomText={bottomText}
    />
  );
};

export default Card;
