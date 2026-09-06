import { notFound } from "next/navigation";
import { getZoneByType, parseZoneType } from "@/services/zones";
import { AreaManager } from "@/components/areas/AreaManager";

export default async function ZonePage({
  params,
}: {
  params: Promise<{ zoneType: string }>;
}) {
  const { zoneType } = await params;
  const parsed = parseZoneType(zoneType);
  if (!parsed) notFound();

  const zone = await getZoneByType(parsed);
  if (!zone) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Zone</p>
        <h1 className="text-2xl font-semibold">{zone.name}</h1>
      </div>
      <AreaManager zoneId={zone.id} initialAreas={zone.areas} />
    </div>
  );
}
