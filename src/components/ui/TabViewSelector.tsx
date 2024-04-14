"use client";

import { type ComponentProps } from "react";

import { WishNavButton } from "@/components/ui/WishNavButton";
import { type TabKey, activeTab, tabKeys, tabs } from "@/state/tabs";
import { useSignals } from "@preact/signals-react/runtime";

type TabViewSelectorProps = ComponentProps<"div">;

export type Props = TabViewSelectorProps;

export const TabViewSelector = ({ ...props }: Props) => {
  useSignals();
  const getIndicatorLength = (): number => Math.round(100 / tabKeys.length);
  const getIndicatorPos = (): number =>
    getIndicatorLength() * tabKeys.indexOf(activeTab.value);

  const getIndicatorStyles = () => {
    return {
      width: `${getIndicatorLength()}%`,
      left: `${getIndicatorPos()}%`,
    };
  };

  const tabChanged = (tab: TabKey) => {
    activeTab.value = tab;
  };

  return (
    <nav className="relative flex flex-none justify-center">
      {/* Active tab indicator */}
      {tabKeys.map((tabKey) => (
        <WishNavButton
          name={tabs[tabKey].tabname}
          intent={activeTab.value === tabKey ? "active" : "regular"}
          onClick={() => tabChanged(tabKey)}
          key={tabKey}
        />
      ))}
      <div
        className="absolute bottom-0 h-0.5 bg-primary-500 transition-all duration-150"
        style={getIndicatorStyles()}
      />
    </nav>
  );
};
