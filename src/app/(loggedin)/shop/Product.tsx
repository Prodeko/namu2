import Image from "next/image";
import { type ComponentProps } from "react";

type DivProps = ComponentProps<"div">;

interface Props extends DivProps {
  name: string;
  description: string;
  price: number;
  imageFile: string;
}

export const Product = ({ name, price, description, imageFile }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 flex h-40 flex-col justify-center gap-2">
        <p className="text-3xl font-bold text-neutral-700">{name}</p>
        <p className="text-2xl text-neutral-700">{description}</p>
        <p className="text-primary-400 text-3xl font-semibold">
          {price.toFixed(2)}€
        </p>
      </div>

      <div className="align-self-center h-40 w-full justify-self-center overflow-hidden rounded-3xl shadow-md">
        <Image
          src={imageFile}
          alt="Test"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};
