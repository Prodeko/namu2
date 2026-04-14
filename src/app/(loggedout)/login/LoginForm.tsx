"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiLogin, HiUserCircle } from "react-icons/hi";

import { RFID_ALLOWED_DEVICE_TYPE, getDeviceType } from "@/common/utils";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { RfidLoginDialog } from "@/components/ui/RfidLoginDialog";
import { useShoppingCart } from "@/state/useShoppingCart";
import { DeviceType } from "@prisma/client";

export const LoginForm = () => {
  const router = useRouter();
  const toastIdRef = useRef<string>("");
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.MOBILE);
  const [isPending, setIsPending] = useState(false);
  const [isKeycloakPending, setIsKeycloakPending] = useState(false);
  const [userName, setUserName] = useState("");
  const [pinCode, setPinCode] = useState("");

  const { clearCart } = useShoppingCart();
  useEffect(() => {
    clearCart();
    // Getdevicetype references navigator which is not defined before page load
    setDeviceType(getDeviceType());
  }, [clearCart]);

  const showError = (message: string) => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
    toastIdRef.current = toast.error(message);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/shop",
      userName,
      pinCode,
      deviceType,
    });

    setIsPending(false);

    if (result?.error) {
      showError("Invalid username or PIN code");
      return;
    }

    router.push(result?.url ?? "/shop");
    router.refresh();
  };

  const onKeycloakLogin = async () => {
    setIsKeycloakPending(true);
    await signIn("keycloak", {
      callbackUrl: "/auth/callback?intent=login",
    });
    setIsKeycloakPending(false);
  };

  const SubmitButton = () => {
    return (
      <FatButton
        buttonType="button"
        type="submit"
        text={isPending ? "Logging in..." : "Login"}
        intent="primary"
        RightIcon={HiLogin}
        loading={isPending}
        className="w-full"
        fullwidth
      />
    );
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-5">
        <InputWithLabel
          labelText="Namu ID"
          placeholder={"Namu Käyttäjä"}
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
        <input type="hidden" name="deviceType" value={deviceType} readOnly />
      </div>
      <div className="flex w-full flex-col gap-4">
        <SubmitButton />
        {deviceType === RFID_ALLOWED_DEVICE_TYPE && <RfidLoginDialog />}
        {deviceType !== RFID_ALLOWED_DEVICE_TYPE && (
          <FatButton
            buttonType="button"
            type="button"
            onClick={onKeycloakLogin}
            text={isKeycloakPending ? "Redirecting..." : "Prodeko Login"}
            intent="secondary"
            RightIcon={HiUserCircle}
            loading={isKeycloakPending}
            fullwidth
          />
        )}
      </div>
    </form>
  );
};
