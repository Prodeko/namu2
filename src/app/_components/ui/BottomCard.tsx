import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const BottomCard = ({ children }: Props) => {
  return (
    <div className="flex h-full flex-col items-center gap-12 rounded-t-[80px] bg-white px-32 py-24">
      {children}
    </div>
  );
};
