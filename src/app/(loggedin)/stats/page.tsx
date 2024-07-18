import { HiCurrencyDollar, HiStar } from "react-icons/hi";

import { getSession } from "@/auth/ironsession";
import Card from "@/components/ui/Card";
import { InfoCard } from "@/components/ui/InfoCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { db } from "@/server/db/prisma";

import { ChartArea } from "./ChartArea";

const StatsPage = async () => {
  const session = await getSession();

  if (!session) {
    throw new Error("User session was not available");
  }

  const userId = session.user.userId;

  const productQuery = (await db.$queryRaw`
    SELECT "name", SUM(quantity) as totalquantity
    FROM "TransactionItem"
    JOIN "Product" ON "productId" = "Product"."id"
    WHERE "transactionId" IN (
      SELECT "id"
      FROM "Transaction"
      WHERE "userId" = ${userId}
    )
    GROUP BY "productId", "name"
    ORDER BY totalQuantity DESC
    LIMIT 1;
  `) as { name: string; totalquantity: bigint }[];
  const product = productQuery[0];

  const mostBoughtProduct =
    product !== undefined
      ? {
          name: product.name,
          totalQuantity: Number(product.totalquantity),
        }
      : {
          name: "No product",
          totalQuantity: 0,
        };

  const transactionCount = await db.transaction.count({
    where: {
      userId,
    },
  });

  return (
    <div className="flex h-full w-full flex-grow flex-col gap-8 bg-neutral-50 p-12">
      <SectionTitle title="Stats dashboard" />
      <div className="grid w-full grid-cols-3 gap-6">
        <Card
          imgFile="pepsi.jpg"
          imgAltText="Pepsi"
          middleText="Pepsi"
          topText="Product of the month"
          as="button"
          className="col-span-2 max-h-72 w-full"
        />
        <div className="flex flex-1 flex-col gap-6">
          <InfoCard
            title="Total purchases"
            data={transactionCount.toString()}
            Icon={HiCurrencyDollar}
          />
          <InfoCard
            title="Favorite product"
            data={`${mostBoughtProduct.name}: ${mostBoughtProduct.totalQuantity}`}
            Icon={HiStar}
          />
        </div>
      </div>
      <ChartArea />
    </div>
  );
};

export default StatsPage;
