import Product from "@/models/Product";

export const ProductRepository = {
  async findById(id) {
    return Product.findById(id);
  },

  async findBySlug(slug) {
    return Product.findOne({ slug: slug.toLowerCase() });
  },

  async findAll(filter = {}, sort = { displayOrder: 1, createdAt: -1 }) {
    return Product.find(filter).sort(sort);
  },

  async create(data) {
    return Product.create(data);
  },

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { returnDocument: "after" });
  },

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
};
