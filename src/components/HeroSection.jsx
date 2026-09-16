"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { FiArrowRight, FiBookOpen, FiAward, FiUsers, FiCheckCircle } from "react-icons/fi";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSection() {
  const campusImages = [
    {
      url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop",
      title: "Main Campus Building",
    },
    {
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      title: "Digital Classroom Activities",
    },
    {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
      title: "Science & Computer Lab",
    },
    {
      url: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?q=80&w=1200&auto=format&fit=crop",
      title: "Annual Sports Grounds",
    },
  ];

  return (
    <section className="relative bg-transparent py-10 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20">
              <FiCheckCircle className="text-primary" />
              <span>স্মার্ট শিক্ষার আধুনিক অঙ্গীকার</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-base-content leading-tight">
              Empowering Minds, <br className="hidden sm:block" />
              <span className="text-primary">Shaping The Future</span>
            </h1>

            <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              আধুনিক মানসম্মত শিক্ষা, ডিজিটাল ক্লাসরুম এবং অভিজ্ঞ শিক্ষক মণ্ডলীর তত্ত্বাবধানে শিক্ষার্থীদের নৈতিক ও মেধা বিকাশের সেরা বিশ্বস্ত প্রতিষ্ঠান।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/admission"
                className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20 gap-2"
              >
                ভর্তির আবেদন করুন <FiArrowRight size={20} />
              </Link>
              <Link
                href="/about"
                className="btn btn-outline btn-md sm:btn-lg w-full sm:w-auto rounded-xl gap-2 border-base-300"
              >
                ক্যাম্পাস দেখুন
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-base-200 mt-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary font-bold">
                  <FiUsers size={18} />
                  <span className="text-2xl sm:text-3xl font-black">১২০০+</span>
                </div>
                <p className="text-xs text-base-content/60 font-medium mt-1">শিক্ষার্থী</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-secondary font-bold">
                  <FiBookOpen size={18} />
                  <span className="text-2xl sm:text-3xl font-black">৫০+</span>
                </div>
                <p className="text-xs text-base-content/60 font-medium mt-1">অভিজ্ঞ শিক্ষক</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-accent font-bold">
                  <FiAward size={18} />
                  <span className="text-2xl sm:text-3xl font-black">৯৯%</span>
                </div>
                <p className="text-xs text-base-content/60 font-medium mt-1">সাফল্যের হার</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Swiper Slider */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-base-200 group">
              <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect={"fade"}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                navigation={true}
                loop={true}
                className="w-full h-[320px] sm:h-[400px] lg:h-[440px] custom-hero-swiper"
              >
                {campusImages.map((img, index) => (
                  <SwiperSlide key={index} className="relative w-full h-full">
                    <div className="relative w-full h-full">
                      <Image
                        src={img.url}
                        alt={img.title}
                        fill
                        priority={index === 0}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                        <span className="text-white text-sm sm:text-base font-medium bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10">
                          {img.title}
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}