import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { useAnchorPosition, type Anchor, type Placement } from "../hooks/use-anchor-position";
import { useListNavigation } from "../hooks/use-list-navigation";
import { usePopover } from "../hooks/use-popover";
import { cn } from "../lib/cn";

interface MenuContext {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  trigger: RefObject<HTMLButtonElement | null>;
  point: { x: number; y: number } | null;
  setPoint: (p: { x: number; y: number } | null) => void;
}
const Ctx = createContext<MenuContext | null>(null);
const useMenu = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Menu parts must be inside <Menu>");
  return ctx;
};

export interface MenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/** Dropdown menu root. Pair with <MenuTrigger> or <ContextMenuTrigger>, then <MenuContent>. */
export function Menu({ open: controlled, onOpenChange, children }: MenuProps) {
  const [inner, setInner] = useState(false);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const open = controlled ?? inner;
  const setOpen = (next: boolean) => {
    if (next === open) return;
    if (controlled === undefined) setInner(next);
    onOpenChange?.(next);
  };
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return <Ctx.Provider value={{ open, setOpen, id, trigger, point, setPoint }}>{children}</Ctx.Provider>;
}

export function MenuTrigger({ className, onKeyDown, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen, id, trigger, setPoint } = useMenu();
  return (
    <button
      ref={trigger}
      type="button"
      popoverTarget={id}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={id}
      data-slot="menu-trigger"
      data-variant="secondary"
      data-size="md"
      className={cn("fy-button", className)}
      onPointerDown={() => setPoint(null)}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setPoint(null);
          setOpen(true);
        }
      }}
      {...props}
    />
  );
}

/** Opens the menu at the pointer on right click (or the context menu key). */
export function ContextMenuTrigger({ className, onContextMenu, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { setOpen, setPoint } = useMenu();
  return (
    <div
      data-slot="context-menu-trigger"
      className={className}
      onContextMenu={(e: MouseEvent<HTMLDivElement>) => {
        onContextMenu?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        setPoint({ x: e.clientX, y: e.clientY });
        setOpen(true);
      }}
      {...props}
    />
  );
}

export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
  placement?: Placement;
}

export function MenuContent({ placement = "bottom-start", className, onKeyDown, ...props }: MenuContentProps) {
  const { open, setOpen, id, trigger, point } = useMenu();
  const ref = useRef<HTMLDivElement>(null);
  const nav = useListNavigation(ref, { itemSelector: '[role="menuitem"]', typeahead: true });
  usePopover(ref, open, (next) => {
    setOpen(next);
    if (next) requestAnimationFrame(nav.focusFirst);
  });
  const anchor: Anchor = point ?? trigger;
  useAnchorPosition(anchor, ref, open, point ? "bottom-start" : placement);

  return (
    <div
      ref={ref}
      id={id}
      popover="auto"
      role="menu"
      tabIndex={-1}
      data-slot="menu-content"
      data-fy-floating=""
      data-state={open ? "open" : "closed"}
      className={className}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        if (e.key === "Tab") setOpen(false);
        else nav.onKeyDown(e);
      }}
      {...props}
    />
  );
}

export interface MenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  /** Keyboard hint shown on the right, for example "⌘C". */
  shortcut?: string;
  variant?: "default" | "danger";
}

export function MenuItem({ onSelect, disabled, icon, shortcut, variant = "default", className, children, ...props }: MenuItemProps) {
  const { setOpen, trigger, point } = useMenu();
  const activate = () => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
    if (!point) trigger.current?.focus();
  };
  return (
    <div
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-slot="menu-item"
      data-variant={variant}
      className={className}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      }}
      {...props}
    >
      {icon && <span data-slot="menu-item-icon">{icon}</span>}
      <span data-slot="menu-item-label">{children}</span>
      {shortcut && <kbd data-slot="menu-item-shortcut">{shortcut}</kbd>}
    </div>
  );
}

export function MenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" data-slot="menu-separator" className={className} {...props} />;
}

export function MenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="presentation" data-slot="menu-label" className={className} {...props} />;
}
