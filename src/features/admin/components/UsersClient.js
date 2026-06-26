"use client";

import { useState } from "react";
import { 
  createAdminAction, 
  editAdminAction, 
  toggleAdminStatusAction, 
  resetAdminPasswordAction 
} from "@/features/admin/services/usersActions";
import { Plus, User, Key, Shield, UserMinus, UserCheck, Edit2, Search } from "lucide-react";
import { ROLES } from "@/shared/permissions";
import { Modal, Button, Input, Select } from "@/shared/ui";

const ROLE_COLORS = {
  SUPER_ADMIN: "bg-rose-50 text-rose-600 border-rose-100",
  SALES_MANAGER: "bg-indigo-50 text-indigo-600 border-indigo-100",
  SALES_EXECUTIVE: "bg-blue-50 text-blue-600 border-blue-100",
  CONTENT_EDITOR: "bg-amber-50 text-amber-600 border-amber-100",
  MARKETING_MANAGER: "bg-emerald-50 text-emerald-600 border-emerald-100"
};

export default function UsersClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modals / Drawers States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SALES_EXECUTIVE");
  const [newPassword, setNewPassword] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const resetForms = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("SALES_EXECUTIVE");
    setNewPassword("");
    setError("");
    setSuccess("");
  };

  const handleOpenAdd = () => {
    resetForms();
    setShowAddModal(true);
  };

  const handleOpenEdit = (user) => {
    resetForms();
    setActiveUser(user);
    setName(user.name);
    setRole(user.role || "SALES_EXECUTIVE");
    setShowEditModal(true);
  };

  const handleOpenPassword = (user) => {
    resetForms();
    setActiveUser(user);
    setShowPasswordModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);

      const res = await createAdminAction(formData);
      if (res.success) {
        setUsers([res.data, ...users]);
        setSuccess("Team member added successfully!");
        setTimeout(() => setShowAddModal(false), 1500);
      } else {
        setError(res.error || "Failed to create user.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);

      const res = await editAdminAction(activeUser._id, formData);
      if (res.success) {
        setUsers(users.map(u => u._id === activeUser._id ? res.data : u));
        setSuccess("Team member updated successfully!");
        setTimeout(() => setShowEditModal(false), 1500);
      } else {
        setError(res.error || "Failed to update user.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await resetAdminPasswordAction(activeUser._id, newPassword);
      if (res.success) {
        setSuccess("Password reset successfully!");
        setTimeout(() => setShowPasswordModal(false), 1500);
      } else {
        setError(res.error || "Failed to reset password.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (!confirm(`Are you sure you want to ${user.isActive ? "suspend" : "reactivate"} ${user.name}?`)) {
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await toggleAdminStatusAction(user._id);
      if (res.success) {
        setUsers(users.map(u => u._id === user._id ? res.data : u));
        setSuccess(`${user.name} status updated!`);
      } else {
        setError(res.error || "Action failed.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CRM Team Members</h1>
          <p className="text-sm text-slate-500 mt-1">Manage corporate administrator credentials and role-based CRM permissions.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-orange text-white hover:bg-orange-600 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-orange/15 transition duration-300"
        >
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-xl text-sm font-semibold">
          {success}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-brand-orange transition duration-200"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 text-left">Member</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Last Login</th>
                <th className="px-6 py-4 text-left">Created At</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                    No administrator accounts found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          {u.avatar ? (
                            <img src={u.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${ROLE_COLORS[u.role] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
                        {(u.role || "SALES_EXECUTIVE").replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${u.isActive ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-green-500" : "bg-red-500"}`} />
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Edit member role"
                          className="p-2 text-slate-400 hover:text-brand-orange bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-100 rounded-lg transition duration-200 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenPassword(u)}
                          title="Reset member password"
                          className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg transition duration-200 cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          title={u.isActive ? "Suspend member" : "Reactivate member"}
                          className={`p-2 border rounded-lg transition duration-200 cursor-pointer ${
                            u.isActive 
                              ? "text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 border-slate-100 hover:border-red-100" 
                              : "text-slate-400 hover:text-green-600 bg-slate-50 hover:bg-green-50 border-slate-100 hover:border-green-100"
                          }`}
                        >
                          {u.isActive ? <UserMinus className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} size="md">
        <Modal.Header>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-brand-orange" />
            Add Team Member
          </h3>
        </Modal.Header>
        <form onSubmit={handleAddSubmit}>
          <Modal.Body className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. john@shivshakti.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              required
              placeholder="Enter a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Select
              label="Role Division"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {Object.values(ROLES).map(r => (
                <option key={r} value={r}>{r.replace("_", " ")}</option>
              ))}
            </Select>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Save Member
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* EDIT MEMBER MODAL */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} size="md">
        <Modal.Header>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Edit2 className="w-4 h-4 text-brand-orange" />
            Edit Member Role
          </h3>
        </Modal.Header>
        <form onSubmit={handleEditSubmit}>
          <Modal.Body className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email (Read Only)"
              type="email"
              disabled
              value={activeUser?.email || ""}
            />
            <Select
              label="Role Division"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {Object.values(ROLES).map(r => (
                <option key={r} value={r}>{r.replace("_", " ")}</option>
              ))}
            </Select>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* PASSWORD RESET MODAL */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} size="md">
        <Modal.Header>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Key className="w-4 h-4 text-brand-orange" />
            Reset Password for {activeUser?.name}
          </h3>
        </Modal.Header>
        <form onSubmit={handlePasswordSubmit}>
          <Modal.Body className="flex flex-col gap-4">
            <Input
              label="New Password"
              type="password"
              required
              placeholder="Enter a new secure password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Reset Password
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
