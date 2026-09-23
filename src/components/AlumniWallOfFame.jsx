
"use client";

import Image from "next/image";
import { FaUniversity, FaUserCircle, FaGraduationCap, FaQuoteLeft } from "react-icons/fa";

export default function AlumniWallOfFame() {
  const alumniList = [
    {
      id: 1,
      name: "আব্দুল আল কাইয়ুম",
      passingYear: "2022",
      university: "ZNRF University of Management Sciences (ZUMS)",
      Education: "B.Sc. in Computer Science & Engineering",
      image: "https://i.ibb.co.com/XZTjGXRm/Whats-App-Image-2026-09-16-at-7-49-57-PM.jpg",
      quote: "এই স্কুলে কাটানো দিনগুলো আমাকে শুধু একাডেমিক জ্ঞানই দেয়নি, বরং শৃঙ্খলা, আত্মবিশ্বাস ও দায়িত্ববোধ শিখিয়েছে। আজ আমার উচ্চশিক্ষা ও ক্যারিয়ারের পথে সেই শিক্ষাগুলোই প্রতিনিয়ত কাজে লাগছে।"
,
    },
    {
  id: 2,
  name: "আব্দুল আল হাকিম",
  passingYear: "২০১৭",
  university: "ঢাকা কলেজ (DC)",
  Education: "রাষ্ট্রবিজ্ঞান",
  image: "https://i.ibb.co.com/2YhFL8gB/Whats-App-Image.jpg",
  quote: "এই প্রতিষ্ঠানে কাটানো সময়গুলো আজও আমার মনে বিশেষভাবে স্মরণীয়। এখানকার শিক্ষা, শৃঙ্খলা ও মূল্যবোধ আমার পরবর্তী জীবনে এগিয়ে চলার পথে অনেকটা অনুপ্রেরণা দিয়েছে।",
  },
    {
   id: 3,
   name: "আব্দুর রহিম",
   passingYear: "২০১৯",
   university: "ঢাকা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (DUET)",
   Education: "সিভিল ইঞ্জিনিয়ারিং",
   image: "https://i.ibb.co.com/5XSyGHj2/Abdur-Rohim.jpg",
   quote: "এই প্রতিষ্ঠানের শিক্ষকদের আন্তরিকতা, শৃঙ্খলা ও সুন্দর পরিবেশ আমার শিক্ষাজীবনের ভিত্তি গড়ে দিয়েছে। এখান থেকে পাওয়া শিক্ষা ও মূল্যবোধ আজও আমার পথচলায় অনুপ্রেরণা হয়ে আছে।",
   },

    {
      id: 4,
      name: "সাদিয়া আফরিন",
      passingYear: "2017",
      university: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (JU)",
      Education: "ডাটা সায়েন্টিস্ট",
      image: "https://i.ibb.co.com/ZRtdwZLd/Sarmin-sultana.jpg",
      quote: "কম্পিউটার ল্যাবের দিনগুলো এবং শিক্ষকদের উৎসাহই আমাকে প্রযুক্তির প্রতি আগ্রহী করে তুলেছিল।",
    },
  ];

  return (
    <section className="py-16 bg-transparent w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">
            Wall of Fame
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight mt-1">
            আমাদের সফল প্রাক্তন শিক্ষার্থীবৃন্দ
          </h2>
          <p className="text-base-content/70 mt-2 text-xs sm:text-base leading-relaxed">
            দেশ ও বিদেশে সুনামের সাথে কাজ করা আমাদের কৃতি শিক্ষার্থীদের সাফল্যগাঁথা।
          </p>
        </div>

        {/* Responsive Snap Scroll Container (Carousel Replacement) */}
        <div className="flex w-full overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2 snap-x snap-mandatory scrollbar-none scroll-smooth">
          {alumniList.map((alumni) => (
            <div
              key={alumni.id}
              className="snap-center shrink-0 w-[85vw] sm:w-[350px] lg:w-[380px]"
            >
              <div className="w-full h-full rounded-3xl border border-base-content/10 bg-base-100 p-5 sm:p-6 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between">
                <div>
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-primary/20 shrink-0">
                      <Image
                        src={alumni.image}
                        alt={alumni.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 56px, 64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base sm:text-lg text-base-content truncate">
                        {alumni.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        <FaGraduationCap /> SSC Batch {alumni.passingYear}
                      </span>
                    </div>
                  </div>

                  {/* University & Profession Info */}
                  <div className="space-y-2 mb-4 p-3 rounded-xl bg-base-200/50 border border-base-content/5 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-base-content/90 font-medium">
                      <FaUniversity className="text-secondary shrink-0" />
                      <span className="truncate">{alumni.university}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base-content/70">
                      <FaUserCircle className="text-accent shrink-0" />
                      <span className="truncate">{alumni.Education}</span>
                    </div>
                  </div>

                  {/* Quote / School Memory */}
                  <div className="relative pt-1">
                    <FaQuoteLeft className="text-primary/10 text-lg absolute -top-1 left-0" />
                    <p className="text-xs sm:text-sm text-base-content/70 italic leading-relaxed pl-5">
                      {alumni.quote}
                    </p>
                  </div>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full mt-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Swipe Instruction Note */}
        <p className="text-center text-xs text-base-content/50 mt-2">
          ← ডানে অথবা বামে স্লাইড করে বাকিদের দেখুন →
        </p>

      </div>
    </section>
  );
}