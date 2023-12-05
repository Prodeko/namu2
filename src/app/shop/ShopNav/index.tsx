import { useState } from "react";

import { type Section } from "@/common/types";

import { NavButton } from "./NavButton";

export const ShopNav = ({ sections }: { sections: Section[] }) => {
  const [activeSection, setActiveSection] = useState<number>(0);

  return (
    <nav className="no-scrollbar sticky top-0 z-10 flex gap-2 overflow-x-scroll bg-slate-50 px-12 py-3 shadow-md">
      {sections.map((section, sectionIdx) => (
        <NavButton
          key={section.id}
          text={section.name}
          intent={activeSection === sectionIdx ? "active" : "regular"}
          onClick={() => {
            setActiveSection(sectionIdx);
            document.getElementById(section.id)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        />
      ))}
    </nav>
  );
};
