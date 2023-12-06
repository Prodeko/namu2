import { HiChevronRight } from "react-icons/hi";

const Slider = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[linear-gradient(to_top,theme(colors.primary.700/50%),theme(colors.neutral.50/10%))] p-12">
      <div className="w-full rounded-full bg-neutral-400 p-2 shadow-xl">
        <button
          type="submit"
          className="flex items-center justify-center rounded-full bg-neutral-50 p-4 shadow-lg"
        >
          <HiChevronRight size={"2.4rem"} className="text-neutral-700" />
        </button>
      </div>
    </div>
  );
};

export default Slider;
