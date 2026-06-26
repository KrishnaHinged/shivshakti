import dbConnect from "@/lib/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import EmailTemplatesClient from "@/components/admin/EmailTemplatesClient";
import { getEmailTemplatesAction } from "@/actions/email-templates";

export const revalidate = 0;

export default async function AdminEmailTemplatesPage() {
  await dbConnect();
  
  // Call server action directly on server-side to ensure self-healing seeder executes
  const res = await getEmailTemplatesAction();
  const templates = res.success ? res.data : [];

  return (
    <EmailTemplatesClient
      initialTemplates={templates}
    />
  );
}
