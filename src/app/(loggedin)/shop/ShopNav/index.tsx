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
      className="no-scrollbar sticky top-0 z-10 flex gap-2 overflow-x-scroll bg-neutral-50 px-12 py-3 shadow-md"
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
