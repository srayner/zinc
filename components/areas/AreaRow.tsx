"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Area } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AreaRow({
  area,
  onChanged,
}: {
  area: Area;
  onChanged: () => void | Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(area.name);
  const [busy, setBusy] = useState(false);
  const archived = area.archivedAt !== null;

  async function patch(body: Record<string, unknown>, successMsg: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/areas/${area.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      toast.success(successMsg);
      setEditing(false);
      await onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="flex items-center gap-2 px-3 py-2">
      {editing ? (
        <>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Area name"
            className="h-8"
          />
          <Button
            size="sm"
            disabled={busy || !name.trim()}
            onClick={() => patch({ name: name.trim() }, "Renamed")}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setName(area.name);
              setEditing(false);
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <span className={archived ? "flex-1 text-muted-foreground line-through" : "flex-1"}>
            {area.name}
          </span>
          {archived ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => patch({ archived: false }, "Restored")}
            >
              Restore
            </Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
                Rename
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={busy}
                onClick={() => patch({ archived: true }, "Archived")}
              >
                Archive
              </Button>
            </>
          )}
        </>
      )}
    </li>
  );
}
