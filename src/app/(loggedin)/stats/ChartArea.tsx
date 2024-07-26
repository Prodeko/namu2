import { useState } from "react";
import colors from "tailwindcss/colors";

import { ChartDataset, ProductsByCategory, Timeframe } from "@/common/types";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { CategoryNode, MultiSelect } from "@/components/ui/Input";
import { StatsChart } from "@/components/ui/StatsChart";
import { useQuery } from "@tanstack/react-query";

const testLabels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
const testDatasets = [
  {
    label: "# of Products",
    data: [12, 19, 3, 5, 2, 3],
    backgroundColor: colors.pink[400],
    borderColor: colors.pink[400],
    borderWidth: 2,
  } as ChartDataset,
];

const availableStats = ["Money spent", "Purchase count"] as const;
type AvailableStat = (typeof availableStats)[number];

const aggregationLevels = ["Product category level", "Product level"] as const;
type AggregationLevel = (typeof aggregationLevels)[number];

interface ProductCategoryAggregation {
  nodes: ProductCategoryFlat[];
}

interface ProductAggregation {
  nodes: ProductCategoryNested[];
}

type Aggregation = ProductCategoryAggregation | ProductAggregation;

interface ProductCategoryFlat {
  id: number;
  name: string;
  isSelected: boolean;
}

interface ProductCategoryNested extends ProductCategoryFlat {
  nodes?: ProductCategoryNested[];
}

export const ChartArea = ({ timeFrame }: { timeFrame: Timeframe }) => {
  const [stat, setStat] = useState<AvailableStat>("Money spent");
  const [aggregation, setAggregation] =
    useState<AggregationLevel>("Product level");
  const [items, setItems] = useState<
    ProductCategoryFlat | ProductCategoryNested
  >();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const {
    data: groupedProductsData,
    isLoading: groupedProductsIsLoading,
    isError: groupedProductsIsError,
  } = useQuery<CategoryNode[]>({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    queryKey: ["stats-products-grouped"],
    queryFn: async () => {
      const query = await fetch("/api/product/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await query.json();
      return json.data;
    },
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["stats-chart-data", timeFrame, aggregation],
    queryFn: async () => {
      try {
        if (aggregation === "Product category level") {
          const query = await fetch(`/api/product/categories/${timeFrame}`);
          const data = await query.json();
          return data;
        }
        if (aggregation === "Product level") {
          const query = await fetch(`/api/product/${timeFrame}`);
          const data = await query.json();
          return data;
        }
        throw new Error("Invalid aggregation level");
      } catch (e) {
        console.error(`There was an error fetching the chart data: ${e}`);
      }
    },
  });

  if (groupedProductsIsLoading) {
    return <div>Loading...</div>;
  }

  if (groupedProductsIsError) {
    return <div>Error...</div>;
  }

  const onSelectAll = () => {
    setSelectedIds(
      () =>
        new Set(
          groupedProductsData.flatMap(
            (category) =>
              category.nodes?.map((node) => node.nodeId).filter(Boolean) || [],
          ),
        ),
    );
  };

  const onClearAll = () => {
    setSelectedIds(new Set());
  };

  const onSelectCategory = (categoryName: string) => {
    const category = groupedProductsData.find(
      (category) => category.categoryName === categoryName,
    );
    if (!category) {
      console.warn(`Category ${categoryName} not found`);
      return;
    }
    setSelectedIds(
      (prev) =>
        new Set([
          ...prev,
          ...(category.nodes?.map((node) => node.nodeId).filter(Boolean) || []),
        ]),
    );
  };

  const onClearCategory = (categoryName: string) => {
    const category = groupedProductsData.find(
      (category) => category.categoryName === categoryName,
    );
    if (!category) {
      console.warn(`Category ${categoryName} not found`);
      return;
    }
    setSelectedIds(
      (prev) =>
        new Set(
          Array.from(prev).filter(
            (id) =>
              !category.nodes?.map((node) => node.nodeId).includes(id) || false,
          ),
        ),
    );
  };

  const onSelectNode = (nodeId: number) => {
    setSelectedIds((prev) => new Set([...prev, nodeId]));
  };

  const onClearNode = (nodeId: number) => {
    setSelectedIds(
      (prev) => new Set(Array.from(prev).filter((id) => id !== nodeId)),
    );
  };

  return (
    <div className="flex flex-col gap-4 px-12 pt-8">
      <div className="grid w-full grid-cols-3 gap-6">
        <DropdownSelect
          key="stats-stat-type"
          labelText="1. Stat type"
          value={stat}
          onValueChange={setStat}
          choices={availableStats}
          className="flex-1"
        />
        <DropdownSelect
          key="stats-aggregation-level"
          labelText="2. Aggregation"
          placeholder="Select aggregation level..."
          choices={aggregationLevels}
          className="flex-1"
        />
        {aggregation === "Product category level" && (
          // Todo
          <div />
        )}
        {aggregation === "Product level" && (
          <MultiSelect
            key="stats-products"
            placeholder="Select products..."
            labelText="3. Products"
            categories={groupedProductsData}
            selectedIds={Array.from(selectedIds)}
            onSelectAll={onSelectAll}
            onClearAll={onClearAll}
            onSelectCategory={onSelectCategory}
            onClearCategory={onClearCategory}
            onSelectNode={onSelectNode}
            onClearNode={onClearNode}
          />
        )}
      </div>
      <StatsChart labels={testLabels} datasets={testDatasets} type={"Bar"} />
    </div>
  );
};
