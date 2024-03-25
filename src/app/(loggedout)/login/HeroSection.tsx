import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="flex h-full flex-grow px-32">
      <div className="items flex w-2/3 flex-col justify-center gap-2">
        <h1 className="text-7xl font-black uppercase italic text-primary-500">
          Namukilke
        </h1>
        <p className="font-semibold italic text-primary-400">
          Welcome to Aalto's greatest snack store!
        </p>
      </div>
      <div className="relative w-1/3 flex-grow">
        <Image
          src="/lollipop.png"
          alt="Lollipop"
          className="object-contain"
          fill
        />
      </div>
    </section>
  );
};
