import { useLayoutEffect, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { CheckIcon } from "../icons/check";
import { MinusIcon } from "../icons/minus";
import { cn } from "../lib/cn";
import { mergeRefs } from "../lib/refs";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Shows a dash instead of a check; cleared by the browser on the next click. */
  indeterminate?: boolean;
  children?: ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

/** A native checkbox with a custom box. Keyboard, forms and a11y come from the browser. */
export function Checkbox({ indeterminate = false, children, className, ref, ...props }: CheckboxProps) {
  const inner = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label data-slot="checkbox" data-disabled={props.disabled ? "" : undefined} className={cn("fy-checkbox", className)}>
      <input ref={mergeRefs(inner, ref)} type="checkbox" data-slot="checkbox-input" {...props} />
      <span data-slot="checkbox-box" aria-hidden="true">
        <CheckIcon data-slot="checkbox-check" />
        <MinusIcon data-slot="checkbox-dash" />
      </span>
      {children && <span data-slot="checkbox-label">{children}</span>}
    </label>
  );
}
