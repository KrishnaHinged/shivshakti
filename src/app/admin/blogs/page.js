import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogsClient from "@/components/admin/BlogsClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminBlogsPage() {
  await dbConnect();
  const blogs = await Blog.find().sort({ createdAt: -1 });

  return <BlogsClient initialItems={JSON.parse(JSON.stringify(blogs))} />;
}
