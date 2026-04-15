"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiCheckCircle, HiUser, HiUserAdd, HiUserCircle } from "react-icons/hi";

import { CreateAccountFormState } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { InputWithLabel } from "@/components/ui/Input";
import { MigrationCombobox } from "@/components/ui/MigrationCombobox";
import { createAccountAction } from "@/server/actions/account/create";

type KcData = {
  hasKeycloakSession: true;
  kcEmail?: string;
  kcFirstName?: string;
  kcLastName?: string;
};

export const CreateAccountForm = ({ kcData }: { kcData?: KcData }) => {
  const router = useRouter();
  const toastIdRef = useRef<string>("");
  const [hasOldAccount, setHasOldAccount] = useState(false);
  const [isKeycloakPending, setIsKeycloakPending] = useState(false);

  // Pre-fill form with Keycloak data if available
  const initialFirstName = kcData?.kcFirstName || "";
  const initialLastName = kcData?.kcLastName || "";
  const initialUserName = kcData?.kcEmail || "";

  const [state, formAction, isPending] = useActionState<
    CreateAccountFormState,
    FormData
  >(createAccountAction, {
    firstName: initialFirstName,
    lastName: initialLastName,
    userName: initialUserName,
    pinCode: "",
    confirmPinCode: "",
    message: "",
    legacyAccountId: undefined,
  });

  useEffect(() => {
    if (state.message === "ACCOUNT_CREATED") {
      const completeSignup = async () => {
        const result = await signIn("credentials", {
          redirect: false,
          callbackUrl: "/shop",
          userName: state.userName,
          pinCode: state.pinCode,
          deviceType: "MOBILE",
        });

        if (result?.error) {
          toast.error(
            "Account created, but login failed. Please log in manually.",
          );
          router.push("/login");
          return;
        }

        router.push(result?.url ?? "/shop");
        router.refresh();
      };

      completeSignup();
      return;
    }

    if (state.message) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      const newToastId = toast.error(state.message);
      toastIdRef.current = newToastId;
    }
  }, [state, router]);

  const onKeycloakSignup = async () => {
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
        text={isPending ? "Creating account..." : "Create account"}
        intent="primary"
        RightIcon={HiUserAdd}
        loading={isPending}
        fullwidth
      />
    );
  };

  return (
    <form action={formAction} className="flex w-full flex-col gap-6 md:gap-10">
      <div className="flex flex-col items-center gap-4 md:gap-5">
        {!kcData?.hasKeycloakSession ? (
          <FatButton
            buttonType="button"
            type="button"
            onClick={onKeycloakSignup}
            text={isKeycloakPending ? "Redirecting..." : "Sign up with Prodeko"}
            intent="secondary"
            RightIcon={HiUserCircle}
            loading={isKeycloakPending}
          />
        ) : (
          <div className="flex w-full items-center justify-center gap-2">
            <p className="text-lg text-gray-400 md:text-2xl lg:text-xl">
              Prodeko Account Linked
            </p>
            <HiCheckCircle className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <InputWithLabel
          labelText="First name"
          placeholder="Matti"
          name="firstName"
          defaultValue={state.firstName}
          required
        />
        <InputWithLabel
          labelText="Last name"
          placeholder="Meikäläinen"
          name="lastName"
          defaultValue={state.lastName}
          required
        />
        <InputWithLabel
          labelText="Username"
          placeholder="matti.meikäläinen"
          autoCapitalize="none"
          spellCheck="false"
          name="userName"
          defaultValue={state.userName}
          required
        />
        <div className="grid w-full grid-cols-2 gap-2">
          <InputWithLabel
            labelText="New PIN"
            placeholder="1234"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            name="pinCode"
            defaultValue={state.pinCode}
            required
          />
          <InputWithLabel
            labelText="Retype PIN"
            placeholder="1234"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            name="confirmPinCode"
            defaultValue={state.confirmPinCode}
            required
          />
        </div>
        {!hasOldAccount && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            className="text-bold flex items-center gap-2 py-2 text-lg text-primary-400 underline md:text-2xl lg:text-xl"
            onClick={() => setHasOldAccount(true)}
          >
            <p>Migrate old account</p>
            <HiUser className="inline" />
          </div>
        )}

        {hasOldAccount && <MigrationCombobox />}
      </div>
      <div className="flex flex-col gap-4">
        <SubmitButton />
      </div>
    </form>
  );
};
