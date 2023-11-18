import { HiChevronRight } from "react-icons/hi";

const Slider = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[linear-gradient(to_top,theme(colors.pink.700/50%),theme(colors.gray.50/10%))] p-12">
      <div className="w-full rounded-full bg-gray-400 p-2 shadow-xl">
        <button className="flex items-center justify-center rounded-full bg-gray-50 p-4 shadow-lg">
          <HiChevronRight size={"2.4rem"} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default Slider;
