import { type ComponentProps } from "react"

type HeadingProps = ComponentProps<"a">

interface Props extends HeadingProps {}

export const Logo = ({ ...props }: Props) => {
  return (
    <a
      href="/"
      {...props}
      className="text-5xl font-black uppercase italic text-pink-500"
    >
      Namukilke
    </a>
  )
}
