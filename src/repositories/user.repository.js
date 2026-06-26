import Admin from "@/models/Admin";

export const UserRepository = {
  async findById(id) {
    return Admin.findById(id);
  },

  async findByEmail(email) {
    if (!email) return null;
    return Admin.findOne({ email: email.toLowerCase() });
  },

  async findAll(filter = {}, sort = { createdAt: -1 }) {
    return Admin.find(filter).sort(sort);
  },

  async create(data) {
    return Admin.create(data);
  },

  async update(id, data) {
    return Admin.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id) {
    return Admin.findByIdAndDelete(id);
  }
};
