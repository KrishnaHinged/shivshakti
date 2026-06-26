import { Blog } from "@/shared/models";

export const BlogRepository = {
  async findById(id) {
    return Blog.findById(id);
  },

  async findBySlug(slug) {
    return Blog.findOne({ slug: slug.toLowerCase() });
  },

  async findAll(filter = {}, sort = { publishedAt: -1, createdAt: -1 }) {
    return Blog.find(filter).sort(sort);
  },

  async create(data) {
    return Blog.create(data);
  },

  async update(id, data) {
    return Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id) {
    return Blog.findByIdAndDelete(id);
  }
};
