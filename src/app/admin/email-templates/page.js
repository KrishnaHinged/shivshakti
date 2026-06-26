import dbConnect from "@/shared/lib/mongodb";
import { EmailTemplate } from "@/shared/models";
import { EmailTemplatesClient } from "@/features/admin";
import { getEmailTemplatesAction } from "@/features/admin/services/emailTemplatesActions";

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
