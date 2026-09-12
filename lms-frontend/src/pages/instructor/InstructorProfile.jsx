import React from "react";
import { useState, useEffect } from "react";
import { getInstructors } from "../../services/api";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const InstructorProfile = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const instructorData = await getInstructors();
        setInstructors(instructorData.data);
      } catch (err) {
        console.error("Failed to fetch instructor profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-10 pb-16">
        {/* Page Header */}
        <section className="max-w-6xl mx-auto px-4 mb-10">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 mb-3 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
              Our Instructors
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Meet Our Instructors
            </h1>

            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Learn from experienced instructors and improve your skills with
              practical and quality courses.
            </p>
          </div>
        </section>

        {/* Instructor Cards */}
        <section className="max-w-5xl mx-auto px-4">
          {instructors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No instructor profile found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Top Section */}
                  <div className="bg-indigo-600 h-24"></div>

                  {/* Profile Image */}
                  <div className="relative flex justify-center">
                    <div className="absolute -top-14 w-40 h-40 rounded-full bg-white p-1.5 shadow-lg">
                      {instructor.profile_picture ? (
                        <img
                          src={instructor.profile_picture}
                          alt={instructor.user?.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-3xl font-bold text-indigo-600">
                            {instructor.user?.username
                              ?.charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-16 px-6 pb-6 text-center">
                    
                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      Instructor
                    </p>

                    {/* Bio */}
                    <p className="text-gray-500 text-sm leading-6 mt-4 min-h-[72px] line-clamp-2">
                      {instructor.bio || "No bio available."}
                    </p>

                    {/* Social Links */}
                    {instructor.social_links && (
                      <div className="flex justify-center gap-3 mt-5">
                        {instructor.social_links.github && (
                          <a
                            href={instructor.social_links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white flex items-center justify-center transition"
                          >
                            Git
                          </a>
                        )}

                        {instructor.social_links.linkedin && (
                          <a
                            href={instructor.social_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                          >
                            in
                          </a>
                        )}

                        {instructor.social_links.facebook && (
                          <a
                            href={instructor.social_links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                          >
                            f
                          </a>
                        )}

                        {instructor.social_links.website && (
                          <a
                            href={instructor.social_links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition"
                          >
                            🌐
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default InstructorProfile;