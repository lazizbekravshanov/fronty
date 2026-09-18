import type { PointerEvent } from "react";

/**
 * List items (menu, listbox) follow the mouse by taking focus, so hover and
 * keyboard share one highlight (`:focus`) and touch never leaves a stuck `:hover`.
 */
export const pointerFocus = {
  onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const target = el.getAttribute("aria-disabled") === "true" ? el.parentElement : el;
    if (target && document.activeElement !== target) target.focus({ preventScroll: true });
  },
  onPointerLeave(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    e.currentTarget.parentElement?.focus({ preventScroll: true });
  },
};
