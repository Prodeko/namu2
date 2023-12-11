import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

interface Props {
  leftButtonAction: () => void;
  rightButtonAction: () => void;
  onInputChange: (value: number) => void;
  inputValue: number;
  maxValue: number;
}

const buttonStyles = cva(
  "text-slate-700 transition-colors duration-300 disabled:text-slate-400",
);

export const ButtonGroup = ({
  leftButtonAction,
  rightButtonAction,
  onInputChange,
  inputValue,
  maxValue,
}: Props) => {
  const [textValue, setTextValue] = useState<string>(inputValue.toString());
  const iconStyles = cva("h-7 w-7");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setTextValue(newValue);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const parsedValue = parseInt(newValue);
    if (Number.isNaN(parsedValue)) {
      setTextValue(inputValue.toString());
    } else {
      onInputChange(parsedValue);
    }
  };

  useEffect(() => {
    setTextValue(inputValue.toString());
  }, [inputValue]);

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        className={buttonStyles()}
        disabled={inputValue === 1}
        type="button"
        onClick={leftButtonAction}
      >
        <HiMinus className={iconStyles()} />
      </button>
      <input
        type="number"
        value={textValue}
        onBlur={handleBlur}
        onChange={handleInputChange}
        className="flex h-12 w-12 appearance-none items-center justify-center rounded bg-primary-100 text-center text-2xl font-medium text-primary-900 outline-primary-700"
      />
      <button
        type="button"
        onClick={rightButtonAction}
        className={buttonStyles()}
        disabled={inputValue >= maxValue}
      >
        <HiPlus className={iconStyles()} />
      </button>
    </div>
  );
};
