"use client";

import {
  Children,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { useModal } from "@ebay/nice-modal-react";
import { animated, useSpring, useTransition } from "@react-spring/web";

import {
  type ModalNav,
  ModalNavContext,
  type NavDirection,
  useModalNav,
} from "./ModalNavContext";
import { ModalShell } from "./ModalShell";

type ButtonIntent = "primary" | "secondary" | "tertiary" | "header";

const AnimatedDiv = animated("div");

/* -------------------------------------------------------------------------- */
/* Pages                                                                       */
/* -------------------------------------------------------------------------- */

export interface ModalPageProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  /** Stable name for targeted navigation via `nav.goTo(id)`. */
  id?: string;
  /** Defaults to `true`. When `false`, the X button, outside-click and ESC are disabled. */
  dismissible?: boolean;
}

/** Marker component — `Modal` reads its props; it never renders itself. */
const ModalPage = (_props: ModalPageProps): ReactNode => null;

/* -------------------------------------------------------------------------- */
/* Paged content (horizontal slide + animated height)                          */
/* -------------------------------------------------------------------------- */

interface MeasuredPageProps {
  active: boolean;
  onHeight: (height: number) => void;
  children: ReactNode;
}

const MeasuredPage = ({ active, onHeight, children }: MeasuredPageProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!active || !ref.current) return;
    const element = ref.current;
    const report = () => onHeight(element.getBoundingClientRect().height);
    report();
    const observer = new ResizeObserver(report);
    observer.observe(element);
    return () => observer.disconnect();
  }, [active, onHeight]);

  return <div ref={ref}>{children}</div>;
};

interface PagedContentProps {
  index: number;
  direction: NavDirection;
  pages: ReactElement<ModalPageProps>[];
}

const PagedContent = ({ index, direction, pages }: PagedContentProps) => {
  const [height, setHeight] = useState<number>();

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0, x: direction === "forward" ? 100 : -100 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: direction === "forward" ? -100 : 100 },
    config: { tension: 320, friction: 32 },
  });

  const heightSpring = useSpring({
    height,
    config: { tension: 320, friction: 32 },
  });

  return (
    <AnimatedDiv
      style={height === undefined ? undefined : heightSpring}
      className="relative w-full overflow-hidden"
    >
      {transitions((style, i) => (
        <AnimatedDiv
          style={{
            opacity: style.opacity,
            transform: style.x.to((x) => `translateX(${x}%)`),
          }}
          className="absolute inset-x-0 top-0 w-full"
        >
          <MeasuredPage active={i === index} onHeight={setHeight}>
            {pages[i]?.props.children}
          </MeasuredPage>
        </AnimatedDiv>
      ))}
    </AnimatedDiv>
  );
};

/* -------------------------------------------------------------------------- */
/* Modal root                                                                  */
/* -------------------------------------------------------------------------- */

interface ModalProps {
  children: ReactNode;
  /** Show the modal-level step indicator (off by default). */
  showProgress?: boolean;
}

const ModalRoot = ({ children, showProgress }: ModalProps) => {
  const modal = useModal();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<NavDirection>("forward");

  const pages = useMemo(
    () =>
      Children.toArray(children).filter(
        (child): child is ReactElement<ModalPageProps> =>
          isValidElement(child) && child.type === ModalPage,
      ),
    [children],
  );

  const pageCount = pages.length;
  const safeIndex = Math.min(index, Math.max(pageCount - 1, 0));
  const activePage = pages[safeIndex];
  const dismissible = activePage?.props.dismissible ?? true;

  const goToIndex = useCallback(
    (target: number, dir: NavDirection) => {
      if (target < 0 || target >= pageCount || target === safeIndex) return;
      setDirection(dir);
      setIndex(target);
    },
    [pageCount, safeIndex],
  );

  const resolveAndHide = useCallback(
    (value: unknown) => {
      modal.resolve(value);
      modal.hide();
    },
    [modal],
  );

  const nav = useMemo<ModalNav>(
    () => ({
      next: () => goToIndex(safeIndex + 1, "forward"),
      back: () => goToIndex(safeIndex - 1, "backward"),
      goTo: (id: string) => {
        const target = pages.findIndex((page) => page.props.id === id);
        if (target >= 0) {
          goToIndex(target, target >= safeIndex ? "forward" : "backward");
        }
      },
      close: () => resolveAndHide(undefined),
      resolve: (value: unknown) => resolveAndHide(value),
      currentIndex: safeIndex,
      pageCount,
    }),
    [goToIndex, pages, safeIndex, pageCount, resolveAndHide],
  );

  return (
    <ModalNavContext.Provider value={nav}>
      <ModalShell
        open={modal.visible}
        onExited={() => modal.remove()}
        dismissible={dismissible}
        onDismiss={nav.close}
        title={activePage?.props.title}
        subtitle={activePage?.props.subtitle}
        showProgress={showProgress}
        currentIndex={safeIndex}
        pageCount={pageCount}
      >
        <PagedContent index={safeIndex} direction={direction} pages={pages} />
      </ModalShell>
    </ModalNavContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/* Action buttons                                                              */
/* -------------------------------------------------------------------------- */

const ModalActions = ({ children }: { children: ReactNode }) => (
  <div className="mt-2 flex w-full gap-3 md:gap-6">{children}</div>
);

interface NextButtonProps {
  text?: string;
  intent?: ButtonIntent;
  /** Run before advancing; return `false` (or throw) to block navigation. */
  onBeforeNext?: () => boolean | Promise<boolean>;
}

const NextButton = ({
  text = "Next",
  intent = "primary",
  onBeforeNext,
}: NextButtonProps) => {
  const nav = useModalNav();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (onBeforeNext) {
      setLoading(true);
      try {
        const ok = await onBeforeNext();
        if (!ok) return;
      } catch {
        return;
      } finally {
        setLoading(false);
      }
    }
    nav.next();
  };

  return (
    <FatButton
      buttonType="button"
      text={text}
      loading={loading}
      intent={intent}
      onClick={handleClick}
    />
  );
};

interface SimpleButtonProps {
  text?: string;
  intent?: ButtonIntent;
}

const BackButton = ({
  text = "Back",
  intent = "tertiary",
}: SimpleButtonProps) => {
  const nav = useModalNav();
  return (
    <FatButton
      buttonType="button"
      text={text}
      intent={intent}
      onClick={nav.back}
    />
  );
};

const CloseButton = ({
  text = "Close",
  intent = "primary",
}: SimpleButtonProps) => {
  const nav = useModalNav();
  return (
    <FatButton
      buttonType="button"
      text={text}
      intent={intent}
      onClick={nav.close}
    />
  );
};

interface ActionButtonProps {
  text: string;
  intent?: ButtonIntent;
  /** Custom handler; receives the nav surface so it can advance/resolve/close. */
  onClick: (nav: ModalNav) => void | Promise<void>;
}

const ActionButton = ({
  text,
  intent = "primary",
  onClick,
}: ActionButtonProps) => {
  const nav = useModalNav();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick(nav);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FatButton
      buttonType="button"
      text={text}
      loading={loading}
      intent={intent}
      onClick={handleClick}
    />
  );
};

/* -------------------------------------------------------------------------- */
/* Compound export                                                             */
/* -------------------------------------------------------------------------- */

export const Modal = Object.assign(ModalRoot, {
  Page: ModalPage,
  Actions: ModalActions,
  NextButton,
  BackButton,
  CloseButton,
  ActionButton,
});
