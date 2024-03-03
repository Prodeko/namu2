import { type ComponentProps } from "react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";

import { WishObject } from "@/common/types";

import { WishReplyModal } from "../../app/(admin)/admin/wishes/WishReplyModal";
import { IconButton } from "./Buttons/IconButton";

type WishItemProps = ComponentProps<"div">;

interface Props extends WishItemProps {
  wish: WishObject;
  voted: boolean;
  admin?: boolean;
}

// interface Props extends WishItemProps {
//   name: string;
//   wishDate: Date;
//   voteCount: number;
//   voted: boolean;
//   admin?: boolean;
// }

const formatDate = (date: Date) => {
  const day = String(date.getDate()).toString();
  const month = String(date.getMonth() + 1).toString();
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const WishItem = ({ wish, voted, admin = false, ...props }: Props) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b-2 py-6">
      <div>
        <div className="text-3xl font-medium">{wish.name}</div>
        <div className="text-lg">Wished on {formatDate(wish.wishDate)}</div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-center text-2xl font-medium text-primary-500">
          {wish.voteCount.toString()} votes
        </span>
        {admin && <WishReplyModal wish={wish} />}
        {!admin && (
          <IconButton
            buttonType="button"
            sizing="md"
            Icon={voted ? HiHeart : HiOutlineHeart}
          />
        )}
      </div>
    </div>
  );
};
