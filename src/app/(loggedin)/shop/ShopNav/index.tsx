import { shopNavID } from "@/common/constants";
import { type Section } from "@/common/types";
import { activeSection } from "@/state/activeSection";
import { useSignals } from "@preact/signals-react/runtime";

import { NavButton } from "./NavButton";

export const ShopNav = ({
  sections,
}: {
  sections: Record<string, Section>;
}) => {
  useSignals();
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
          intent={activeSection.value === section.id ? "active" : "regular"}
        />
      ))}
    </nav>
  );
};
