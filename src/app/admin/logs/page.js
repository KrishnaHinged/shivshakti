import dbConnect from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";
import LogsClient from "@/components/admin/LogsClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminLogsPage() {
  await dbConnect();
  const logs = await ActivityLog.find().sort({ createdAt: -1 });

  return <LogsClient initialLogs={JSON.parse(JSON.stringify(logs))} />;
}
