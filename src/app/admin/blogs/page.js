import dbConnect from "@/shared/lib/mongodb";
import { Blog } from "@/shared/models";
import BlogsClient from "@/features/blog/components/Admin/BlogsClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminBlogsPage() {
  await dbConnect();
  const blogs = await Blog.find().sort({ createdAt: -1 });

  return <BlogsClient initialItems={JSON.parse(JSON.stringify(blogs))} />;
}
