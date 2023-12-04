import { HiOutlineCloudUpload } from "react-icons/hi";

import { BottomCard } from "@/app/_components/ui/BottomCard";
import { ThinButton } from "@/app/_components/ui/Buttons/ThinButton";
import { Header } from "@/app/_components/ui/Header";
import { Input } from "@/app/_components/ui/Input";
import { Logo } from "@/app/_components/ui/Logo";

import { TextLine } from "./TextLine";

const Settings = () => {
  return (
    <main className="h-min-screen flex flex-col bg-pink-200">
      <Header LeftComponent={<Logo />} />
      <div className="flex items-center justify-between px-20 py-8">
        <div>
          <h2 className="py-5 pr-5 text-3xl font-bold text-pink-500">
            Namu käyttäjä
          </h2>
          <TextLine label="Namu ID" value="user1" />
          <TextLine label="Account balance" value="10,35€" />
          <TextLine label="Products bought" value="84" />
          <TextLine label="Money spent" value="132,50€" />
        </div>
        <div className="flex h-56 w-56 items-center justify-center rounded-[50%] bg-white text-7xl font-bold uppercase text-pink-500 drop-shadow-md">
          AH
        </div>
      </div>
      <BottomCard>
        <h2 className="text-4xl font-bold text-gray-700">
          Change your settings
        </h2>
        <div className="flex w-full flex-col gap-5 py-2">
          <Input labelText="First name" placeholderText="Matti" />
          <Input labelText="Last name" placeholderText="Meikäläinen" />
          <Input
            labelText="New PIN (minimum 4 digits)"
            placeholderText="1234"
          />
        </div>
        <div className="flex w-full flex-col">
          <ThinButton buttonType="button" text="Save & return" intent="primary" RightIcon={HiOutlineCloudUpload} fullwidth />
        </div>
      </BottomCard>
    </main>
  );
};

export default Settings;
