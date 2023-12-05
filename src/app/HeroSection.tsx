import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="flex flex-grow px-32 h-full">
      <div className="flex w-2/3 flex-col gap-2 items justify-center">
        <h1 className="text-7xl font-black uppercase italic text-pink-500">
          Namukilke
        </h1>
        <p className="font-semibold italic text-pink-400">
          Welcome to Aalto's greatest snack store!
        </p>
      </div>
      <div className="w-1/3 flex-grow relative">
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
