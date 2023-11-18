import { useState } from "react"

import { type ButtonVariants, NavButton } from "./NavButton"

export const ShopNav = () => {
  const sectionNames = [
    "Featured",
    "Drinks",
    "Snack",
    "Meals",
    "Candy",
    "Chips",
    "Raineris",
    "Yoghurts",
  ]
  const [activeSection, setActiveSection] = useState<number>(0)

  const chooseButtonIntent = (
    activeSectionNumber: number,
    sectionIdx: number,
  ): ButtonVariants => {
    return {
      intent: activeSectionNumber === sectionIdx ? "active" : "regular",
    }
  }

  const scrollToSection = (sectionIdx: number) => {
    setActiveSection(sectionIdx)
    const element = document.querySelectorAll(".category")[sectionIdx]
    if (!element) return
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <nav className="no-scrollbar sticky top-0 z-10 flex gap-2 overflow-x-scroll bg-gray-50 px-12 py-3 shadow-md">
      {sectionNames.map((name, idx) => (
        <NavButton
          key={name}
          text={name}
          intent={chooseButtonIntent(activeSection, idx).intent}
          onClick={() => scrollToSection(idx)}
        />
      ))}
    </nav>
  )
}
