// import Wallet from "@public/wallet.jpg";
import Image from "next/image";
import { type ComponentProps } from "react";

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
    <>
      <Image
        src={`/${imgFile}`}
        alt={imgAltText}
        className="h-full w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 flex h-full w-full flex-col-reverse bg-[linear-gradient(to_top,theme(colors.black/90%),theme(colors.black/5%))] px-6 py-8">
        {bottomText && (
          <span className="text-xl text-gray-100">{bottomText}</span>
        )}
        <span className="text-4xl font-medium text-gray-50">{middleText}</span>
        <span className="text-2xl text-gray-100">{topText}</span>
      </div>
    </>
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
      <a className="relative h-56 overflow-hidden rounded-3xl" {...props}>
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
    <button className="relative h-56 overflow-hidden rounded-3xl" {...props}>
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
