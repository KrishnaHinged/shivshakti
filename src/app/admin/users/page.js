import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import UsersClient from "@/components/admin/UsersClient";

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
