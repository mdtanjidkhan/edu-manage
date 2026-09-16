"use client";

import { 
  FiMonitor, 
  FiTrendingUp, 
  FiTruck, 
  FiBookOpen, 
  FiShield, 
  FiAward 
} from "react-icons/fi";

export default function WhyChooseUs() {
  const features = [
    {
      id: 1,
      icon: <FiMonitor className="w-7 h-7 text-primary" />,
      title: "ডিজিটাল স্মার্ট ক্লাসরুম",
      description: "মাল্টিমিডিয়া প্রজেক্টর ও সাউন্ড সিস্টেম সমৃদ্ধ ক্লাসরুম, যা পড়াশোনাকে করে আরও সহজ ও আনন্দদায়ক।",
      badge: "Smart Tech",
    },
    {
      id: 2,
      icon: <FiTrendingUp className="w-7 h-7 text-secondary" />,
      title: "আধুনিক কম্পিউটার ও বিজ্ঞান ল্যাব",
      description: "সর্বশেষ প্রযুক্তির কম্পিউটার এবং উন্নত যন্ত্রপাতি সম্বলিত সাইন্স ল্যাবরেটরি সুবিধা।",
      badge: "Practical",
    },
    {
      id: 3,
      icon: <FiTruck className="w-7 h-7 text-accent" />,
      title: "নিরাপদ পরিবহন সুবিধা",
      description: "শিক্ষার্থীদের যাতায়াতের জন্য নিজস্ব সুশৃঙ্খল এবং নিরাপদ বাস সার্ভিস।",
      badge: "Safe Transit",
    },
    {
      id: 4,
      icon: <FiBookOpen className="w-7 h-7 text-info" />,
      title: "সমৃদ্ধ লাইব্রেরি",
      description: "হাজারো দেশি-বিদেশি বই, টেক্সটবুক এবং ই-বুক সমৃদ্ধ আধুনিক ও নিরিবিলি পাঠাগার।",
      badge: "Resource",
    },
    {
      id: 5,
      icon: <FiShield className="w-7 h-7 text-success" />,
      title: "সিসিটিভি ও নিরাপদ ক্যাম্পাস",
      description: "২৪/৭ সিসিটিভি ক্যামেরা পর্যবেক্ষণ এবং নিজস্ব নিরাপত্তা কর্মীর দ্বারা নিয়ন্ত্রিত ক্যাম্পাস।",
      badge: "24/7 Security",
    },
    {
      id: 6,
      icon: <FiAward className="w-7 h-7 text-warning" />,
      title: "দক্ষ ও অভিজ্ঞ শিক্ষক মণ্ডলী",
      description: "উচ্চশিক্ষিত ও যত্নশীল শিক্ষক দ্বারা প্রতিটি শিক্ষার্থীর আলাদা তদারকি নিশ্চিতকরণ।",
      badge: "Expert Staff",
    },
  ];

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">
            Our Key Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight mt-1">
            কেন আমাদের প্রতিষ্ঠান বেছে নেবেন?
          </h2>
          <p className="text-base-content/70 mt-3 text-sm sm:text-base leading-relaxed">
            আমরা শুধু চিরাচরিত শিক্ষাই দিই না, শিক্ষার্থীদের ভবিষ্যৎ চ্যালেঞ্জ মোকাবিলার উপযোগী আধুনিক ও নৈতিক মানসম্পন্ন নাগরিক হিসেবে গড়ে তুলি।
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className="group relative p-6 sm:p-8 rounded-3xl border border-base-content/10 bg-base-100/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Badge Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-base-200/60 group-hover:bg-primary/10 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-base-200 text-base-content/70 border border-base-content/5">
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Decorative Subtle Line */}
              <div className="w-12 h-1 bg-primary/20 rounded-full mt-6 group-hover:w-full group-hover:bg-primary transition-all duration-500" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}