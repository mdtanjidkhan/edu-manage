"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiBell, 
  FiCalendar, 
  FiArrowRight, 
  FiClock, 
  FiMapPin 
} from "react-icons/fi";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        // ব্যাকএন্ড API থেকে ৪টি নোটিশ লিমিট করে ফেচ করা হচ্ছে
        const res = await fetch("http://localhost:5000/api/notice?limit=4"); 
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        console.log("fech to no ", data)
        setNotices(data);
      } catch (error) {
        console.error("Notice fetch error:", error);
        setNotices([
          {
            _id: "6a9c5a39db5bae0d0a4962d0",
            title: "President of dates",
            description: "amar sorkar mara gese ai jonno chuti prodan kora holo all",
            targetAudience: "All",
            category: "Holiday",
            date: "2026-09-05"
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  const upcomingEvents = [
    {
      id: 1,
      title: "বার্ষিক ক্রীড়া প্রতিযোগিতা ও পুরস্কার বিতরণী ২০২৬",
      date: "২৫ মার্চ, ২০২৬",
      time: "সকাল ০৯:০০ টা",
      location: "বিদ্যালয় খেলার মাঠ",
    },
    {
      id: 2,
      title: "বিজ্ঞান মেলা ও প্রজেক্ট প্রদর্শনী",
      date: "১০ এপ্রিল, ২০২৬",
      time: "সকাল ১০:০০ টা",
      location: "সেন্ট্রাল অডিটোরিয়াম",
    },
  ];

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Notice Board (Max 4 Notices) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-base-content/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <FiBell size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-base-content">নোটিশ বোর্ড</h2>
                  <p className="text-xs text-base-content/60">সাম্প্রতিক দাপ্তরিক নোটিশ ও বার্তা</p>
                </div>
              </div>

              {/* Top Link to Full Notice Page */}
              <Link
                href="/notices"
                className="btn btn-ghost btn-sm text-primary hover:bg-primary/10 gap-1 rounded-lg"
              >
                সব নোটিশ <FiArrowRight size={16} />
              </Link>
            </div>

            {/* Notice Cards List */}
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-24 w-full bg-base-200/50 animate-pulse rounded-2xl" />
                ))
              ) : notices.length > 0 ? (
                notices.map((notice) => (
                  <div
                    key={notice._id}
                    className="group p-5 rounded-2xl border border-base-content/10 bg-base-100/40 backdrop-blur-sm hover:border-primary/30 hover:shadow-md transition-all duration-300 flex items-start gap-4"
                  >
                    {/* Date Box */}
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-base-200/60 border border-base-content/5 min-w-[70px] text-center">
                      <span className="text-xs font-bold text-primary uppercase">
                        {notice.date ? new Date(notice.date).toLocaleString('default', { month: 'short' }) : 'SEP'}
                      </span>
                      <span className="text-xl font-extrabold text-base-content">
                        {notice.date ? new Date(notice.date).getDate() : '05'}
                      </span>
                    </div>

                    {/* Notice Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-primary badge-outline text-[10px] py-1 px-2 font-medium">
                          {notice.category || "General"}
                        </span>
                        <span className="text-xs text-base-content/50 flex items-center gap-1">
                          <FiCalendar size={12} />
                          {notice.date}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors line-clamp-1">
                        {notice.title}
                      </h3>
                      
                      <p className="text-xs text-base-content/70 line-clamp-2 mt-1 leading-relaxed">
                        {notice.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-base-content/60 border border-dashed border-base-content/20 rounded-2xl">
                  বর্তমানে কোনো নোটিশ নেই।
                </div>
              )}
            </div>

            {/* Bottom Full Notice Page Button */}
            {notices.length > 0 && (
              <div className="pt-2 text-center">
                <Link
                  href="/notice"
                  className="btn btn-outline btn-primary btn-block sm:w-auto rounded-xl gap-2 shadow-sm"
                >
                  সকল নোটিশ দেখুন <FiArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Upcoming Events */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-base-content/10">
              <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                <FiCalendar size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-base-content">আসন্ন ইভেন্টসমূহ</h2>
                <p className="text-xs text-base-content/60">ক্যাম্পাসের বিশেষ কার্যক্রম</p>
              </div>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-5 rounded-2xl border border-base-content/10 bg-base-100/40 backdrop-blur-sm hover:shadow-md transition-all space-y-3"
                >
                  <span className="badge badge-secondary badge-sm text-[11px] font-medium">
                    Upcoming Event
                  </span>

                  <h3 className="font-bold text-base text-base-content leading-snug">
                    {event.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-base-content/70 pt-2 border-t border-base-content/5">
                    <div className="flex items-center gap-1.5">
                      <FiClock className="text-secondary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiMapPin className="text-secondary" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}