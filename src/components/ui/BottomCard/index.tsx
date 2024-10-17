import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const BottomCard = ({ children }: Props) => {
  return (
    <div className="flex h-full w-full flex-col items-center gap-6 rounded-t-[35px] bg-white px-10 py-12 drop-shadow md:gap-12 md:rounded-t-[80px] md:px-32 md:py-24 lg:max-w-[50vw] lg:rounded-[40px] landscape:h-full landscape:justify-center landscape:gap-6 landscape:px-24">
      {children}
    </div>
  );
};
