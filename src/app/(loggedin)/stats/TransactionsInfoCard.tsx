import { GrTransaction } from "react-icons/gr";

import type { Timeframe } from "@/common/types";
import { InfoCard, InfoCardLoading } from "@/components/ui/InfoCard";
import { useQuery } from "@tanstack/react-query";

export const TransactionsInfoCard = ({
  timeFrame,
}: {
  timeFrame: Timeframe;
}) => {
  const title = "Total transactions";
  const { data, isLoading, isError } = useQuery<number>({
    queryKey: ["stats-transaction-count", timeFrame],
    queryFn: async () => {
      const query = await fetch(
        `/api/stats/transactions/count?${new URLSearchParams({
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
    return <InfoCardLoading title={title} Icon={GrTransaction} />;
  }

  if (isError) {
    return <InfoCard title={title} data={"Not found"} Icon={GrTransaction} />;
  }

  return <InfoCard title={title} data={data.toString()} Icon={GrTransaction} />;
};
