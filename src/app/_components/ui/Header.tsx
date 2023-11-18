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
      {LeftComponent && <span className="mr-auto">{LeftComponent}</span>}
      {RightComponent && <span className="ml-auto">{RightComponent}</span>}
    </header>
  );
};
