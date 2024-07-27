import { cva } from "class-variance-authority";
import { HiXCircle } from "react-icons/hi2";

const spanStyles = cva(
  "max-w-3xl whitespace-pre-line text-center text-2xl font-medium",
);

interface Props {
  type: "deposits" | "purchases" | "stats";
}

const chooseSubtext = (type: Props["type"]) => {
  switch (type) {
    case "deposits":
      return "Make a deposit to see it here!";
    case "purchases":
      return "Buy something from the shop to see it here!";
    case "stats":
      return "Come back after buying some products!";
  }
};

export const EmptyPage = ({ type }: Props) => {
  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center gap-8">
      <HiXCircle size={192} className="text-primary-500" />
      <div className="flex flex-col gap-1">
        <span className={spanStyles()}>
          {`Hmm... seems like you have no ${type} on this account.\n${chooseSubtext(
            type,
          )}`}
        </span>
      </div>
    </div>
  );
};
