import { Button } from "@/app/_components/ui/Button";
import { DropDownList } from "@/app/_components/ui/DropDownList";
import { BackButton } from "@/app/_components/ui/BackButton";
import { Header } from "@/app/_components/ui/Header";
import { Logo } from "@/app/_components/ui/Logo";
import { NavBar } from "@/app/_components/ui/Navbar";
import { SectionTitle } from "@/app/_components/ui/SectionTitle";
import { TextArea } from "@/app/_components/ui/TextArea";
import Image from "next/image";
import { HiOutlineDownload } from "react-icons/hi";

const Wish = () => {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-50">
      <Header
        LeftComponent={<Logo text="Namukilke" />}
        RightComponent={<NavBar text="Stats" initials="AH" />}
      />
      <div className="mx-28 my-20 flex flex-grow flex-col gap-5 ">
        <BackButton href="/shop" />
        <SectionTitle
          title="Something missing from our catalog?"
          className="text-3xl font-bold"
        />
        <span className="flex">
          <div className="text-xl">
            Don&apos;t worry, Namu CEO is here for you! Just drop your wishes in
            the following form and you might find the product in our shelves in
            the upcoming weeks 😎
          </div>
          <Image
            src={`/${"namuja.png"}`}
            alt="namuja"
            className="h-40 object-cover"
          />
        </span>
        <DropDownList placeHolderText="Choose a category..." />
        <TextArea
          text="Give Namu CEO all the relevant information about the product in question..."
          description="Detailed Information"
        />
        <Button text="Submit your Wish" Icon={HiOutlineDownload} />
      </div>
    </main>
  );
};

export default Wish;
