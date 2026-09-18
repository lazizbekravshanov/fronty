import { PlusIcon } from "@fronty/icons/plus";
import { Button } from "@fronty/ui/button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Save</Button>
      <Button>Cancel</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="danger">Delete</Button>
      <Button size="sm">
        <PlusIcon /> New
      </Button>
    </div>
  );
}
