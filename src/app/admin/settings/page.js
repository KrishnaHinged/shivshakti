import dbConnect from "@/shared/lib/mongodb";
import { Setting } from "@/shared/models";
import SettingsClient from "@/features/admin/components/SettingsClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminSettingsPage() {
  await dbConnect();
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  return <SettingsClient settings={JSON.parse(JSON.stringify(settings))} />;
}
