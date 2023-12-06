import Image from "next/image";

import { AddFunds as AddFundsComponent } from "@/app/_components/ui/AddFunds";
import { ConfirmationButton } from "@/app/_components/ui/ConfirmationButton";
import { Input } from "@/app/_components/ui/Input";

export default function AddFunds() {
  return (
    <main className="bg-primary-400 grid min-h-screen place-content-center gap-3">
      <AddFundsComponent>
        <p className="basis-full text-3xl text-neutral-500">
          Choose the amount you want to add
        </p>
        <div className=" flex w-full flex-col space-y-4">
          <ol className=" text-primary-400 flex w-full basis-full flex-row items-center  space-x-5">
            <button
              type="submit"
              className="w-20 basis-1/4 rounded-xl border-2 border-neutral-200 bg-white py-1"
            >
              5 €
            </button>
            <button
              type="submit"
              className="w-20 basis-1/4 rounded-xl border-2 border-neutral-200 bg-white  py-1"
            >
              10 €
            </button>
            <button
              type="submit"
              className="w-20 basis-1/4 rounded-xl border-2 border-neutral-200 bg-white  py-1"
            >
              15 €
            </button>
            <button
              type="submit"
              className="w-20 basis-1/4 rounded-xl border-2 border-neutral-200 bg-white py-1"
            >
              20 €
            </button>
          </ol>
          <span className="flex w-full flex-row items-center space-x-0">
            <input
              placeholder="Enter amount:"
              className="w-full text-2xl text-neutral-400"
            />
            <div className="w-40">
              <Input maxLength={3} placeholderText="0,00 €" />
            </div>
          </span>
        </div>
        <ConfirmationButton yes={"Proceed"} no={"Cancel"} />
      </AddFundsComponent>
      <AddFundsComponent>
        <div className="flew">
          <span className="flex w-[463px] items-center">
            <p className="text-neutral-700 ">
              Scan the following code with MobilePay or tap below to pay
            </p>
            <Image src={`/${"QRcode.png"}`} alt="qr-code" />
          </span>
        </div>
        <div className="w-full space-y-4">
          <button
            type="submit"
            className="border-mobilepay bg-mobilepay w-full rounded-full border-4 py-2 text-white"
          >
            MobilePay
          </button>
          <ConfirmationButton yes={"Go Back"} no={"Done"} />
        </div>
      </AddFundsComponent>
    </main>
  );
}
