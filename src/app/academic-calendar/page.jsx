"use client";

import { useState } from "react";
import { 
  FiCalendar, 
  FiSearch, 
  FiDownload, 
  FiPrinter, 
  FiClock, 
  FiFilter, 
  FiAward, 
  FiSmile, 
  FiBookOpen, 
  FiCheckCircle,
  FiChevronRight
} from "react-icons/fi";

export default function AcademicCalendarPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Academic Calendar Events Data
  const calendarEvents = [
    {
      id: 1,
      title: "নতুন শিক্ষাবর্ষের ক্লাস শুরু",
      date: "২০২৬-০১-০১",
      month: "January",
      day: "বৃহস্পতিবার",
      category: "Academic",
      description: "সকল ক্লাসের নিয়মিত পাঠদান কার্যক্রম শুরু।"
    },
    {
      id: 2,
      title: "আন্তর্জাতিক মাতৃভাষা দিবস",
      date: "২০২৬-০২-২১",
      month: "February",
      day: "শনিবার",
      category: "Holiday",
      description: "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস উপলক্ষে বিদ্যালয় বন্ধ ও প্রাতঃফেরি।"
    },
    {
      id: 3,
      title: "প্রথম টিউটোরিয়াল পরীক্ষা",
      date: "২০২৬-০৩-১৫",
      month: "March",
      day: "রবিবার",
      category: "Exam",
      description: "৬ষ্ঠ থেকে ১০ম শ্রেণীর ১ম টিউটোরিয়াল মূল্যায়ন পরীক্ষা।"
    },
    {
      id: 4,
      title: "স্বাধীনতা দিবস ও বার্ষিক ক্রীড়া প্রতিযোগিতা",
      date: "২০২৬-০৩-২৬",
      month: "March",
      day: "বৃহস্পতিবার",
      category: "Event",
      description: "স্বাধীনতা দিবস উদযাপন এবং বার্ষিক ক্রীড়া প্রতিযোগিতার পুরস্কার বিতরণী।"
    },
    {
      id: 5,
      title: "পবিত্র ঈদুল ফিতরের ছুটি",
      date: "২০২৬-০৪-০৫",
      month: "April",
      day: "রবিবার",
      category: "Holiday",
      description: "ঈদুল ফিতর উপলক্ষে ১০ দিনের সরকারি ছুটি।"
    },
    {
      id: 6,
      title: "অর্ধ-বার্ষিক পরীক্ষা (Mid-Term Exam)",
      date: "২০২৬-০৬-১০",
      month: "June",
      day: "বুধবার",
      category: "Exam",
      description: "সকল শ্রেণীর অর্ধবার্ষিক পরীক্ষা শুরু।"
    },
    {
      id: 7,
      title: "পবিত্র ঈদুল আযহার ছুটি",
      date: "২০২৬-০৬-২২",
      month: "June",
      day: "সোমবার",
      category: "Holiday",
      description: "ঈদুল আযহা উপলক্ষে বিদ্যালয় বন্ধ থাকবে।"
    },
    {
      id: 8,
      title: "জাতীয় শোক দিবস",
      date: "২০২৬-০৮-১৫",
      month: "August",
      day: "শনিবার",
      category: "Event",
      description: "বঙ্গবন্ধু শেখ মুজিবুর রহমানের শাহাদাত বার্ষিকী পালিত হবে।"
    },
    {
      id: 9,
      title: "দ্বিতীয় টিউটোরিয়াল পরীক্ষা",
      date: "২০২৬-০৯-২০",
      month: "September",
      day: "রবিবার",
      category: "Exam",
      description: "বার্ষিক পরীক্ষার পূর্বপ্রস্তুতি টিউটোরিয়াল মূল্যায়ন।"
    },
    {
      id: 10,
      title: "বার্ষিক পরীক্ষা (Final Examination)",
      date: "২০২৬-১১-২০",
      month: "November",
      day: "শুক্রবার",
      category: "Exam",
      description: "চূড়ান্ত বার্ষিক মূল্যায়ন পরীক্ষা শুরু।"
    },
    {
      id: 11,
      title: "ফলাফল প্রকাশ ও নতুন ভর্তি কার্যক্রম",
      date: "২০২৬-১২-২৫",
      month: "December",
      day: "শুক্রবার",
      category: "Academic",
      description: "বার্ষিক পরীক্ষার ফলাফল প্রকাশ এবং পরবর্তী বর্ষের ভর্তি নির্দেশিকা।"
    }
  ];

  // Filtering Logic
  const filteredEvents = calendarEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.month.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Unique Months for Grouping View
  const months = [...new Set(filteredEvents.map((e) => e.month))];

  // Category Badge Helper
  const getCategoryBadge = (category) => {
    switch (category) {
      case "Exam":
        return <span className="badge badge-error badge-sm text-white font-semibold">পরীক্ষা</span>;
      case "Holiday":
        return <span className="badge badge-info badge-sm text-white font-semibold">ছুটি</span>;
      case "Event":
        return <span className="badge badge-secondary badge-sm text-white font-semibold">ইভেন্ট</span>;
      default:
        return <span className="badge badge-success badge-sm text-white font-semibold">একাডেমিক</span>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-base-200/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300 pb-6">
          <div>
            <span className="badge badge-primary badge-outline text-xs font-bold px-3 py-2 mb-2">
              শিক্ষাবর্ষ {selectedYear}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content flex items-center gap-2.5">
              <FiCalendar className="text-primary" /> একাডেমিক ক্যালেন্ডার
            </h1>
            <p className="text-xs sm:text-sm text-base-content/70 mt-2">
              মেসড়া উচ্চ বিদ্যালয়ের বার্ষিক পাঠদান, পরীক্ষা ও ছুটির সম্পূর্ণ সময়সূচী।
            </p>
          </div>

          {/* Print & Download Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-outline btn-sm rounded-xl gap-2 text-xs font-semibold"
            >
              <FiPrinter size={15} /> প্রিন্ট করুন
            </button>
            <button
              onClick={() => alert("ক্যালেন্ডার ডাউনলোড লিংক তৈরি হচ্ছে...")}
              className="btn btn-primary btn-sm rounded-xl gap-2 text-xs font-semibold text-white shadow-md shadow-primary/20"
            >
              <FiDownload size={15} /> PDF ডাউনলোড
            </button>
          </div>
        </div>

        {/* --- STATS SUMMARY CARDS --- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
              <FiBookOpen size={20} />
            </div>
            <div>
              <p className="text-[11px] text-base-content/60 font-medium">মোট কর্মদিবস</p>
              <p className="text-lg font-bold text-base-content">২২০ দিন</p>
            </div>
          </div>

          <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="p-3 bg-error/10 text-error rounded-xl shrink-0">
              <FiAward size={20} />
            </div>
            <div>
              <p className="text-[11px] text-base-content/60 font-medium">পরীক্ষা সমূহ</p>
              <p className="text-lg font-bold text-error">০৪ টি</p>
            </div>
          </div>

          <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="p-3 bg-info/10 text-info rounded-xl shrink-0">
              <FiClock size={20} />
            </div>
            <div>
              <p className="text-[11px] text-base-content/60 font-medium">সাধারণ ছুটি</p>
              <p className="text-lg font-bold text-info">৬৫ দিন</p>
            </div>
          </div>

          <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
              <FiSmile size={20} />
            </div>
            <div>
              <p className="text-[11px] text-base-content/60 font-medium">বিশেষ ইভেন্ট</p>
              <p className="text-lg font-bold text-secondary">০৮ টি</p>
            </div>
          </div>
        </div>

        {/* --- SEARCH & FILTER CONTROLS --- */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={17} />
            <input
              type="text"
              placeholder="ইভেন্ট বা ছুটির নাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl text-xs focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { label: "সব বিষয়", value: "All" },
              { label: "পরীক্ষা", value: "Exam" },
              { label: "ছুটি", value: "Holiday" },
              { label: "ইভেন্ট", value: "Event" },
              { label: "একাডেমিক", value: "Academic" }
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`btn btn-xs sm:btn-sm rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? "btn-primary text-white"
                    : "btn-ghost text-base-content/70 hover:bg-base-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- MONTH-WISE TIMELINE LIST --- */}
        {filteredEvents.length === 0 ? (
          <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center text-base-content/60 space-y-2">
            <FiCalendar size={36} className="mx-auto text-base-content/30" />
            <p className="font-semibold text-sm">কোনো একাডেমিক ইভেন্ট পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="space-y-6">
            {months.map((month) => {
              const monthEvents = filteredEvents.filter((e) => e.month === month);

              return (
                <div key={month} className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs space-y-4">
                  {/* Month Title Header */}
                  <div className="flex items-center gap-2 border-b border-base-200 pb-2">
                    <FiChevronRight className="text-primary" size={18} />
                    <h2 className="text-lg font-bold text-base-content">{month} {selectedYear}</h2>
                    <span className="text-xs text-base-content/50 font-normal">
                      ({monthEvents.length} টি ইভেন্ট)
                    </span>
                  </div>

                  {/* Events Items List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {monthEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 rounded-xl border border-base-200 bg-base-200/20 hover:border-primary/40 transition-all space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-extrabold text-primary flex items-center gap-1">
                              <FiCalendar size={13} /> {event.date} ({event.day})
                            </span>
                            {getCategoryBadge(event.category)}
                          </div>
                          <h3 className="font-bold text-sm text-base-content">{event.title}</h3>
                          <p className="text-xs text-base-content/70 mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}