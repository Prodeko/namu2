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
        className="px-4 align-middle md:px-12"
      />
      <div className="flex flex-grow flex-col pt-4 md:pt-6">{children}</div>
    </div>
  );
};
