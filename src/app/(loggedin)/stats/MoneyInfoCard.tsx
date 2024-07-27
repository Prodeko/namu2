import { HiCurrencyDollar } from "react-icons/hi";

import type { Timeframe } from "@/common/types";
import { InfoCard, InfoCardLoading } from "@/components/ui/InfoCard";
import { useQuery } from "@tanstack/react-query";

export const MoneyInfoCard = ({ timeFrame }: { timeFrame: Timeframe }) => {
  const title = "Money spent";
  const { data, isLoading, isError } = useQuery<number | null>({
    queryKey: ["stats-transaction-money-spent", timeFrame],
    queryFn: async () => {
      const query = await fetch(
        `/api/stats/transactions/money?${new URLSearchParams({
          timeFrame,
        }).toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const json = await query.json();
      return json.data;
    },
  });

  if (isLoading) {
    return <InfoCardLoading title={title} Icon={HiCurrencyDollar} />;
  }

  if (isError) {
    return (
      <InfoCard title={title} data={"Not found"} Icon={HiCurrencyDollar} />
    );
  }

  return (
    <InfoCard
      title={title}
      data={data?.toString() || "No money spent"}
      Icon={HiCurrencyDollar}
    />
  );
};
