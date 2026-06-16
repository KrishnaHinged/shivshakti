"use server";

import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import ActivityLog from "@/models/ActivityLog";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Verify if admin is logged in
 */
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) throw new Error("Unauthorized action execution.");
}

/**
 * Create a new blog post
 */
export async function createBlogAction(formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const featuredImage = formData.get("featuredImage")?.toString().trim();
    const shortDescription = formData.get("shortDescription")?.toString().trim();
    const content = formData.get("content")?.toString().trim();
    const metaTitle = formData.get("metaTitle")?.toString().trim();
    const metaDescription = formData.get("metaDescription")?.toString().trim();
    const tagsStr = formData.get("tags")?.toString().trim() || "";
    const status = formData.get("status")?.toString() || "draft";
    const category = formData.get("category")?.toString().trim() || "General";
    const author = formData.get("author")?.toString().trim() || "Shivshakti Team";
    const publishedAtInput = formData.get("publishedAt")?.toString().trim();

    if (!title || !slug || !featuredImage || !shortDescription || !content) {
      return { success: false, error: "Missing required fields." };
    }

    const exists = await Blog.findOne({ slug });
    if (exists) {
      return { success: false, error: "Blog post with this slug already exists." };
    }

    const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    
    let publishedAt = null;
    if (status === "published") {
      publishedAt = publishedAtInput ? new Date(publishedAtInput) : new Date();
      if (isNaN(publishedAt.getTime())) {
        publishedAt = new Date();
      }
    }

    const blog = await Blog.create({
      title,
      slug,
      featuredImage,
      shortDescription,
      content,
      metaTitle,
      metaDescription,
      tags,
      category,
      author,
      status,
      publishedAt,
    });

    await ActivityLog.create({
      action: "blog_create",
      details: `Created blog post: ${title}`,
    });

    revalidatePath("/admin/blogs");
    return { success: true, data: JSON.parse(JSON.stringify(blog)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Edit an existing blog post
 */
export async function editBlogAction(id, formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const featuredImage = formData.get("featuredImage")?.toString().trim();
    const shortDescription = formData.get("shortDescription")?.toString().trim();
    const content = formData.get("content")?.toString().trim();
    const metaTitle = formData.get("metaTitle")?.toString().trim();
    const metaDescription = formData.get("metaDescription")?.toString().trim();
    const tagsStr = formData.get("tags")?.toString().trim() || "";
    const status = formData.get("status")?.toString() || "draft";
    const category = formData.get("category")?.toString().trim() || "General";
    const author = formData.get("author")?.toString().trim() || "Shivshakti Team";
    const publishedAtInput = formData.get("publishedAt")?.toString().trim();

    if (!title || !slug || !featuredImage || !shortDescription || !content) {
      return { success: false, error: "Missing required fields." };
    }

    const exists = await Blog.findOne({ slug, _id: { $ne: id } });
    if (exists) {
      return {
        success: false,
        error: "Another blog post with this slug already exists.",
      };
    }

    const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);

    const original = await Blog.findById(id);
    if (!original) return { success: false, error: "Blog post not found." };

    let publishedAt = original.publishedAt;
    if (status === "published") {
      publishedAt = publishedAtInput ? new Date(publishedAtInput) : (original.publishedAt || new Date());
      if (isNaN(new Date(publishedAt).getTime())) {
        publishedAt = new Date();
      }
    } else if (status === "draft") {
      publishedAt = null;
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        featuredImage,
        shortDescription,
        content,
        metaTitle,
        metaDescription,
        tags,
        category,
        author,
        status,
        publishedAt,
      },
      { new: true }
    );

    await ActivityLog.create({
      action: "blog_edit",
      details: `Edited blog post: ${title}`,
    });

    revalidatePath("/admin/blogs");
    return { success: true, data: JSON.parse(JSON.stringify(blog)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogAction(id) {
  try {
    await verifyAuth();
    await dbConnect();

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return { success: false, error: "Blog post not found." };

    await ActivityLog.create({
      action: "blog_delete",
      details: `Deleted blog post: ${blog.title}`,
    });

    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
