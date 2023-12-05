// import Wallet from "@public/wallet.jpg";
import { cva } from "class-variance-authority";
import Image from "next/image";
import { type ComponentProps } from "react";

const styles = cva(
  "relative h-48 cursor-pointer overflow-hidden rounded-3xl md:h-64 lg:h-80",
);

interface BaseProps {
  imgFile: string;
  imgAltText: string;
  topText: string;
  middleText: string;
  bottomText?: string;
}

interface ButtonProps extends ComponentProps<"button">, BaseProps {
  as: "button";
}
interface LinkProps extends ComponentProps<"a">, BaseProps {
  as: "a";
  href: string;
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
    <div className="relative h-full w-full text-left">
      <Image
        src={`/${imgFile}`}
        alt={imgAltText}
        objectFit="cover"
        layout="fill"
      />
      <div className="absolute flex h-full w-full flex-col-reverse bg-[linear-gradient(to_top,theme(colors.black/80%),theme(colors.black/0%))] px-6 py-8">
        {bottomText && (
          <span className="text-xl text-gray-100">{bottomText}</span>
        )}
        <span className="text-4xl font-medium text-gray-50">{middleText}</span>
        <span className="text-2xl text-gray-100">{topText}</span>
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
    <button type="button" className={styles()} {...props}>
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
