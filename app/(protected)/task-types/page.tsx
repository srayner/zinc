import Link from "next/link";
import { listTaskTypes } from "@/services/taskTypes";
import { effortLabel, zoneLabel } from "@/lib/taskTypes";
import { Button } from "@/components/ui/button";

export default async function TaskTypesPage() {
  const taskTypes = await listTaskTypes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Task types</h1>
        <Button asChild size="sm">
          <Link href="/task-types/new">New task type</Link>
        </Button>
      </div>

      {taskTypes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No task types yet. Create one to describe a recurring chore.
        </p>
      ) : (
        <ul className="divide-y rounded-md border">
          {taskTypes.map((tt) => (
            <li key={tt.id}>
              <Link
                href={`/task-types/${tt.id}`}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 hover:bg-accent"
              >
                <span className="font-medium">{tt.name}</span>
                <span className="text-sm text-muted-foreground">
                  every {tt.defaultFrequencyDays}d · {effortLabel(tt.effortLevel)}
                </span>
                <span className="flex gap-1">
                  {tt.applicableZoneTypes.map((z) => (
                    <span
                      key={z}
                      className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground"
                    >
                      {zoneLabel(z)}
                    </span>
                  ))}
                </span>
                {tt._count.areaTasks > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    in {tt._count.areaTasks} area
                    {tt._count.areaTasks === 1 ? "" : "s"}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
