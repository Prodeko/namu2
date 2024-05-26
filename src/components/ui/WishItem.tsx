"use client";

import { set } from "lodash";
import { useRouter } from "next/navigation";
import { type ComponentProps, useEffect, useState } from "react";
import { HiCheck, HiHeart, HiOutlineHeart, HiX } from "react-icons/hi";

import { WishObject } from "@/common/types";
import { getCurrentUser } from "@/server/db/utils/account";
import { hasLiked, toggleLike } from "@/server/db/utils/wish";

import { WishReplyModal } from "../../app/(admin)/admin/wishes/WishReplyModal";
import { IconButton } from "./Buttons/IconButton";

type WishItemProps = ComponentProps<"div">;

interface Props extends WishItemProps {
  wish: WishObject;
  admin?: boolean;
}

const formatDate = (date: Date) => {
  const day = String(date.getDate()).toString();
  const month = String(date.getMonth() + 1).toString();
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const WishItem = ({ wish, admin = false, ...props }: Props) => {
  const [userHasLiked, setUserHasLiked] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    const user = await getCurrentUser();
    await toggleLike(user.id, wish.id);
    router.refresh();
  };
  return (
    <div className="flex items-center justify-between gap-4 border-b-2 py-6">
      <div>
        <div className="text-3xl font-medium">{wish.name}</div>
        {wish.status === "OPEN" && (
          <div className="text-lg">Wished on {formatDate(wish.wishDate)}</div>
        )}
        {wish.status !== "OPEN" && (
          <div className="text-lg">
            Resolved on {formatDate(wish.resolutionDate || new Date())}
          </div>
        )}
        {wish.resolutionMessage && (
          <div className="text-lg">Comment: {wish.resolutionMessage}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-center text-2xl font-medium text-primary-500">
          {wish.voteCount.toString()} votes
        </span>
        {admin && <WishReplyModal wish={wish} />}
        {!admin && wish.status === "OPEN" && (
          <IconButton
            buttonType="button"
            sizing="md"
            Icon={wish.hasLiked ? HiHeart : HiOutlineHeart}
            onClick={handleLike}
          />
        )}
        {!admin && wish.status === "ACCEPTED" && (
          <IconButton
            buttonType="button"
            sizing="md"
            Icon={HiCheck}
            className="bg-green-100 text-green-500"
          />
        )}
        {!admin && wish.status === "REJECTED" && (
          <IconButton
            buttonType="button"
            sizing="md"
            Icon={HiX}
            className="bg-red-100 text-red-400"
          />
        )}
      </div>
    </div>
  );
};
