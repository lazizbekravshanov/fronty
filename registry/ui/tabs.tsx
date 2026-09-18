import { createContext, useContext, useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import { useControllable } from "../hooks/use-controllable";
import { useListNavigation } from "../hooks/use-list-navigation";
import { cn } from "../lib/cn";

interface TabsContext {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
}
const Ctx = createContext<TabsContext | null>(null);
const useTabs = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Tabs parts must be inside <Tabs>");
  return ctx;
};
const safe = (v: string) => v.replace(/[^\w-]/g, "_");

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ value, defaultValue = "", onValueChange, className, ...props }: TabsProps) {
  const [current, setValue] = useControllable(value, defaultValue, onValueChange);
  const baseId = useId();
  return (
    <Ctx.Provider value={{ value: current, setValue, baseId }}>
      <div data-slot="tabs" className={cn("fy-tabs", className)} {...props} />
    </Ctx.Provider>
  );
}

/** The segmented control. Arrow keys move between tabs and activate them. */
export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { setValue } = useTabs();
  const ref = useRef<HTMLDivElement>(null);
  const nav = useListNavigation(ref, {
    itemSelector: '[role="tab"]:not(:disabled)',
    orientation: "horizontal",
    onMove: (el) => el.dataset.value && setValue(el.dataset.value),
  });
  return <div ref={ref} role="tablist" data-slot="tabs-list" className={className} onKeyDown={nav.onKeyDown} {...props} />;
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const ctx = useTabs();
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${safe(value)}`}
      aria-controls={`${ctx.baseId}-panel-${safe(value)}`}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      data-value={value}
      data-state={active ? "active" : "inactive"}
      data-slot="tabs-trigger"
      className={className}
      onClick={() => ctx.setValue(value)}
      {...props}
    />
  );
}

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsPanel({ value, className, ...props }: TabsPanelProps) {
  const ctx = useTabs();
  const active = ctx.value === value;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${safe(value)}`}
      aria-labelledby={`${ctx.baseId}-tab-${safe(value)}`}
      hidden={!active}
      tabIndex={0}
      data-state={active ? "active" : "inactive"}
      data-slot="tabs-panel"
      className={className}
      {...props}
    />
  );
}
