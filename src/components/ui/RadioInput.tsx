import { useState } from "react";

interface Props {
  options: string[];
  labelText?: string;
}
export const RadioInput = ({ options, labelText }: Props) => {
  const [value, setValue] = useState(options[0] || "");
  const getIndicatorLength = (): number => Math.round(100 / options.length);
  const getIndicatorPos = (): number =>
    getIndicatorLength() * options.indexOf(value);
  const getIndicatorStyle = () => {
    return {
      width: `${getIndicatorLength()}%`,
      left: `${getIndicatorPos()}%`,
    };
  };
  const getOptionStyle = (option: string) => {
    return value === option ? { color: "white" } : {};
  };
  return (
    <div className="flex flex-col-reverse gap-4">
      <div className="relative flex max-w-fit rounded-full bg-white">
        {options.map((option) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={option}
            onClick={() => setValue(option)}
            className=" z-10 min-w-[10rem] flex-1 cursor-pointer px-10 py-4 text-center text-2xl text-neutral-800 transition-colors duration-150 landscape:py-3 landscape:text-lg"
            style={getOptionStyle(option)}
          >
            {option}
          </div>
        ))}
        {/* Indicator */}
        <div
          className="absolute top-0 h-full rounded-full bg-primary-400 transition-all duration-150"
          style={getIndicatorStyle()}
        />
      </div>
      {labelText && (
        <label
          htmlFor={labelText}
          className="cursor-pointer text-base font-normal text-neutral-500 transition-all peer-focus:font-medium peer-focus:text-primary-500"
        >
          {labelText}
        </label>
      )}
    </div>
  );
};
