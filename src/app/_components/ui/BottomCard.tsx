import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const BottomCard = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-full items-center gap-12 rounded-t-[80px] bg-gray-50 px-32 py-24">
      {children}
    </div>
  );
};
