import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const AddFunds = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center space-y-12 rounded-[40px] bg-gray-50">
      <h2 className="mt-24 text-6xl font-bold text-gray-800">Add Funds</h2>
      <hr className="h-px w-[34rem] bg-black opacity-90" />
      <div className="flex flex-col items-center space-y-12 px-32 pb-24 text-2xl">
        {children}
      </div>
    </div>
  );
};
