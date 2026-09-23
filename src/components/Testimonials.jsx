"use client";

import Image from "next/image";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "মাহমুদুল হাসান",
      role: "অভিভাবক (দশম শ্রেণী)",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      comment:
        "বিদ্যালয়ের শিক্ষার মান এবং শিক্ষকদের আন্তরিকতা সত্যি প্রশংসনীয়। আমার সন্তানের পড়াশোনার পাশাপাশি নৈতিক চরিত্র গঠনে এটি গুরুত্বপূর্ণ ভূমিকা রাখছে।",
      rating: 5,
      tag: "Parent",
    },
    {
      id: 2,
      name: "নাসরিন আক্তার",
      role: "অভিভাবক (সপ্তম শ্রেণী)",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
      comment:
        "ডিজিটাল ক্লাসরুম ও নিরাপদ পরিবেশের কারণে আমরা অভিভাবকরা একদম নিশ্চিন্ত। বিশেষ করে নিয়ম-শৃঙ্খলা ও নিরাপত্তা ব্যবস্থা অনেক উন্নত।",
      rating: 5,
      tag: "Parent",
    },
    {
      id: 3,
      name: "সাব্বির আহমেদ",
      role: "প্রাক্তন শিক্ষার্থী (ব্যাচ ২০১৮)",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      comment:
        "এই স্কুল থেকে পাওয়া ভিত্তি ও শিক্ষকদের দিকনির্দেশনাই আমাকে আজকের অবস্থানে পৌঁছাতে সাহায্য করেছে। এখান থেকে কাটানো দিনগুলো আজীবন মনে থাকবে।",
      rating: 5,
      tag: "Alumni",
    },
  ];

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight mt-1">
            অভিভাবক ও শিক্ষার্থীদের মতামত
          </h2>
          <p className="text-base-content/70 mt-3 text-sm sm:text-base leading-relaxed">
            আমাদের প্রতিষ্ঠান সম্পর্কে অভিভাবক এবং প্রাক্তন শিক্ষার্থীদের মূল্যায়ন ও অভিজ্ঞতা।
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="group relative p-6 sm:p-8 rounded-3xl border border-base-content/10 bg-base-100/40 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Quote & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <FaQuoteLeft className="text-primary/20 text-2xl group-hover:text-primary/40 transition-colors" />
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm sm:text-base text-base-content/80 leading-relaxed italic">
                  {item.comment}
                </p>
              </div>

              {/* User Identity */}
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-base-content/5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary/20 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base text-base-content truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-base-content/60 truncate mt-0.5">
                    {item.role}
                  </p>
                </div>
                <span className="badge badge-sm badge-outline border-base-content/20 text-[10px] text-base-content/70">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}