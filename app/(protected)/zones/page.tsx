import Link from "next/link";
import { listZones } from "@/services/zones";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ZonesPage() {
  const zones = await listZones();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Zones</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {zones.map((zone) => (
          <Link key={zone.id} href={`/zones/${zone.type.toLowerCase()}`}>
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle>{zone.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {zone._count.areas} area{zone._count.areas === 1 ? "" : "s"}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
