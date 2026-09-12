import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CourseCard from "../../components/CourseCard";
import Loading from "../../components/Loading";
import { getCourses } from "../../services/api";

export default function CourseList() {
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
      const res = await getCourses();
      // note: backend e pagination on kora hoyni, tai response
      // plain array hisebe ashe (direct res.data)
      setCourses(res.data);
    } catch (err) {
      setError("Failed to course list");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
    
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Courses</h1>
        <p className="text-gray-500 mb-6">All course doing browse.</p>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {!error && courses.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            There are no courses available.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
       <Footer/>
    </div>
     
  );
}
