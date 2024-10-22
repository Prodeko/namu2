import { ReactNode } from "react";

import { SectionTitle } from "../SectionTitle";

interface Props {
  title: string;
  children: ReactNode;
}

export const AccountHistoryLayout = ({ title, children }: Props) => {
  return (
    <div className="flex h-full w-full grow flex-col justify-between bg-white py-12">
      <SectionTitle
        withBackButton
        title={title}
        className="px-6 align-middle md:px-12"
      />
      <div className="flex flex-grow flex-col">{children}</div>
    </div>
  );
};
