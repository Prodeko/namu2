interface Props {
  title: string;
}

export const CenteredTitle = ({ title }: Props) => {
  return (
    <h2 className="text-2xl font-bold text-neutral-700 md:text-4xl lg:text-3xl 2xl:text-4xl">
      {title}
    </h2>
  );
};
