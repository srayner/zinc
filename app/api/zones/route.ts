import { withErrorHandling } from "@/lib/api/handler";
import { withAuth } from "@/lib/api/with-auth";
import { listZones } from "@/services/zones";

export const GET = withErrorHandling(
  withAuth(async () => {
    const zones = await listZones();
    return { zones };
  })
);
