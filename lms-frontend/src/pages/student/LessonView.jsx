import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import {
  getLesson,
  getProgress,
  markLessonComplete,
  updateProgress,
} from "../../services/api";

export default function LessonView() {
  const { id } = useParams();
  const { role } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [progressRecord, setProgressRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  // youtube link er jonno
  const getYoutubeId = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
  );

  return match ? match[1] : null;
};

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const lessonRes = await getLesson(id);
      setLesson(lessonRes.data);

      if (role === "student") {
        const progressRes = await getProgress();
        const existing = progressRes.data.find(
          (p) => String(p.lesson) === String(id)
        );
        setProgressRecord(existing || null);
      }
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 404) {
        setError(
          "You don’t have access to this lesson. Please make sure you are enrolled in the course."
        );
      } else {
        setError("Failed to load lesson.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    setMarking(true);
    setError("");
    try {
      if (progressRecord) {
        await updateProgress(progressRecord.id, { completed: true });
      } else {
        await markLessonComplete(id);
      }
      
      setProgressRecord((prev) => ({ ...(prev || {}), completed: true }));
    } catch (err) {
      setError("Failed to update progress.");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          to={lesson ? `/courses/${lesson.course}` : "/courses"}
          className="font-semibold text-indigo-500 hover:text-indigo-700 mb-4 inline-block"
        >
          ← Back to Course
        </Link>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {lesson && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {lesson.title}
            </h1>

            {lesson.video_url && (
              <div className="mt-4 aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(lesson.video_url)}`}
                  className="w-full h-full"
                  allowFullScreen
                  title={lesson.title}
                />
              </div>
            )}

            <p className="text-gray-600 mt-5 whitespace-pre-line leading-relaxed">
              {lesson.content}
            </p>

            {role === "student" && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                {progressRecord?.completed ? (
                  <span className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg font-medium inline-block">
                    Complete done ✓
                  </span>
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    disabled={marking}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {marking ? "Update successfull..." : "Complete "}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
