import dbConnect from "@/shared/lib/mongodb";
import { Admin } from "@/shared/models";
import UsersClient from "@/features/admin/components/UsersClient";

export const revalidate = 0;

export default async function AdminUsersPage() {
  await dbConnect();
  const admins = await Admin.find().sort({ createdAt: -1 });

  return (
    <UsersClient
      initialUsers={JSON.parse(JSON.stringify(admins))}
    />
  );
}
