
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiChevronRight,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaCode,
  FaTimes,
} from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      <footer className="border-t border-base-content/10 bg-base-100/40 backdrop-blur-md text-base-content transition-colors">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            
            {/* Column 1: School Info & About */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content font-extrabold text-xl shadow-md">
                  S
                </div>
                <span className="text-xl font-bold tracking-tight text-base-content">
                 Mesra High School
                </span>
              </div>

              <p className="text-sm text-base-content/70 leading-relaxed max-w-sm">
                গুণগত শিক্ষা ও সুশৃঙ্খল পরিবেশের মাধ্যমে ভবিষ্যৎ সুনাগরিক গড়ে তোলাই আমাদের প্রধান লক্ষ্য ও প্রতিশ্রুতি।
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-base-200/80 hover:bg-primary hover:text-primary-content border border-base-content/10 flex items-center justify-center transition-all duration-300"
                >
                  <FaFacebookF size={15} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-base-200/80 hover:bg-red-600 hover:text-white border border-base-content/10 flex items-center justify-center transition-all duration-300"
                >
                  <FaYoutube size={15} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-base-200/80 hover:bg-blue-600 hover:text-white border border-base-content/10 flex items-center justify-center transition-all duration-300"
                >
                  <FaLinkedinIn size={15} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-primary">
                জরুরি লিংক
              </h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { name: "হোম", path: "/" },
                  { name: "আমাদের সম্পর্কে", path: "/about" },
                  { name: "নোটিশ বোর্ড", path: "/notices" },
                  { name: "শিক্ষক ও কর্মকর্তা", path: "/teachers" },
                  { name: "একাডেমিক ক্যালেন্ডার", path: "/academic-calendar" },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="flex items-center gap-1.5 text-base-content/70 hover:text-primary transition-colors"
                    >
                      <FiChevronRight size={14} className="text-primary/70" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Academic Portals */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-primary">
                ই-সেবাসমূহ
              </h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { name: "অনলাইন ভর্তি", path: "/admission" },
                  { name: "পরীক্ষার ফলাফল", path: "/results" },
                  { name: "স্টুডেন্ট পোর্টাল", path: "/login" },
                  { name: "অনলাইন পেমেন্ট", path: "/payments" },
                  { name: "ডিজিটাল লাইব্রেরি", path: "/library" },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="flex items-center gap-1.5 text-base-content/70 hover:text-primary transition-colors"
                    >
                      <FiChevronRight size={14} className="text-primary/70" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-primary">
                যোগাযোগ
              </h3>
              <ul className="space-y-3 text-sm text-base-content/70">
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-primary mt-1 shrink-0" size={16} />
                  <span> সিরাজগঞ্জ, বাংলাদেশ</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiPhone className="text-primary shrink-0" size={16} />
                  <span> 01831562894</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiMail className="text-primary shrink-0" size={16} />
                  <span>info@school.edu.bd</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiClock className="text-primary mt-1 shrink-0" size={16} />
                  <span>শনি - বৃহস্পতি: সকাল ৯:০০ - বিকাল ৪:০০</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright, Developer Modal Trigger & Terms */}
          <div className="mt-12 pt-6 border-t border-base-content/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/60">
            <p>© ২০২৬ Mesra High School। সর্বস্বত্ব সংরক্ষিত।</p>
            
            {/* Developer Modal Trigger Link */}
            <p className="flex items-center gap-1">
              Developed by{" "}
              <button
                type="button"
                onClick={() => document.getElementById("developer_modal").showModal()}
                className="font-semibold text-primary hover:underline focus:outline-none cursor-pointer"
              >
                Md Tanjid Khan
              </button>
            </p>

            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                প্রাইভেসি পলিসি
              </Link>
              <span>•</span>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">
                শর্তাবলী
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Developer Modal Popup */}
      <dialog id="developer_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative border border-base-content/10 bg-base-100/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl max-w-lg">
          
          {/* Close Button */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/60 hover:text-primary">
              <FaTimes size={16} />
            </button>
          </form>

          {/* Modal Inner Content */}
          <div className="flex flex-col items-center text-center space-y-4 pt-2">
            
            {/* Profile Image */}
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary/30 p-1 bg-base-100 shadow-xl">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                
                <img
  src="https://i.ibb.co.com/DPdM1Lk9/banner-png.jpg"
  alt="Md Tanjid Khan"
  className="w-full h-full object-cover"
/>
              </div>
            </div>

            {/* Identity & Title */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary tracking-wider uppercase mb-1">
                <FaCode /> Full-Stack Web Developer
              </span>
              <h3 className="text-2xl font-extrabold text-base-content">
                Md Tanjid Khan
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Lead Architect of this Web Platform
              </p>
            </div>

            {/* Bio / Description */}
            <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed max-w-md">
              প্রতিষ্ঠানের ডায়নামিক ওয়েবসাইট, নোটিশ সিস্টেম ও সকল রেসপন্সিভ UI কম্পোনেন্ট Next.js, Tailwind CSS এবং Node.js/MongoDB দিয়ে অত্যন্ত দক্ষতার সাথে তৈরি করা হয়েছে।
            </p>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap justify-center gap-1.5 py-1">
              {["Next.js", "React", "Tailwind CSS", "DaisyUI", "Node.js", "MongoDB"].map((tech) => (
                <span
                  key={tech}
                  className="badge badge-sm bg-base-200 text-base-content/80 border-base-content/5 py-2 px-3 font-medium text-[11px]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-3 pt-3 w-full border-t border-base-content/10">
              <a
                href="https://github.com/mdtanjidkhan"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline btn-primary rounded-xl gap-2 flex-1"
              >
                <FaGithub size={16} /> GitHub Profile
              </a>
              <a
                href="https://www.linkedin.com/in/md-tanjid-khan"
                target="_blank"
                rel="noreferrer"
                className="btn btn-square btn-sm btn-ghost border border-base-content/10 rounded-xl"
                title="LinkedIn"
              >
                <FaLinkedin size={16} />
              </a>
              <a
                href="https://tanjidkhan.dev"
                target="_blank"
                rel="noreferrer"
                className="btn btn-square btn-sm btn-ghost border border-base-content/10 rounded-xl"
                title="Portfolio"
              >
                <FaGlobe size={16} />
              </a>
            </div>

          </div>
        </div>

        {/* Backdrop Click to Close */}
        <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-xs">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}