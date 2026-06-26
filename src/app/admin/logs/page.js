import dbConnect from "@/shared/lib/mongodb";
import { ActivityLog } from "@/shared/models";
import { LogsClient } from "@/features/admin";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminLogsPage() {
  await dbConnect();
  const logs = await ActivityLog.find().sort({ createdAt: -1 });

  return <LogsClient initialLogs={JSON.parse(JSON.stringify(logs))} />;
}
