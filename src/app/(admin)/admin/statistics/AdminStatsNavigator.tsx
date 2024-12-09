import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfWeek,
  format,
  getWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import { StatsPeriod } from "./page";

interface Props {
  activePeriod: StatsPeriod;
  startDate: Date;
}

const getDateDisplay = (date: Date, currentPeriod: StatsPeriod): string => {
  switch (currentPeriod) {
    case "daily": // date in format "Wedenesday, 12.12.2021"
      return format(date, "EEEE, dd.MM.yyyy");
    case "weekly":
      return `Week ${getWeek(date)} (${format(
        startOfWeek(date),
        "dd.MM.",
      )} - ${format(endOfWeek(date), "dd.MM.")})`;
    case "monthly": // format: "October 2024"
      return format(date, "MMMM yyyy");
    case "yearly": // format: "Year 2024"
      return `Year ${format(date, "yyyy")}`;
  }
};

const addToPeriod = (date: Date, period: StatsPeriod, amount: number): Date => {
  switch (period) {
    case "daily":
      return addDays(date, amount);
    case "weekly":
      return addWeeks(date, amount);
    case "monthly":
      return addMonths(date, amount);
    case "yearly":
      return addYears(date, amount);
  }
};

export const AdminStatsNavigator = ({ activePeriod, startDate }: Props) => {
  const StatsLink = ({
    period,
    startingFrom,
    children,
  }: {
    period: StatsPeriod;
    startingFrom: number;
    children: React.ReactNode;
  }) => (
    <Link
      href={{ pathname: "/admin/statistics", query: { period, startingFrom } }}
    >
      <span className={activePeriod === period ? "font-bold" : ""}>
        {children}
      </span>
    </Link>
  );
  return (
    <div className="col-span-full -mb-6 grid grid-cols-1 items-center justify-between gap-4 py-0 text-neutral-700 landscape:-mb-4 landscape:grid-cols-3 landscape:gap-0 landscape:py-2">
      <p className="hidden text-center text-lg font-bold lg:text-2xl landscape:block landscape:text-start">
        Analytics
      </p>
      <div className="flex items-center justify-center gap-2 text-lg font-medium text-neutral-600 lg:text-xl">
        <StatsLink
          period={activePeriod}
          startingFrom={addToPeriod(startDate, activePeriod, -1).getTime()}
        >
          <HiChevronLeft className="cursor-pointer text-2xl" />
        </StatsLink>
        <p className="">{getDateDisplay(startDate, activePeriod)}</p>
        <StatsLink
          period={activePeriod}
          startingFrom={addToPeriod(startDate, activePeriod, 1).getTime()}
        >
          <HiChevronRight className="cursor-pointer text-2xl" />
        </StatsLink>
      </div>
      <div className="grid auto-cols-max grid-flow-col gap-4 justify-self-center text-lg lg:text-xl landscape:gap-2 landscape:justify-self-end">
        <StatsLink
          period="daily"
          startingFrom={startOfDay(new Date()).getTime()}
        >
          Daily
        </StatsLink>
        <StatsLink
          period="weekly"
          startingFrom={startOfWeek(new Date()).getTime()}
        >
          Weekly
        </StatsLink>
        <StatsLink
          period="monthly"
          startingFrom={startOfMonth(new Date()).getTime()}
        >
          Monthly
        </StatsLink>
        <StatsLink
          period="yearly"
          startingFrom={startOfYear(new Date()).getTime()}
        >
          Yearly
        </StatsLink>
      </div>
    </div>
  );
};
