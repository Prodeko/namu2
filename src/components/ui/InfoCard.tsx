import Link from "next/link";
import { type ComponentProps, type ForwardedRef } from "react";
import { type IconType } from "react-icons";

import { cn } from "@/lib/utils";

const cardClassName =
  "flex w-1/3 min-w-full flex-1 select-none flex-col gap-1 rounded-xl border-[2px] border-primary-400 bg-primary-50 px-6 py-4 md:gap-2 md:border-[3px] md:px-8 md:py-6";

interface BaseProps {
  title: string;
  data: string;
  Icon: IconType;
}

interface DivProps
  extends BaseProps,
    Omit<ComponentProps<"div">, keyof BaseProps> {
  cardType: "div";
}

interface LinkProps
  extends BaseProps,
    Omit<ComponentProps<"a">, keyof BaseProps> {
  cardType: "a";
  href: string;
}

type Props = DivProps | LinkProps;
type RefProps<T extends Props> = T extends LinkProps
  ? ForwardedRef<HTMLAnchorElement>
  : ForwardedRef<HTMLDivElement>;

const CardContent = ({
  title,
  data,
  Icon,
}: {
  title: string;
  data: string;
  Icon: IconType;
}) => (
  <>
    <div className="flex h-min w-full justify-between gap-1 md:gap-2">
      <span className="text-nowrap text-2xl capitalize text-primary-400">
        {title}
      </span>
      <Icon className="text-3xl text-primary-400 md:text-4xl" />
    </div>
    <span className="truncate text-2xl font-bold tracking-tight text-primary-500 md:text-4xl">
      {data}
    </span>
  </>
);

export const InfoCard = ({ ref, ...props }: Props) => {
  if (props.cardType === "a") {
    const { title, data, Icon, href, cardType, className, ...restProps } =
      props;

    return (
      <Link
        {...restProps}
        href={href}
        ref={ref as RefProps<LinkProps>}
        className={cn(cardClassName, className)}
      >
        <CardContent title={title} data={data} Icon={Icon} />
      </Link>
    );
  }

  const { title, data, Icon, cardType, className, ...restProps } = props;
  return (
    <div
      {...restProps}
      ref={ref as RefProps<DivProps>}
      className={cn(cardClassName, className)}
    >
      <CardContent title={title} data={data} Icon={Icon} />
    </div>
  );
};

export const InfoCardLoading = ({
  title,
  Icon,
  ...props
}: Omit<BaseProps, "data"> & { className?: string }) => {
  return (
    <InfoCard
      {...props}
      cardType="div"
      className={cn("animate-pulse", props.className)}
      data={"Loading..."}
      Icon={Icon}
      title={title}
    />
  );
};
