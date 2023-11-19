import { AddFunds as AddFundsComponent } from "@/app/_components/ui/AddFunds";
import { Input } from "@/app/_components/ui/Input";
import { ConfirmationButton } from "@/app/_components/ui/ConfirmationButton";
import Image from "next/image";

export default function AddFunds() {
	return (
		<main className="grid min-h-screen place-content-center gap-3 bg-pink-400">
			<AddFundsComponent>
				<p className="basis-full text-3xl text-gray-500">
					Choose the amount you want to add
				</p>
				<div className=" flex w-full flex-col space-y-4">
					<ol className=" flex w-full basis-full flex-row items-center space-x-5  text-pink-400">
						<button
							type="submit"
							className="w-20 basis-1/4 rounded-xl border-2 border-gray-200 bg-white py-1"
						>
							5 €
						</button>
						<button
							type="submit"
							className="w-20 basis-1/4 rounded-xl border-2 border-gray-200 bg-white  py-1"
						>
							10 €
						</button>
						<button
							type="submit"
							className="w-20 basis-1/4 rounded-xl border-2 border-gray-200 bg-white  py-1"
						>
							15 €
						</button>
						<button
							type="submit"
							className="w-20 basis-1/4 rounded-xl border-2 border-gray-200 bg-white py-1"
						>
							20 €
						</button>
					</ol>
					<span className="flex w-full flex-row items-center space-x-0">
						<a className="w-full text-2xl text-gray-400">Enter amount:</a>
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
						<p className="text-gray-700 ">
							Scan the following code with MobilePay or tap below to pay
						</p>
						<Image src={`/${"QRcode.png"}`} alt="qr-code" />
					</span>
				</div>
				<div className="w-full space-y-4">
					<button
						type="submit"
						className="w-full rounded-full border-4 border-[#5A78FF] bg-[#5A78FF] py-2 text-white"
					>
						MobilePay
					</button>
					<ConfirmationButton yes={"Go Back"} no={"Done"} />
				</div>
			</AddFundsComponent>
		</main>
	);
}
