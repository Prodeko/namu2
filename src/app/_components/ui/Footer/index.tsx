import { HiChartBar, HiHome, HiPencil, HiUserCircle } from "react-icons/hi2";

import { FooterLink } from "./FooterLink";

export const Footer = () => {
  return (
    <footer className="sticky bottom-0 flex w-full items-center justify-around gap-4 border-t-2 border-pink-400 bg-pink-50 py-8 text-white">
      <FooterLink Icon={HiHome} href="/shop" pageName="Home" />
      <FooterLink Icon={HiPencil} href="/wish" pageName="Wish" />
      <FooterLink Icon={HiChartBar} href="/stats" pageName="Stats" />
      <FooterLink Icon={HiUserCircle} href="/account" pageName="Account" />
    </footer>
  );
};
