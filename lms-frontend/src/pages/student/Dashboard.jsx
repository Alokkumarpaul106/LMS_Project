import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Dashboard() {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-bold text-green-600">
          welcome, {user?.first_name || user?.username}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          You are logged in as a  <span className="font-medium">{role}</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 ">
          <Link
            to="/courses"
            className="bg-gradient-to-r from-blue-200  border border-green-300 border-gray-100 rounded-xl p-5 hover:shadow-lg transition"
          >
            <h3 className="font-medium text-gray-900">Browse Courses</h3>
            <p className="text-sm text-gray-500 mt-1">
              view all available courses and enroll.
            </p>
          </Link>
{/* recorded videos */}
          <Link
            to="/videos"
            className="bg-gradient-to-r from-blue-200  border border-green-300 border-gray-100 rounded-xl p-5 hover:shadow-lg transition"
          >
            <h3 className="font-medium text-gray-900">Recorded Videos</h3>
            <p className="text-sm text-gray-500 mt-1">
              view all available recorded videos for every user.
            </p>
          </Link>

          {(role === "instructor" || role === "admin") && (
            <Link
              to="/my-courses"
              className="bg-gradient-to-r from-red-200 border border-red-300 border-gray-100 rounded-xl p-5 hover:shadow-md transition"
            >
              <h3 className="font-medium text-gray-900">My Courses</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage the courses you created.
              </p>
            </Link>
          )}

          {role === "admin" && (
            <>
              <Link
                to="/admin/users"
                className="bg-gradient-to-r from-blue-200 border border-gray-100 rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="font-medium text-gray-900">User Management</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage user roles and delete accounts.
                </p>
              </Link>
              <Link
                to="/admin/categories"
                className="bg-gradient-to-r from-red-200 border border-gray-100 rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="font-medium text-gray-900">Category Management</h3>
                <p className="text-sm text-gray-500 mt-1">
                add/edit/delete Course category.
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
      </main>


      <Footer />
    </div>
  );
}
