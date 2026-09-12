import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getVideos } from "../../services/api";

export default function VideoList() {
  const [videos, setVideos] = useState([]);
//   video list fetch korar jonno useEffect use kora hoise, jeta component mount howar por call hobe.
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await getVideos();
        setVideos(videoData.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);
  // youtube link er jonno
  const getYoutubeId = (url) => {
    if (!url) return null;

    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);

    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb]">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Course Videos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore all available lecture videos and start learning.
          </p>
        </div>

        {/* mapping function jekhane video gulo map hobe  r tene niye asbe backend theke */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Video Thumbnail Placeholder */}
                <div className="relative aspect-video bg-indigo-50 flex items-center justify-center text-indigo-400 group cursor-pointer">
                  <div className="mt-4 aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(video.video_url)}`}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      
                    />
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
                    {video.duration}
                  </span>
                </div>

                {/* Video Meta Info */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                      {video.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                    <span>{video.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">
              No videos found for this course.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
