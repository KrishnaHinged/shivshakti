import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";
import SettingsClient from "@/components/admin/SettingsClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminSettingsPage() {
  await dbConnect();
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  return <SettingsClient settings={JSON.parse(JSON.stringify(settings))} />;
}
