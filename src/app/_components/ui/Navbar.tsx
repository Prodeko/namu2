import { type ComponentProps } from "react";
import { HiQuestionMarkCircle } from "react-icons/hi";

import { Menu } from "@/app/_components/ui/Menu/";

type NavProps = ComponentProps<"nav">;

export interface Props extends NavProps {
	text: string;
	initials: string;
}

export const NavBar = ({ text, initials, ...props }: Props) => {
	return (
		<nav className="flex gap-8" {...props}>
			<button type="button" className="text-pink-400">
				<HiQuestionMarkCircle size="1.5rem" />
			</button>
			<button type="button" className="font-regular text-2xl text-pink-400">
				{text}
			</button>
			<Menu initials={initials} />
		</nav>
	);
};
