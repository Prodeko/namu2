import { type ComponentProps, type ReactNode } from "react";

type HeaderProps = ComponentProps<"header">;

export interface Props extends HeaderProps {
  LeftComponent?: ReactNode;
  RightComponent?: ReactNode;
}

export const Header = ({ LeftComponent, RightComponent, ...props }: Props) => {
  return (
    <header
      {...props}
      className="flex h-36 items-center justify-between bg-pink-200 px-12"
    >
      {LeftComponent && <div className="mr-auto">{LeftComponent}</div>}
      {RightComponent && <div className="ml-auto">{RightComponent}</div>}
    </header>
  );
};
