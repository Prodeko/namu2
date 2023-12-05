import Image from "next/image";
import { HiOutlineDownload } from "react-icons/hi";

import { BackButton } from "@/app/_components/ui/BackButton";
import { ThinButton } from "@/app/_components/ui/Buttons/ThinButton";
import { DropDownList } from "@/app/_components/ui/DropDownList";
import { Header } from "@/app/_components/ui/Header";
import { Logo } from "@/app/_components/ui/Logo";
import { NavBar } from "@/app/_components/ui/Navbar";
import { SectionTitle } from "@/app/_components/ui/SectionTitle";
import { TextArea } from "@/app/_components/ui/TextArea";

const Wish = () => {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Header
        LeftComponent={<Logo />}
        RightComponent={<NavBar />}
      />
      <div className="px-28 py-20 flex flex-grow flex-col gap-5 ">
        <BackButton href="/shop" />
        <SectionTitle
          title="Something missing from our catalog?"
          className="text-3xl font-bold"
        />
        <div className="flex flex-row gap-4 w-full text-xl">
          <p>
            Don&apos;t worry, Namu CEO is here for you! Just drop your wishes in
            the following form and you might find the product in our shelves in
            the upcoming weeks 😎
          </p>
          <Image
            src={`/${"candy.png"}`}
            alt="namuja"
            width={300}
            height={300}
          />
        </div>
        <DropDownList placeHolderText="Choose a category..." />
        <TextArea
          text="Give Namu CEO all the relevant information about the product in question..."
          description="Detailed Information"
        />
        <ThinButton buttonType="button" text="Submit your Wish" intent="primary" RightIcon={HiOutlineDownload} />
      </div>
    </main>
  );
};

export default Wish;
