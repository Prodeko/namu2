import { cva } from "class-variance-authority";
import { Toast } from "react-hot-toast";
import { HiXCircle } from "react-icons/hi";

interface Props {
  t: Toast;
  message?: string;
}

const toastStyles = cva(
  "pointer-events-auto flex w-full max-w-lg rounded-3xl bg-white shadow-lg ring-1 ring-black ring-opacity-5",
  {
    variants: {
      visible: {
        true: "animate-enter",
        false: "animate-leave",
      },
    },
  },
);

export const ErrorToast = ({ t, message }: Props) => {
  return (
    <div className={toastStyles({ visible: t.visible })}>
      <div className="flex items-center gap-4 px-8 py-6">
        <div className="flex-shrink-0 pt-0.5">
          <HiXCircle className="text-6xl text-red-400" aria-hidden="true" />
        </div>
        <div className="">
          <p className="mt-1 text-2xl text-neutral-700">
            {message || "Something went wrong"}
          </p>
        </div>
      </div>
    </div>
  );
};
