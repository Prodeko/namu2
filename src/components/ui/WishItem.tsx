"use client";

import { type ComponentProps } from "react";
import { HiCheck, HiHeart, HiOutlineHeart, HiX } from "react-icons/hi";

import { UserWishObject, WishObject } from "@/common/types";
import { getCurrentUser } from "@/server/db/queries/account";
import { getWishById, toggleLike } from "@/server/db/queries/wish";
import { ValueError } from "@/server/exceptions/exception";

import { WishReplyModal } from "../../app/(admin)/admin/wishes/WishReplyModal";
import { IconButton } from "./Buttons/IconButton";

type DivProps = ComponentProps<"div">;

interface AdminProps extends DivProps {
  admin: "on";
  wish: WishObject;
}

interface UserProps extends DivProps {
  admin: "off";
  wish: UserWishObject;
  onLike: (wish: WishObject) => void;
}

type Props = AdminProps | UserProps;

const formatDate = (date: Date) => {
  const day = String(date.getDate()).toString();
  const month = String(date.getMonth() + 1).toString();
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

interface WrapperProps extends DivProps {
  wish: WishObject;
}

export const WishItemWrapper = ({ wish, children }: WrapperProps) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b-2 py-6">
      <div>
        <div className="text-3xl font-medium">{wish.name}</div>
        {wish.status === "OPEN" && (
          <div className="text-lg">Wished on {formatDate(wish.wishDate)}</div>
        )}
        {wish.status !== "OPEN" && (
          <div className="text-lg">
            {`${
              wish.status[0] + wish.status.slice(1).toLowerCase()
            } on ${formatDate(wish.resolutionDate || new Date())}`}
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
        {children}
      </div>
    </div>
  );
};

export const WishItem = (props: Props) => {
  if (props.admin === "on") {
    const { admin, wish, ...rest } = props;
    return (
      <WishItemWrapper wish={wish} {...rest}>
        <WishReplyModal wish={wish} />
      </WishItemWrapper>
    );
  }

  const { admin, wish, onLike, ...rest } = props;

  const handleLike = async () => {
    try {
      const user = await getCurrentUser();
      if (!user.ok) {
        throw new ValueError({
          cause: "missing_value",
          message: "User not found",
        });
      }
      const wishOperation = await toggleLike(user.user.id, wish.id);
      if (!wishOperation.ok) {
        throw new ValueError({
          cause: "missing_value",
          message: `There was an error while toggling the like on wish ${wish.id}",`,
        });
      }

      const updatedWish = await getWishById(wish.id);
      if (!updatedWish.ok) {
        throw new ValueError({
          cause: "missing_value",
          message: `Wish with id ${wish.id} not found`,
        });
      }

      if (onLike) onLike(updatedWish.wish);
    } catch (error) {
      if (error instanceof ValueError) {
        console.error(error.toString());
      } else {
        console.error(`Failed to toggle like: ${error}`);
      }
    }
  };
  return (
    <WishItemWrapper wish={wish} {...rest}>
      {wish.status === "OPEN" && (
        <IconButton
          buttonType="button"
          sizing="md"
          Icon={wish.userLikesWish ? HiHeart : HiOutlineHeart}
          onClick={handleLike}
        />
      )}
      {wish.status === "ACCEPTED" && (
        <IconButton
          buttonType="button"
          sizing="md"
          Icon={HiCheck}
          className="bg-green-100 text-green-500"
        />
      )}
      {wish.status === "REJECTED" && (
        <IconButton
          buttonType="button"
          sizing="md"
          Icon={HiX}
          className="bg-red-100 text-red-400"
        />
      )}
    </WishItemWrapper>
  );
};
