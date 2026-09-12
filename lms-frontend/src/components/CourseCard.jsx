import { Link } from "react-router-dom";
import { getMediaUrl } from "../services/api";

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="block bg-white border border-blue-200 rounded-xl overflow-hidden hover:shadow-lg transition"
    >
      <div className="h-36 bg-gray-100 flex items-center justify-center">
        {course.thumbnail ? (
          <img
            src={getMediaUrl(course.thumbnail)}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-300 text-sm">No thumbnail</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm md:text-lg font-bold text-indigo-600">
            {course.price > 0 ? `৳${course.price}` : "Free"}
          </span>
          {/* note: backend theke shudhu category ID ashe (naam na),
              tai category naam dekhate hole backend e category er
              details serializer e nested kore dite hobe. Ekhon shudhu
              ID thakle seta na dekhiye baad dewa holo */}
        </div>
      </div>
    </Link>
  );
}
