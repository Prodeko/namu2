"use client";

import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import { HiLogin, HiOutlineUserAdd } from "react-icons/hi";

import { BottomCard } from "@/components/ui/BottomCard";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { Input } from "@/components/ui/Input";
import { PromptText } from "@/components/ui/PromptText";

import { HeroSection } from "./HeroSection";

interface FormState {
  pinCode: string;
  userName: string;
}

interface ValidatedFormState {
  pinCode: number;
  userName: string;
}

const Home = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    pinCode: "",
    userName: "",
  });

  const setFormField = (fieldName: keyof FormState) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prevState) => ({
        ...prevState,
        [fieldName]: event.target.value,
      }));
    };
  };

  const validateFormState = (
    formState: FormState | undefined,
  ): ValidatedFormState => {
    if (!formState) {
      throw new Error("Form state is undefined");
    }
    if (!formState.pinCode) {
      throw new Error("PIN code is empty");
    }
    if (!formState.userName) {
      throw new Error("Namu ID is empty");
    }
    const pinCode = parseInt(formState.pinCode);
    if (Number.isNaN(pinCode)) {
      throw new Error("PIN code is not a number");
    }
    if (pinCode < 1000) {
      throw new Error("PIN code is too short");
    }
    return {
      pinCode,
      userName: formState.userName,
    };
  };

  const handleLogin: FormEventHandler<HTMLFormElement> = async (event) => {
    try {
      console.log("MOROO");
      event.preventDefault();
      const validatedForm = validateFormState(formState);
      console.log("SHIT");
      const result = authMutation.mutate(validatedForm);
      console.log("FORMIRESULTTI", result);
    } catch (error) {
      console.log("error", error);
      console.error(error);
    }
  };

  return (
    <>
      <HeroSection />
      <BottomCard>
        <h2 className="text-4xl font-bold text-neutral-700">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="flex w-full flex-col gap-6">
          <Input
            onChange={setFormField("userName")}
            placeholderText={"Namu ID"}
          />
          <Input
            type="number"
            placeholderText={"PIN"}
            onChange={setFormField("pinCode")}
          />
          <FatButton
            buttonType="button"
            type="submit"
            text="Login"
            intent="primary"
            RightIcon={HiLogin}
          />
        </form>
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
