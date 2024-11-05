import { HiX } from "react-icons/hi";

interface Props {
  title: string;
  onButtonClick: () => void;
}

export const DialogTitleWithButton = ({ title, onButtonClick }: Props) => {
  return (
    <div className="flex w-full items-center justify-between md:-mb-12">
      <p className="text-lg font-bold text-primary-400 md:text-3xl">{title}</p>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className="flex  h-10 w-10 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-2xl text-primary-400 md:h-16 md:w-16 md:border-2 md:text-4xl"
        onClick={onButtonClick}
      >
        <HiX />
      </div>
    </div>
  );
};
