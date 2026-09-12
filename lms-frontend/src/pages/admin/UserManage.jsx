import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers, updateUser, deleteUser } from "../../services/api";

const ROLES = ["student", "instructor", "admin"];

export default function UserManage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load user list.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setBusyId(userId);
    setError("");
    try {
      await updateUser(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setError("Failed to load update list");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure, you want to delete this category?")) return;

    setBusyId(userId);
    setError("");
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failled to delate";
      setError(msg);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          User Management
        </h1>
        <p className="text-gray-500 mb-6">View and manage all users.</p>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Username</th>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-right px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3 text-gray-900">{u.username}</td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={busyId === u.id || u.id === currentUser?.id}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={busyId === u.id || u.id === currentUser?.id}
                      className="text-red-500 hover:text-red-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              There is no user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
