import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Blog from "@/models/Blog";

export default async function sitemap() {
  const baseUrl = "https://www.shivshaktielevatorcomponents.com";

  // Connect to database
  try {
    await dbConnect();

    // Fetch dynamic content
    const [products, categories, blogs] = await Promise.all([
      Product.find({ status: { $in: ["published", "active"] } }).select("slug updatedAt"),
      Category.find().select("slug"),
      Blog.find({ status: "published" }).select("slug updatedAt"),
    ]);

    // Static Pages
    const staticRoutes = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/gallery`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
    ];

    // Dynamic Product Pages
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    // Dynamic Category Pages (Optional, in case category listings have routes)
    const categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/products?category=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.64,
    }));

    // Dynamic Blog Pages (For when blog posts template goes live)
    const blogRoutes = blogs.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.64,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    // Return standard static routes fallback if DB fails
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
      { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
      { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ];
  }
}
