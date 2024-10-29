import Image from "next/image";

import { getBlobUrlByName } from "@/common/blobServiceUtils";

export const HeroSection = () => {
  return (
    <section className="flex h-full flex-grow items-center gap-2 px-0 md:h-1/4 md:px-24 lg:px-0">
      <div className="items flex flex-1 flex-col items-center justify-center gap-2 md:items-start landscape:items-center">
        <h1 className="text-5xl font-black uppercase italic text-primary-500 md:text-7xl">
          Namukilke
        </h1>
        <p className="text-md font-semibold italic text-primary-400 md:text-2xl lg:text-3xl">
          Aalto's greatest snack store!
        </p>
      </div>
      <div className="relative hidden h-96 w-1/3 md:block lg:hidden">
        <Image
          src={getBlobUrlByName("lollipop.png")}
          alt="Lollipop"
          className="object-contain"
          fill
        />
      </div>
    </section>
  );
};
