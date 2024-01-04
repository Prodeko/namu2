import { useState } from "react";

import { shopNavID } from "@/common/constants";
import { type Section } from "@/common/types";

import { NavButton } from "./NavButton";

export const ShopNav = ({ sections }: { sections: Section[] }) => {
  const [activeSection, setActiveSection] = useState<number>(0);

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      const navbarHeight =
        document.getElementById(shopNavID)?.offsetHeight || 0;
      const offsetPosition = sectionElement.offsetTop - navbarHeight - 32; // 32px for 2rem padding

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      id={shopNavID}
      className="no-scrollbar sticky top-0 z-10 flex gap-2 overflow-x-scroll bg-neutral-50 px-12 py-3 shadow-md"
    >
      {sections.map((section, sectionIdx) => (
        <NavButton
          key={section.id}
          text={section.name}
          intent={activeSection === sectionIdx ? "active" : "regular"}
          onClick={() => {
            setActiveSection(sectionIdx);
            scrollToSection(section.id);
          }}
        />
      ))}
    </nav>
  );
};
