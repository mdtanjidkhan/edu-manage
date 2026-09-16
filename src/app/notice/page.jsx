"use client";

import { useState, useEffect } from "react";
import { FiBell, FiCalendar, FiSearch } from "react-icons/fi";

export default function AllNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllNotices() {
      try {
        // কোনো limit না পাঠিয়ে সব নোটিশ ফেচ করা হচ্ছে
        const res = await fetch("http://localhost:5000/api/notice"); 
        const data = await res.json();
        setNotices(data);
      } catch (error) {
        console.error("Notices fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllNotices();
  }, []);

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="py-12 bg-transparent min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-base-content/10">
          <div>
            <h1 className="text-3xl font-extrabold text-base-content flex items-center gap-3">
              <FiBell className="text-primary" /> সকল নোটিশ
            </h1>
            <p className="text-sm text-base-content/70 mt-1">
              আমাদের প্রতিষ্ঠানের সকল দাপ্তরিক ও শিক্ষাসংক্রান্ত বিজ্ঞপ্তি
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-3.5 top-3 text-base-content/50" size={18} />
            <input
              type="text"
              placeholder="নোটিশ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl bg-base-100/50 focus:outline-primary"
            />
          </div>
        </div>

        {/* Notices List */}
        <div className="mt-8 space-y-4">
          {loading ? (
            [1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-24 w-full bg-base-200/50 animate-pulse rounded-2xl" />
            ))
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <div
                key={notice._id}
                className="p-6 rounded-2xl border border-base-content/10 bg-base-100/40 backdrop-blur-sm hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-base-200/60 border border-base-content/5 min-w-[70px] text-center">
                    <span className="text-xs font-bold text-primary uppercase">
                      {notice.date ? new Date(notice.date).toLocaleString('default', { month: 'short' }) : 'SEP'}
                    </span>
                    <span className="text-xl font-extrabold text-base-content">
                      {notice.date ? new Date(notice.date).getDate() : '05'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-primary badge-outline text-[10px] py-1 px-2 font-medium">
                        {notice.category || "General"}
                      </span>
                      <span className="text-xs text-base-content/50 flex items-center gap-1">
                        <FiCalendar size={12} />
                        {notice.date}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-base-content">
                      {notice.title}
                    </h3>
                    
                    <p className="text-sm text-base-content/70 mt-1 leading-relaxed">
                      {notice.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-base-content/60 border border-dashed border-base-content/20 rounded-2xl">
              কোনো নোটিশ খুঁজে পাওয়া যায়নি।
            </div>
          )}
        </div>

      </div>
    </main>
  );
}