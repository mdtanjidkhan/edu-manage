"use client";

import Image from "next/image";
import { FiCheckCircle, FiMail, FiMessageSquare } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";

export default function HeadmasterMessage() {
  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container Box */}
        <div className="relative rounded-3xl border border-base-content/10 bg-base-100/40 backdrop-blur-md p-6 sm:p-10 lg:p-12 shadow-sm hover:border-primary/20 transition-all duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Principal Image & Card Info */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-2 border-primary/30 p-1.5 bg-base-100 shadow-xl">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"
                    alt="Headmaster Photo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 240px"
                  />
                </div>
              </div>

              {/* Identity Details */}
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-base-content">
                  প্রফেসর মোঃ রফিকুল ইসলাম
                </h3>
                <p className="text-sm font-medium text-primary mt-0.5">
                  প্রধান শিক্ষক ও অধ্যক্ষ
                </p>
                <p className="text-xs text-base-content/60 mt-1">
                  এম.এস.সি (গণিত), বি.এড (১ম শ্রেণী)
                </p>
              </div>

              {/* Quick Contact Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/60 border border-base-content/5 text-xs text-base-content/80">
                <FiMail className="text-primary" />
                <span>principal@school.edu.bd</span>
              </div>
            </div>

            {/* Right Column: Message & Vision */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Top Tag & Quote Icon */}
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">
                  Headmaster's Message
                </span>
                <FaQuoteLeft className="text-primary/20 w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-snug">
                "সুশিক্ষাই আলোকিত আগামী ও সুনাগরিক গড়ার মূল চাবিকাঠি"
              </h2>

              {/* Message Content */}
              <div className="space-y-3 text-sm sm:text-base text-base-content/80 leading-relaxed font-normal">
                <p>
                  প্রিয় অভিভাবক ও শিক্ষার্থীবৃন্দ, আমাদের প্রতিষ্ঠানে আপনাদের আন্তরিক স্বাগত জানাই। বিংশ শতাব্দীর চ্যালেঞ্জ মোকাবিলায় শুধু পুঁথিগত বিদ্যাই যথেষ্ট নয়, শিক্ষার্থীদের নৈতিক শিক্ষা, তথ্যপ্রযুক্তি এবং মানসিক বিকাশের সমন্বয় ঘটানোই আমাদের মূল লক্ষ্য।
                </p>
                <p>
                  আমরা বিশ্বাস করি প্রতিটি শিশুর মধ্যেই সুপ্ত প্রতিভা রয়েছে। আমাদের অভিজ্ঞ শিক্ষক ও আধুনিক শিক্ষা পরিবেশের মাধ্যমে আমরা শিক্ষার্থীদের আন্তর্জাতিক মানের শিক্ষায় শিক্ষিত করে গড়ে তুলতে প্রতিশ্রুতিবদ্ধ।
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-base-content/90">
                  <FiCheckCircle className="text-success flex-shrink-0" />
                  <span>নৈতিক ও সুশৃঙ্খল পরিবেশ</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-base-content/90">
                  <FiCheckCircle className="text-success flex-shrink-0" />
                  <span>আধুনিক তথ্যপ্রযুক্তিভিত্তিক শিক্ষা</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-base-content/90">
                  <FiCheckCircle className="text-success flex-shrink-0" />
                  <span>সহ-শিক্ষা কার্যক্রমে বিশেষ গুরুত্ব</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-base-content/90">
                  <FiCheckCircle className="text-success flex-shrink-0" />
                  <span>ব্যক্তিগত তদারকি ও কাউন্সিলিং</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}