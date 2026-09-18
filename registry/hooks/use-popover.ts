import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/**
 * Keeps a native `popover` element in sync with React state.
 * The browser handles light dismiss (outside click, Escape) and the top layer;
 * this hook just mirrors its `toggle` events back into `onOpenChange`.
 */
export function usePopover(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onOpenChange: (open: boolean) => void,
) {
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      if (open) el.showPopover();
      else el.hidePopover();
    } catch {
      // already in the requested state
    }
  }, [open, ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onToggle = (e: Event) => onOpenChangeRef.current((e as ToggleEvent).newState === "open");
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, [ref]);
}
