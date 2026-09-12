
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import {
  getCourse,
  getLessons,
  getEnrollments,
  enrollInCourse,
  deleteCourse,
  getMediaUrl,
} from "../../services/api";
import Footer from "../../components/Footer";

export default function CourseDetail() {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAll();
  }, [id, role]);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
     
      // Get Course
      const courseRes = await getCourse(id);
      setCourse(courseRes.data);

      let approved = false;

      
      // Student Enrollment Check
      
      if (role === "student") {
        const enrollRes = await getEnrollments();

        const enrollment = enrollRes.data.find(
          (e) => String(e.course) === String(id)
        );

        if (enrollment) {
          // pending / approved / rejected
          setEnrollmentStatus(enrollment.status);

          if (enrollment.status === "approved") {
            setIsEnrolled(true);
            approved = true;
          } else {
            setIsEnrolled(false);
          }
        } else {
          setEnrollmentStatus(null);
          setIsEnrolled(false);
        }
      }

      
      // Get Lessons
      
      if (role !== "student" || approved) {
        const lessonRes = await getLessons(id);
        setLessons(lessonRes.data);
      } else {
        setLessons([]);
      }
    } catch (err) {
      console.error("Course load error:", err);

      setError(
        err.response?.data?.detail || "Failed to load course."
      );
    } finally {
      setLoading(false);
    }
  };

  
  // Request Enrollment
  
  const handleEnroll = async () => {
    setEnrolling(true);
    setError("");
    setMessage("");

    try {
      await enrollInCourse(id);

      // Request করার সাথে সাথে enrolled হবে না
      setEnrollmentStatus("pending");
      setIsEnrolled(false);

      // Lessons hide থাকবে
      setLessons([]);

      setMessage(
        "Enrollment request sent successfully. Please complete the payment and wait for admin approval."
      );
    } catch (err) {
      console.error("Enrollment error:", err);

      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Failed to send enrollment request.";

      setError(msg);
    } finally {
      setEnrolling(false);
    }
  };

  
  // Delete Course
  
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? All lessons and enrollments will also be deleted."
      )
    ) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteCourse(id);
      navigate("/courses");
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to delete course.";

      setError(msg);
      setDeleting(false);
    }
  };

  
  // Loading
  
  if (loading) {
    return <Loading />;
  }

  
  // Course Not Found
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-3xl mx-auto px-6 py-16 text-center text-gray-400">
          There are no courses available.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">

        
            {/* Error Message */}
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        
            {/* Success Message */}
        
        {message && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3 mb-6">
            {message}
          </div>
        )}

        
            {/* Course Card */}
        
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6">

          {/* Thumbnail */}
          {course.thumbnail && (
            <img
              src={getMediaUrl(course.thumbnail)}
              alt={course.title}
              className="w-full h-56 object-cover"
            />
          )}

          <div className="p-6">

            {/* Course Title + Actions */}
            <div className="flex items-start justify-between">

              <h1 className="text-2xl font-semibold text-gray-900">
                {course.title}
              </h1>

              {(role === "instructor" || role === "admin") && (
                <div className="flex items-center gap-3 shrink-0 ml-4">

                  {/* Edit */}
                  <Link
                    to={`/courses/${id}/edit`}
                    className="text-sm text-indigo-600 font-medium hover:underline"
                  >
                    Edit
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-sm text-red-500 font-medium hover:underline disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>

                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-500 mt-2">
              {course.description}
            </p>

            {/* Price + Enrollment */}
            <div className="flex items-center justify-between mt-5">

              {/* Price */}
              <span className="text-lg font-semibold text-indigo-600">
                {course.price > 0
                  ? `৳${course.price}`
                  : "Free"}
              </span>

              
                  {/* Student: Request Enroll */}
              
              {role === "student" && !enrollmentStatus && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {enrolling
                    ? "Sending Request..."
                    : "Request Enroll"}
                </button>
              )}

              
                  {/* Pending */}
              
              {role === "student" && enrollmentStatus === "pending" && (
                  <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full font-medium">
                    ⏳ Pending Admin Approval
                  </span>
                )}

              
                  {/* Approved */}
              
              {role === "student" && enrollmentStatus === "approved" && (
                  <span className="text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-medium">
                    Enrolled ✓
                  </span>
                )}

              
                  {/* Rejected */}
             
              {role === "student" && enrollmentStatus === "rejected" && (
                  <span className="text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-full font-medium">
                    Enrollment Rejected
                  </span>
                )}
            </div>
          </div>
        </div>

        
            {/* Lessons Section */}
        
        <div className="bg-white border border-gray-100 rounded-xl p-6">

          {/* Lessons Header */}
          <div className="flex items-center justify-between mb-4">

            <h2 className="text-lg font-semibold text-gray-900">
              Lessons
            </h2>

            {(role === "instructor" || role === "admin") && (
              <Link
                to={`/courses/${id}/lessons/create`}
                className="text-sm text-indigo-600 font-medium hover:underline"
              >
                + Add Lesson
              </Link>
            )}
          </div>

          
              {/* Student - No Request */}
          
          {role === "student" && !enrollmentStatus && (
            <p className="text-sm text-gray-400">
              Please request enrollment first to access the lessons.
            </p>
          )}

          
              {/* Student - Pending */}
         
          {role === "student" && enrollmentStatus === "pending" && (
              <p className="text-sm text-yellow-600 bg-yellow-50 rounded-lg px-4 py-3">
                ⏳ Your enrollment request is pending. Please complete
                the payment and wait for admin approval to access the
                lessons.
              </p>
            )}

          
              {/* Student - Rejected */}
          
          {role === "student" && enrollmentStatus === "rejected" && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                Your enrollment request was rejected by the admin.
              </p>
            )}

          
              {/* No Lessons */}
          
          {(role !== "student" || isEnrolled) && lessons.length === 0 && (
              <p className="text-sm text-gray-400">
                There are no lessons available.
              </p>
            )}

          
              {/* Lesson List */}
          
          {(role !== "student" || isEnrolled) && lessons.length > 0 && (
              <ul className="divide-y divide-gray-100">

                {lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {lesson.order}. {lesson.title}
                      </p>
                    </div>

                    <Link
                      to={`/lessons/${lesson.id}`}
                      className="text-sm border rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                    >
                      See
                    </Link>
                  </li>
                ))}

              </ul>
            )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

