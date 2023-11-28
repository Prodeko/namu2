import { type ComponentProps } from "react"

type HeadingProps = ComponentProps<"h2">

interface Props extends HeadingProps {
  title: string
}

export const SectionTitle = ({ title, ...props }: Props) => {
  return (
    <h2 className="text-4xl font-bold capitalize text-slate-00" {...props}>
      {title}
    </h2>
  )
}
