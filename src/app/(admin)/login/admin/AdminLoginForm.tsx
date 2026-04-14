"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { HiLogin } from "react-icons/hi";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { DeviceType } from "@prisma/client";

export const AdminLoginForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [userName, setUserName] = useState("");
  const [pinCode, setPinCode] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/admin/edit-products",
      userName,
      pinCode,
      deviceType: DeviceType.MOBILE,
      adminOnly: "true",
    });

    setIsPending(false);

    if (result?.error) {
      toast.error("Invalid admin credentials");
      return;
    }

    router.push(result?.url ?? "/admin/edit-products");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-6">
      <InputWithLabel
        labelText="Namu ID"
        placeholder={"Namu Admin"}
        name="userName"
        autoCapitalize="none"
        spellCheck="false"
        value={userName}
        onChange={(event) => setUserName(event.target.value)}
        required
      />
      <InputWithLabel
        labelText="Pin Code"
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={"1234"}
        name="pinCode"
        value={pinCode}
        onChange={(event) => setPinCode(event.target.value)}
        required
      />
      <FatButton
        buttonType="button"
        type="submit"
        text="Login"
        intent="primary"
        loading={isPending}
        RightIcon={HiLogin}
      />
      <input type="hidden" name="deviceType" value={DeviceType.MOBILE} />
    </form>
  );
};
