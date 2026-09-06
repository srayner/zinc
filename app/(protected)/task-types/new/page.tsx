import Link from "next/link";
import { TaskTypeForm } from "@/components/task-types/TaskTypeForm";

export default function NewTaskTypePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/task-types"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Task types
        </Link>
        <h1 className="text-2xl font-semibold">New task type</h1>
      </div>
      <TaskTypeForm mode="create" />
    </div>
  );
}
