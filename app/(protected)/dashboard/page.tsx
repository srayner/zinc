import Link from "next/link";
import { listZones } from "@/services/zones";
import { ScoreBadge } from "@/components/scoring/ScoreBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const zones = await listZones();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Overall condition</h1>
        <ScoreBadge score={null} />
      </div>
      <p className="text-sm text-muted-foreground">
        Condition scoring activates once task types are assigned to areas and
        completions are logged.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>
                <Link href={`/zones/${zone.type.toLowerCase()}`} className="hover:underline">
                  {zone.name}
                </Link>
              </CardTitle>
              <ScoreBadge score={null} />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {zone._count.areas} area{zone._count.areas === 1 ? "" : "s"}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
