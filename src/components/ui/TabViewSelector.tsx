import { type ComponentProps } from "react";
import { useState } from "react";

import { WishObject, WishlistFilter } from "@/common/types";
import { WishNavButton } from "@/components/ui/WishNavButton";

type TabViewSelectorProps = ComponentProps<"div">;

export interface Props extends TabViewSelectorProps {
  tabs: WishlistFilter[];
  onTabChange: (tab: WishlistFilter) => void;
}

const defaultFilter: WishlistFilter = {
  tabname: "All",
  filterMethod: (wishlist: WishObject[]) => wishlist,
};

export const TabViewSelector = ({ tabs, onTabChange, ...props }: Props) => {
  const [activetab, setActivetab] = useState<WishlistFilter>(
    tabs[0] || defaultFilter,
  );

  const getIndicatorLength = (): number => Math.round(100 / tabs.length);
  const getIndicatorPos = (): number =>
    getIndicatorLength() * tabs.indexOf(activetab);

  const getIndicatorStyles = () => {
    return {
      width: `${getIndicatorLength()}%`,
      left: `${getIndicatorPos()}%`,
    };
  };

  const tabChanged = (tab: WishlistFilter) => {
    setActivetab(tab);
    onTabChange(tab);
  };

  return (
    <div className="relative flex justify-center">
      {/* Active tab indicator */}
      {tabs.map((tab) => (
        <WishNavButton
          name={tab.tabname}
          intent={activetab === tab ? "active" : "regular"}
          onClick={() => tabChanged(tab)}
          key={tab.tabname}
        />
      ))}
      <div
        className="absolute bottom-0 h-0.5 bg-primary-500 transition-all duration-150"
        style={getIndicatorStyles()}
      />
    </div>
  );
};
