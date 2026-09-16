"use client";

import { useState } from "react";
import Image from "next/image";
import { FiPlay, FiX, FiVideo, FiImage } from "react-icons/fi";

export default function CampusLife() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const activities = [
    {
      id: 1,
      type: "video",
      category: "sports",
      title: "Annual Sports Day Highlights",
      youtubeId: "L_LUpnjgPso", 
      thumbnail: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      type: "image",
      category: "cultural",
      title: "Pohela Boishakh Celebration",
      imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      type: "video",
      category: "cultural",
      title: "Annual Cultural Evening Performance",
      youtubeId: "dQw4w9WgXcQ", 
      thumbnail: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      type: "image",
      category: "sports",
      title: "Inter-School Football Tournament",
      imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 5,
      type: "image",
      category: "cultural",
      title: "Science Fair & Exhibition",
      imageUrl: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 6,
      type: "image",
      category: "sports",
      title: "Cricket Championship Final",
      imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const filteredActivities = activeTab === "all" 
    ? activities 
    : activities.filter((item) => item.category === activeTab);

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Campus Life & Activities
          </h2>
          <p className="text-base-content/70 mt-3 text-sm sm:text-base leading-relaxed">
            শিক্ষা কার্যক্রমের পাশাপাশি আমাদের শিক্ষার্থীদের শারীরিক ও মানসিক বিকাশে খেলাধুলা এবং নিয়মিত সাংস্কৃতিক চর্চার চিত্র।
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`btn btn-sm sm:btn-md rounded-xl font-medium transition-all ${
                activeTab === "all" ? "btn-primary shadow-md shadow-primary/20" : "btn-ghost border border-base-content/10"
              }`}
            >
              All Activities
            </button>
            <button
              onClick={() => setActiveTab("sports")}
              className={`btn btn-sm sm:btn-md rounded-xl font-medium transition-all ${
                activeTab === "sports" ? "btn-primary shadow-md shadow-primary/20" : "btn-ghost border border-base-content/10"
              }`}
            >
              Sports & Athletics
            </button>
            <button
              onClick={() => setActiveTab("cultural")}
              className={`btn btn-sm sm:btn-md rounded-xl font-medium transition-all ${
                activeTab === "cultural" ? "btn-primary shadow-md shadow-primary/20" : "btn-ghost border border-base-content/10"
              }`}
            >
              Cultural Events
            </button>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-base-content/10 bg-base-100/40 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={item.type === "video" ? item.thumbnail : item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="badge border-0 gap-1.5 text-xs py-2 px-3 backdrop-blur-md bg-black/40 text-white font-medium">
                    {item.type === "video" ? <FiVideo size={13} /> : <FiImage size={13} />}
                    {item.type === "video" ? "Video" : "Photo"}
                  </span>
                </div>

                {/* Video Play Button */}
                {item.type === "video" && (
                  <button
                    onClick={() => setSelectedVideo(item.youtubeId)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform"
                    aria-label="Play Video"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg shadow-primary/40 pl-1">
                      <FiPlay size={24} />
                    </div>
                  </button>
                )}

                {/* Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-semibold text-base sm:text-lg leading-snug drop-shadow-sm">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-all"
            >
              <FiX size={20} />
            </button>
            <div className="relative pt-[56.25%] w-full">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}