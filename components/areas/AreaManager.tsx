"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Area } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AreaRow } from "@/components/areas/AreaRow";

type Props = {
  zoneId: string;
  initialAreas: Area[];
};

export function AreaManager({ zoneId, initialAreas }: Props) {
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [showArchived, setShowArchived] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh(includeArchived: boolean) {
    const res = await fetch(
      `/api/areas?zoneId=${zoneId}&includeArchived=${includeArchived}`
    );
    if (!res.ok) return;
    const data = await res.json();
    setAreas(data.areas);
  }

  useEffect(() => {
    refresh(showArchived);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived]);

  async function addArea(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneId, name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not add area");
      setNewName("");
      await refresh(showArchived);
      toast.success(`Added ${data.area.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add area");
    } finally {
      setBusy(false);
    }
  }

  const visible = showArchived
    ? areas
    : areas.filter((a) => a.archivedAt === null);

  return (
    <div className="space-y-4">
      <form onSubmit={addArea} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New area name"
          aria-label="New area name"
        />
        <Button type="submit" disabled={busy || !newName.trim()}>
          Add
        </Button>
      </form>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No areas yet.</p>
      ) : (
        <ul className="divide-y rounded-md border">
          {visible.map((area) => (
            <AreaRow
              key={area.id}
              area={area}
              onChanged={() => refresh(showArchived)}
            />
          ))}
        </ul>
      )}

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
        />
        Show archived areas
      </label>
    </div>
  );
}
