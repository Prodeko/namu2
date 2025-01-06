import { ComponentPropsWithRef } from "@react-spring/web";

export type InputProps = ComponentPropsWithRef<"input">;

export const AddFundsInput = ({
  ref,
  ...props
}: InputProps & {
  ref: React.RefObject<unknown>;
}) => {
  return (
    <div className="overflow-visible text-5xl font-bold text-neutral-700 md:text-7xl">
      <input
        {...props}
        ref={ref}
        type="number"
        tabIndex={-1}
        className="hide-spinner w-auto min-w-10 flex-1 overflow-visible border-none bg-transparent px-0 py-0 text-end focus:outline-none"
      />
      €
    </div>
  );
};
