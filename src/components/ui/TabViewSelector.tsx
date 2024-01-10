import { type ComponentProps } from "react";
import { useState } from "react";

import { WishObject, WishlistFilter } from "@/common/types";
import { WishNavButton } from "@/components/ui/WishNavButton";

type TabViewSelectorProps = ComponentProps<"div">;

export interface Props extends TabViewSelectorProps {
  tabs: string[];
  onTabChange: (tab: string) => void;
}

export const TabViewSelector = ({ tabs, onTabChange, ...props }: Props) => {
  const [activetab, setActivetab] = useState<string>(tabs[0] || "");

  const getIndicatorLength = (): number => Math.round(100 / tabs.length);
  const getIndicatorPos = (): number =>
    getIndicatorLength() * tabs.indexOf(activetab);

  const getIndicatorStyles = () => {
    return {
      width: `${getIndicatorLength()}%`,
      left: `${getIndicatorPos()}%`,
    };
  };

  const tabChanged = (tab: string) => {
    setActivetab(tab);
    onTabChange(tab);
  };

  return (
    <div className="relative flex justify-center">
      {/* Active tab indicator */}
      {tabs.map((tab) => (
        <WishNavButton
          name={tab}
          intent={activetab === tab ? "active" : "regular"}
          onClick={() => tabChanged(tab)}
          key={tab}
        />
      ))}
      <div
        className="absolute bottom-0 h-0.5 bg-primary-500 transition-all duration-150"
        style={getIndicatorStyles()}
      />
    </div>
  );
};
