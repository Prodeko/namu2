import { HiLogin, HiOutlineUserAdd } from "react-icons/hi";

import { BottomCard } from "@/components/ui/BottomCard";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { Input } from "@/components/ui/Input";

import { HeroSection } from "./HeroSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <BottomCard>
        <h2 className="text-4xl font-bold text-neutral-700">
          Login to Your Account
        </h2>
        <div className="flex w-full flex-col gap-6">
          <Input placeholderText={"Namu ID"} />
          <Input type="number" placeholderText={"PIN"} />
          <FatButton
            buttonType="a"
            href="/shop"
            text="Login"
            intent="primary"
            RightIcon={HiLogin}
          />
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          <span className="text-2xl text-neutral-500">
            {"Don't have an account?"}
          </span>
          <ThinButton
            buttonType="a"
            href="/newaccount"
            className="text-primary-300"
            text="Sign up"
            RightIcon={HiOutlineUserAdd}
            intent="tertiary"
          />
        </div>
      </BottomCard>
    </>
  );
};

export default Home;