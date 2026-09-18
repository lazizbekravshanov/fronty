import { InfoIcon } from "@fronty/icons/info";
import { Button } from "@fronty/ui/button";
import { Tooltip } from "@fronty/ui/tooltip";

export default function TooltipDemo() {
  return (
    <div className="flex items-center gap-3">
      <Tooltip content="Saved to your account">
        <Button variant="primary">Save</Button>
      </Tooltip>
      <Tooltip content="More about plans" placement="right">
        <Button variant="ghost" aria-label="More about plans">
          <InfoIcon />
        </Button>
      </Tooltip>
    </div>
  );
}
