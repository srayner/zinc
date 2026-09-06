import Link from "next/link";
import { notFound } from "next/navigation";
import { getTaskType } from "@/services/taskTypes";
import { TaskTypeForm } from "@/components/task-types/TaskTypeForm";
import { DeleteTaskTypeButton } from "@/components/task-types/DeleteTaskTypeButton";

export default async function EditTaskTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taskType = await getTaskType(id);
  if (!taskType) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/task-types"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Task types
        </Link>
        <h1 className="text-2xl font-semibold">{taskType.name}</h1>
      </div>

      <TaskTypeForm mode="edit" taskType={taskType} />

      <div className="border-t pt-6">
        <DeleteTaskTypeButton
          id={taskType.id}
          name={taskType.name}
          inUseCount={taskType._count.areaTasks}
        />
      </div>
    </div>
  );
}
