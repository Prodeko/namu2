import type { FavouriteProduct, Timeframe } from "@/common/types";
import Card, { CardLoading } from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";

const title = "Favourite product";

export const FavouriteProductCard = ({
  timeFrame,
}: {
  timeFrame: Timeframe;
}) => {
  const { data, isLoading, isError } = useQuery<FavouriteProduct>({
    queryKey: ["stats-favourite-product-data", timeFrame],
    queryFn: async () => {
      const query = await fetch(
        "/api/stats/products/favourite?" +
          new URLSearchParams({ timeFrame }).toString(),
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
    return (
      <CardLoading
        as="button"
        imgAltText="Loading image"
        bottomText="Loading..."
        middleText={title}
        className="col-span-2 w-full"
      />
    );
  }

  if (isError) {
    return (
      <Card
        as="button"
        imgFile=""
        imgAltText="Favourite image - not found"
        middleText={title}
        bottomText="Image not found"
        className="col-span-2 w-full"
      />
    );
  }

  return (
    <Card
      as="button"
      imgFile={"pepsi.jpg"} // TODO! Replace with imageUrl
      imgAltText={data.name}
      middleText={title}
      bottomText={`${data.name} - bought ${data.totalQuantity} times`}
      className="col-span-2 w-full"
    />
  );
};
