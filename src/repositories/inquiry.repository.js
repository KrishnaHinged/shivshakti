import Inquiry from "@/models/Inquiry";

export const InquiryRepository = {
  async findById(id) {
    return Inquiry.findById(id).populate("assignedTo", "name email role");
  },

  async findAll(filter = {}, sort = { createdAt: -1 }) {
    return Inquiry.find(filter)
      .populate("assignedTo", "name email role")
      .sort(sort);
  },

  async create(data) {
    return Inquiry.create(data);
  },

  async update(id, data) {
    return Inquiry.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id) {
    return Inquiry.findByIdAndDelete(id);
  },

  async assignLead(inquiryId, userId, managerId) {
    return Inquiry.findByIdAndUpdate(
      inquiryId,
      {
        assignedTo: userId || null,
        assignedBy: managerId || null,
        assignedAt: userId ? new Date() : null
      },
      { new: true }
    );
  }
};
