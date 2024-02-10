import { HiOutlineUserAdd } from "react-icons/hi";

import { BottomCard } from "@/components/ui/BottomCard";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { PromptText } from "@/components/ui/PromptText";

import { HeroSection } from "./HeroSection";
import { LoginForm } from "./LoginForm";

const Home = () => {
  return (
    <>
      <HeroSection />
      <BottomCard>
        <h2 className="text-4xl font-bold text-neutral-700">
          Login to Your Account
        </h2>
        <LoginForm />
        <div className="flex w-full items-center justify-end gap-4">
          <PromptText sizing="2xl" text="Don't have an account?" />
          <ThinButton
            buttonType="a"
            href="/newaccount"
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
