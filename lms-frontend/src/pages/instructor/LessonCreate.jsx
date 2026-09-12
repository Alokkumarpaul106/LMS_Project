import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { createLesson } from "../../services/api";
import Footer from "../../components/Footer";

export default function LessonCreate() {
  const { id: courseId } = useParams(); // course id URL theke
  const [form, setForm] = useState({
    title: "",
    content: "",
    video_url: "",
    order: "1",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await createLesson({
        ...form,
        order: Number(form.order) || 1,
        course: courseId, // backend e "course" field required
      });
      navigate(`/courses/${courseId}`);
    } catch (err) {
      if (err.response?.data && typeof err.response.data === "object") {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Failed to crate lessons !" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Create to new lessons
        </h1>

        {errors.general && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errors.general}
          </div>
        )}
        {errors.course && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errors.course[0]}
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
              Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.content && (
              <p className="text-xs text-red-600 mt-1">{errors.content[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL (optional)
            </label>
            <input
              type="url"
              name="video_url"
              value={form.video_url}
              onChange={handleChange}
              placeholder="https://youtube.com/embed/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.video_url && (
              <p className="text-xs text-red-600 mt-1">
                {errors.video_url[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.order && (
              <p className="text-xs text-red-600 mt-1">{errors.order[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Create successfull..." : "Add lesson"}
          </button>
        </form>
      </div>
      <Footer/>
    </div>
  );
}
