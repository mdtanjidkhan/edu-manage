import AlumniWallOfFame from "@/components/AlumniWallOfFame";
import CampusLife from "@/components/CampusLife";
import ContactSection from "@/components/ContactSection";
import HeadmasterMessage from "@/components/HeadmasterMessage";
import HeroSection from "@/components/HeroSection";
import NoticeBoard from "@/components/NoticeBoard";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import AboutUs from "./about/page";
import Features from "./features/page";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <HeroSection></HeroSection>
      <div id="about" className="w-full scroll-mt-20">
        <AboutUs></AboutUs>
      </div>
      <CampusLife></CampusLife>
      <WhyChooseUs></WhyChooseUs>
      <div id="features" className="w-full scroll-mt-20">
        <Features></Features>
      </div>
      <NoticeBoard></NoticeBoard>
      <HeadmasterMessage></HeadmasterMessage>
      <Testimonials></Testimonials>
      <AlumniWallOfFame></AlumniWallOfFame>
      {/* <ContactSection></ContactSection> */}
      <div id="contact" className="w-full scroll-mt-20">
        <ContactSection></ContactSection>
      </div>
    </div>
  );
}
