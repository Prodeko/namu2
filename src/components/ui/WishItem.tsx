import { stringify } from "querystring";
import { type ComponentProps } from "react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import internal from "stream";
import { string } from "zod";

import { IconButton } from "./Buttons/IconButton";

type WishItemProps = ComponentProps<"div">;

interface Props extends WishItemProps {
  name: string;
  wish_date: Date;
  vote_count: Number;
  voted: Boolean;
}

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const WishItem = ({
  name,
  wish_date,
  vote_count,
  voted,
  ...props
}: Props) => {
  return (
    <div className="flex justify-between border-b-2 py-6">
      <div>
        <div className="text-3xl font-medium">{name}</div>
        <div className="text-lg">Wished on {formatDate(wish_date)}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-center text-2xl font-medium text-primary-500">
          {vote_count} votes
        </span>
        <IconButton
          buttonType="button"
          sizing="md"
          Icon={voted ? HiHeart : HiOutlineHeart}
        />
      </div>
    </div>
  );
};
