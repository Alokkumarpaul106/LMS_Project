import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import CourseCard from "../../components/CourseCard";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { getCourses } from "../../services/api";
import Footer from "../../components/Footer";

export default function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      // note: backend e CourseViewSet.get_queryset() instructor hole
      // already shudhu nijer course filter kore dey, tai extra
      // filtering frontend e lagbe na
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      setError("Failed to load course list");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              My Courses
            </h1>
            <p className="text-gray-500">
              {user?.username} create in all courses.
            </p>
          </div>
          <Link
            to="/courses/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            + New course
          </Link>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {!error && courses.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            There is no course in create available.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
