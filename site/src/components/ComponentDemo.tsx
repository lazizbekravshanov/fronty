import type { ComponentType } from "react";
import ButtonDemo from "./demos/button";
import CardDemo from "./demos/card";
import CheckboxDemo from "./demos/checkbox";
import DialogDemo from "./demos/dialog";
import MenuDemo from "./demos/menu";
import PopoverDemo from "./demos/popover";
import SelectDemo from "./demos/select";
import SliderDemo from "./demos/slider";
import SwitchDemo from "./demos/switch";
import TabsDemo from "./demos/tabs";
import TextFieldDemo from "./demos/text-field";
import ToastDemo from "./demos/toast";
import TooltipDemo from "./demos/tooltip";

const demos: Record<string, ComponentType> = {
  button: ButtonDemo,
  card: CardDemo,
  checkbox: CheckboxDemo,
  dialog: DialogDemo,
  menu: MenuDemo,
  popover: PopoverDemo,
  select: SelectDemo,
  slider: SliderDemo,
  switch: SwitchDemo,
  tabs: TabsDemo,
  "text-field": TextFieldDemo,
  toast: ToastDemo,
  tooltip: TooltipDemo,
};

/** One island that renders a component's demo by slug (keeps Astro hydration static). */
export default function ComponentDemo({ slug }: { slug: string }) {
  const Demo = demos[slug];
  return Demo ? <Demo /> : null;
}
