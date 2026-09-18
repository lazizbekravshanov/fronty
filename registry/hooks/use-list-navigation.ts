import { useCallback, useRef, type KeyboardEvent, type RefObject } from "react";

interface Options {
  /** Selector for the focusable items inside the container. */
  itemSelector: string;
  orientation?: "vertical" | "horizontal";
  loop?: boolean;
  /** Jump to the next item starting with the typed characters. */
  typeahead?: boolean;
  /** Called with the item that just received focus (Tabs uses it to activate). */
  onMove?: (item: HTMLElement) => void;
}

/**
 * Arrow key, Home/End and typeahead focus movement for menus, listboxes and tab lists.
 * Items are real DOM nodes; disabled ones (`aria-disabled="true"`) are skipped.
 */
export function useListNavigation(container: RefObject<HTMLElement | null>, opts: Options) {
  const { itemSelector, orientation = "vertical", loop = true, typeahead = false, onMove } = opts;
  const buffer = useRef({ text: "", timer: 0 as ReturnType<typeof setTimeout> | 0 });

  const items = useCallback(
    () =>
      Array.from(container.current?.querySelectorAll<HTMLElement>(itemSelector) ?? []).filter(
        (el) => el.getAttribute("aria-disabled") !== "true",
      ),
    [container, itemSelector],
  );

  const focus = useCallback(
    (el: HTMLElement | undefined) => {
      if (!el) return;
      el.focus();
      onMove?.(el);
    },
    [onMove],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const list = items();
      if (!list.length) return;
      const index = list.indexOf(document.activeElement as HTMLElement);
      const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
      const prev = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
      const step = (d: number) => {
        let i = index + d;
        if (index === -1) i = d > 0 ? 0 : list.length - 1;
        else if (loop) i = (i + list.length) % list.length;
        else i = Math.min(Math.max(i, 0), list.length - 1);
        return list[i];
      };

      if (e.key === next) focus(step(1));
      else if (e.key === prev) focus(step(-1));
      else if (e.key === "Home") focus(list[0]);
      else if (e.key === "End") focus(list[list.length - 1]);
      else if (typeahead && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const b = buffer.current;
        if (b.timer) clearTimeout(b.timer);
        b.text += e.key.toLowerCase();
        b.timer = setTimeout(() => (b.text = ""), 500);
        const ordered = [...list.slice(index + 1), ...list.slice(0, index + 1)];
        const match = ordered.find((el) => (el.textContent ?? "").trim().toLowerCase().startsWith(b.text));
        if (match) focus(match);
        return;
      } else return;
      e.preventDefault();
    },
    [items, orientation, loop, typeahead, focus],
  );

  return { onKeyDown, items, focusFirst: () => focus(items()[0]) };
}
