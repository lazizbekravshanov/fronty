import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
} from "react";
import { useAnchorPosition, type Placement } from "../hooks/use-anchor-position";
import { mergeRefs } from "../lib/refs";

export interface TooltipProps {
  content: ReactNode;
  /** A single focusable element, for example a <Button>. */
  children: ReactElement<Record<string, unknown> & { ref?: Ref<HTMLElement> }>;
  placement?: Placement;
  /** Milliseconds before showing on hover. Focus shows it right away. */
  delay?: number;
}

type Handler = ((e: SyntheticEvent) => void) | undefined;

export function Tooltip({ content, children, placement = "top", delay = 400 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();

  useAnchorPosition(anchor, tip, open, placement);

  useEffect(() => {
    const el = tip.current;
    if (!el) return;
    try {
      if (open) el.showPopover();
      else el.hidePopover();
    } catch {
      // already in the requested state
    }
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  const chain = (theirs: unknown, ours: () => void) => (e: SyntheticEvent) => {
    (theirs as Handler)?.(e);
    ours();
  };
  const p = children.props;

  return (
    <>
      {cloneElement(children, {
        ref: mergeRefs(anchor, p.ref),
        "aria-describedby": [p["aria-describedby"], open ? id : null].filter(Boolean).join(" ") || undefined,
        onPointerEnter: chain(p.onPointerEnter, () => show(delay)),
        onPointerLeave: chain(p.onPointerLeave, hide),
        onFocus: chain(p.onFocus, () => show(0)),
        onBlur: chain(p.onBlur, hide),
      })}
      <div ref={tip} id={id} role="tooltip" popover="manual" data-slot="tooltip" data-fy-floating="" data-state={open ? "open" : "closed"}>
        {content}
      </div>
    </>
  );
}
