import { AdminTitle } from "@/components/ui/AdminTitle";
import { CustomerWishes } from "@/components/ui/CustomerWishes";
import { getWishes } from "@/server/db/queries/wish";

const WishAdmin = async () => {
  const wishlist = await getWishes();

  return (
    <div className="flex w-full max-w-screen-lg flex-col gap-4 md:gap-8">
      <AdminTitle title="Customer wishes" />
      <span className="px-5 md:px-12">
        <CustomerWishes admin initialWishlist={wishlist} />
      </span>
    </div>
  );
};

export default WishAdmin;
