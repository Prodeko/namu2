import { AdminTitle } from "@/components/ui/AdminTitle";
import { CustomerWishes } from "@/components/ui/CustomerWishes";
import { getWishes } from "@/server/db/utils/wish";

const WishAdmin = async () => {
  const wishlist = await getWishes();

  return (
    <div className="flex w-[80%] max-w-screen-lg flex-col gap-8">
      <AdminTitle title="Customer wishes" />
      <CustomerWishes admin initialWishlist={wishlist} />
    </div>
  );
};

export default WishAdmin;
