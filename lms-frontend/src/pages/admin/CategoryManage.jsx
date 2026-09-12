import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";

export default function CategoryManage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      setError("Failed to load category list.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    setError("");
    try {
      const res = await createCategory({
        name: newName,
        description: newDescription,
      });
      setCategories((prev) => [...prev, res.data]);
      setNewName("");
      setNewDescription("");
    } catch (err) {
      setError("Failed to create category.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;

    setBusyId(id);
    setError("");
    try {
      await updateCategory(id, { name: editName });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editName } : c))
      );
      cancelEdit();
    } catch (err) {
      setError("Failed to update category.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    setBusyId(id);
    setError("");
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError("Failed to delete. Check if any course is using this category.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Category Management
        </h1>
        <p className="text-gray-500 mb-6"> add/edit/delete Course category. </p>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Create form */}
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-100 rounded-xl p-5 mb-6 space-y-3"
        >
          <h2 className="text-sm font-medium text-gray-700">New category</h2>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category naam"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {creating ? "Added..." : "Doing Add "}
          </button>
        </form>

        {/* List */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="px-5 py-3 flex items-center justify-between gap-3"
              >
                {editingId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      disabled={busyId === cat.id}
                      className="text-sm text-indigo-600 font-medium disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-sm text-gray-400 font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-900">{cat.name}</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => startEdit(cat)}
                        className="text-sm text-indigo-600 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={busyId === cat.id}
                        className="text-sm text-red-500 font-medium disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {categories.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              There is no category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
