import { shopNavID } from "@/common/constants";
import { type Section } from "@/common/types";

import { NavButton } from "./NavButton";

export const ShopNav = ({
  sections,
}: {
  sections: Record<string, Section>;
}) => {
  return (
    <nav
      id={shopNavID}
      className="no-scrollbar sticky top-0 z-10 flex w-full flex-none gap-2 overflow-x-scroll bg-neutral-50 px-6 py-2 shadow-md md:px-12 md:py-3"
    >
      {Object.values(sections).map((section, sectionIdx) => (
        <NavButton
          sectionId={section.id}
          key={section.id}
          text={section.name}
        />
      ))}
    </nav>
  );
};
