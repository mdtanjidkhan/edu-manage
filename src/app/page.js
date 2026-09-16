import AlumniWallOfFame from "@/components/AlumniWallOfFame";
import CampusLife from "@/components/CampusLife";
import HeadmasterMessage from "@/components/HeadmasterMessage";
import HeroSection from "@/components/HeroSection";
import NoticeBoard from "@/components/NoticeBoard";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <HeroSection></HeroSection>
      <CampusLife></CampusLife>
      <WhyChooseUs></WhyChooseUs>
      <NoticeBoard></NoticeBoard>
      <HeadmasterMessage></HeadmasterMessage>
      <Testimonials></Testimonials>
      <AlumniWallOfFame></AlumniWallOfFame>
    </div>
  );
}
