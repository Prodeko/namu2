import { HiLockClosed, HiLogin, HiOutlineUserAdd } from "react-icons/hi";

import { BottomCard } from "@/app/_components/ui/BottomCard";
import { ThinButton } from "@/app/_components/ui/Buttons/ThinButton";
import { Header } from "@/app/_components/ui/Header";
import { Input } from "@/app/_components/ui/Input";

import { HeroSection } from "./HeroSection";
import { FatButton } from "@/app/_components/ui/Buttons/FatButton";

const Home = () => {
  return (
    <main className="min-h-screen flex flex-col bg-pink-200">
      <Header
        RightComponent={
          <ThinButton buttonType="button" text="Admin" RightIcon={HiLockClosed} intent="secondary" />
        }
      />
      <HeroSection />
      <BottomCard>
        <h2 className="text-4xl font-bold text-gray-700">
          Login to Your Account
        </h2>
        <div className="flex w-full flex-col gap-6">
          <Input placeholderText={"Namu ID"} />
          <Input type="number" placeholderText={"PIN"} />
          <FatButton buttonType="button" text="Login" intent="primary" RightIcon={HiLogin} />
        </div>
        <div className="flex w-full gap-4 justify-end items-center">
          <span className="text-2xl text-slate-500">{"Don't have an account?"}</span>
          <ThinButton buttonType="a" href="/newaccount" className="text-pink-300" text="Sign up" RightIcon={HiOutlineUserAdd} intent="tertiary" />
        </div>
      </BottomCard>
    </main>
  );
};

export default Home;
