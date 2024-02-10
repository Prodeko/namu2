interface Props {
  title: string;
}

export const CenteredTitle = ({ title }: Props) => {
  return <h2 className="text-4xl font-bold text-neutral-700">{title}</h2>;
};
