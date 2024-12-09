interface Props {
  title: string;
  value: string;
}

export const KeyNumbersHeadliner = ({ title, value }: Props) => {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 lg:py-4">
      <p className="col-span-2 text-sm font-bold lg:text-base">{title}</p>
      <p className="text-xl font-bold text-primary-400 lg:text-2xl">{value}</p>
    </div>
  );
};
