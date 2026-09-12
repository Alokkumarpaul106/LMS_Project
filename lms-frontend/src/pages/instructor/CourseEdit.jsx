import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import { getCourse, updateCourse, getCategories, getMediaUrl } from "../../services/api";
import Footer from "../../components/Footer";

export default function CourseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "0",
    category: "",
  });
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseRes, catRes] = await Promise.all([
        getCourse(id),
        getCategories(),
      ]);
      const c = courseRes.data;
      setForm({
        title: c.title || "",
        description: c.description || "",
        price: String(c.price ?? "0"),
        category: c.category || "",
      });
      setCurrentThumbnail(c.thumbnail);
      setCategories(catRes.data);
    } catch (err) {
      setErrors({ general: "Failed to load course data." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    try {
      // note: shudhu je field change hoyeche seguloi pathacchi (PATCH),
      // notun thumbnail dile FormData use korte hobe, na dile plain object thik ache
      let payload;
      if (newThumbnail) {
        payload = new FormData();
        payload.append("title", form.title);
        payload.append("description", form.description);
        payload.append("price", form.price || "0");
        if (form.category) payload.append("category", form.category);
        payload.append("thumbnail", newThumbnail);
      } else {
        payload = {
          title: form.title,
          description: form.description,
          price: form.price || "0",
          category: form.category || null,
        };
      }

      await updateCourse(id, payload);
      navigate(`/courses/${id}`);
    } catch (err) {
      if (err.response?.data && typeof err.response.data === "object") {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Failed to course update." });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Course edit korun
        </h1>

        {errors.general && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errors.general}
          </div>
        )}
        {errors.detail && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errors.detail}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">
                {errors.description[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (৳)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.price && (
                <p className="text-xs text-red-600 mt-1">{errors.price[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail
            </label>
            {currentThumbnail && !newThumbnail && (
              <img
                src={getMediaUrl(currentThumbnail)}
                alt="current thumbnail"
                className="w-32 h-20 object-cover rounded-lg mb-2 border border-gray-100"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewThumbnail(e.target.files[0])}
              className="w-full text-sm text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              If no new file is selected, the existing thumbnail will remain unchanged.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? "Save successfull..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/courses/${id}`)}
              className="px-5 py-2 rounded-lg font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
}
