// "use client";

// import Image from "next/image";
// import { FaUniversity, FaUserCircle, FaGraduationCap, FaQuoteLeft } from "react-icons/fa";

// export default function AlumniWallOfFame() {
//   const alumniList = [
//     {
//       id: 1,
//       name: "তানজিম আহমেদ",
//       passingYear: "২০১৮",
//       university: "বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (BUET)",
//       profession: "সফটওয়্যার প্রকৌশলী",
//       image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
//       quote: "এই স্কুলের শৃঙ্খলাই আমাকে আজকের বুয়েটের জীবনে এবং প্রফেশনাল ক্যারিয়ারে সফল হতে সাহায্য করেছে।",
//     },
//     {
//       id: 2,
//       name: "ডাঃ ফারহানা ইয়াসমিন",
//       passingYear: "২০১৭",
//       university: "ঢাকা মেডিকেল কলেজ (DMC)",
//       profession: "মেডিকেল অফিসার",
//       image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
//       quote: "শিক্ষকদের অবিরাম দিকনির্দেশনা এবং ল্যাবরেটরির সুযোগ-সুবিধা আমার মেডিকেল ভর্তি পরীক্ষার ভিত্তি গড়ে দিয়েছিল।",
//     },
//     {
//       id: 3,
//       name: "রাফসান জামান",
//       passingYear: "২০১৯",
//       university: "ঢাকা বিশ্ববিদ্যালয় (DU)",
//       profession: "রিসার্চ এনালিস্ট",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
//       quote: "সাংস্কৃতিক চর্চা ও পড়ালেখার সুন্দর ভারসাম্য এই স্কুলের প্রধান শক্তি। আমি গর্বিত এই প্রতিষ্ঠানের ছাত্র হিসেবে।",
//     },
//     {
//       id: 4,
//       name: "সাদিয়া আফরিন",
//       passingYear: "২০২০",
//       university: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (JU)",
//       profession: "ডাটা সায়েন্টিস্ট",
//       image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
//       quote: "কম্পিউটার ল্যাবের দিনগুলো এবং শিক্ষকদের উৎসাহই আমাকে প্রযুক্তির প্রতি আগ্রহী করে তুলেছিল।",
//     },
//   ];

//   return (
//     <section className="py-16 bg-transparent">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Section Header */}
//         <div className="text-center max-w-3xl mx-auto mb-12">
//           <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">
//             Wall of Fame
//           </span>
//           <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight mt-1">
//             আমাদের সফল প্রাক্তন শিক্ষার্থীবৃন্দ
//           </h2>
//           <p className="text-base-content/70 mt-3 text-sm sm:text-base leading-relaxed">
//             দেশ ও বিদেশে সুনামের সাথে কাজ করা আমাদের কৃতি শিক্ষার্থীদের সাফল্যগাঁথা।
//           </p>
//         </div>

//         {/* Responsive Carousel Slider */}
//         <div className="carousel carousel-center w-full p-4 space-x-6 rounded-3xl">
//           {alumniList.map((alumni) => (
//             <div
//               key={alumni.id}
//               className="carousel-item w-full sm:w-[350px] lg:w-[380px]"
//             >
//               <div className="w-full rounded-3xl border border-base-content/10 bg-base-100/40 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between">
//                 <div>
//                   {/* Profile Header */}
//                   <div className="flex items-center gap-4 mb-5">
//                     <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/20 shrink-0">
//                       <Image
//                         src={alumni.image}
//                         alt={alumni.name}
//                         fill
//                         className="object-cover"
//                         sizes="64px"
//                       />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3 className="font-bold text-lg text-base-content truncate">
//                         {alumni.name}
//                       </h3>
//                       <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
//                         <FaGraduationCap /> SSC Batch {alumni.passingYear}
//                       </span>
//                     </div>
//                   </div>

//                   {/* University & Profession Info */}
//                   <div className="space-y-2 mb-4 p-3 rounded-xl bg-base-200/50 border border-base-content/5 text-xs sm:text-sm">
//                     <div className="flex items-center gap-2 text-base-content/90 font-medium">
//                       <FaUniversity className="text-secondary shrink-0" />
//                       <span className="truncate">{alumni.university}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-base-content/70">
//                       <FaUserCircle className="text-accent shrink-0" />
//                       <span className="truncate">{alumni.profession}</span>
//                     </div>
//                   </div>

//                   {/* Quote / School Memory */}
//                   <div className="relative pt-2">
//                     <FaQuoteLeft className="text-primary/10 text-xl absolute -top-1 left-0" />
//                     <p className="text-xs sm:text-sm text-base-content/70 italic leading-relaxed pl-6">
//                       {alumni.quote}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Decorative Bottom Bar */}
//                 <div className="w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full mt-6" />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Swipe Instruction Note */}
//         <p className="text-center text-xs text-base-content/50 mt-4">
//           ← ডানে অথবা বামে স্লাইড করে বাকিদের দেখুন →
//         </p>

//       </div>
//     </section>
//   );
// }



"use client";

import Image from "next/image";
import { FaUniversity, FaUserCircle, FaGraduationCap, FaQuoteLeft } from "react-icons/fa";

export default function AlumniWallOfFame() {
  const alumniList = [
    {
      id: 1,
      name: "তানজিম আহমেদ",
      passingYear: "২০১৮",
      university: "বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (BUET)",
      profession: "সফটওয়্যার প্রকৌশলী",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      quote: "এই স্কুলের শৃঙ্খলাই আমাকে আজকের বুয়েটের জীবনে এবং প্রফেশনাল ক্যারিয়ারে সফল হতে সাহায্য করেছে।",
    },
    {
      id: 2,
      name: "ডাঃ ফারহানা ইয়াসমিন",
      passingYear: "২০১৭",
      university: "ঢাকা মেডিকেল কলেজ (DMC)",
      profession: "মেডিকেল অফিসার",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      quote: "শিক্ষকদের অবিরাম দিকনির্দেশনা এবং ল্যাবরেটরির সুযোগ-সুবিধা আমার মেডিকেল ভর্তি পরীক্ষার ভিত্তি গড়ে দিয়েছিল।",
    },
    {
      id: 3,
      name: "রাফসান জামান",
      passingYear: "২০১৯",
      university: "ঢাকা বিশ্ববিদ্যালয় (DU)",
      profession: "রিসার্চ এনালিস্ট",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      quote: "সাংস্কৃতিক চর্চা ও পড়ালেখার সুন্দর ভারসাম্য এই স্কুলের প্রধান শক্তি। আমি গর্বিত এই প্রতিষ্ঠানের ছাত্র হিসেবে।",
    },
    {
      id: 4,
      name: "সাদিয়া আফরিন",
      passingYear: "২০২০",
      university: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (JU)",
      profession: "ডাটা সায়েন্টিস্ট",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
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
                      <span className="truncate">{alumni.profession}</span>
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