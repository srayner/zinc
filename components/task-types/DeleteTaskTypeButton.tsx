"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteTaskTypeButton({
  id,
  name,
  inUseCount,
}: {
  id: string;
  name: string;
  inUseCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function remove() {
    startTransition(async () => {
      const res = await fetch(`/api/task-types/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Could not delete");
        setConfirming(false);
        return;
      }
      toast.success(`Deleted ${name}`);
      router.push("/task-types");
      router.refresh();
    });
  }

  if (inUseCount > 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Assigned to {inUseCount} area{inUseCount === 1 ? "" : "s"} — unassign it
        before deleting.
      </p>
    );
  }

  return confirming ? (
    <div className="flex items-center gap-2">
      <span className="text-sm">Delete {name}?</span>
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={remove}
      >
        Delete
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </div>
  ) : (
    <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
      Delete task type
    </Button>
  );
}
