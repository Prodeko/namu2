interface Props {
  title: string;
  value: string;
}

export const KeyNumbersHeadliner = ({ title, value }: Props) => {
  return (
    <div className="flex flex-col gap-1 p-4">
      <p className="col-span-2 font-bold">{title}</p>
      <p className="text-2xl font-bold text-primary-400">{value}</p>
    </div>
  );
};
