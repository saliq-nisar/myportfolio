import ScrollProvider from "@/components/animation/ScrollProvider";
import MotionProvider from "@/components/animation/MotionProvider";
import NavRail from "@/components/navigation/NavRail";
import ProgressBar from "@/components/navigation/ProgressBar";
import PortalHero from "@/components/sections/PortalHero";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import WhyWorkWithMeSection from "@/components/sections/WhyWorkWithMeSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";
import SiteFooter from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <MotionProvider>
      <ScrollProvider />
      <ProgressBar />
      <NavRail />
      <main id="main-content">
        <PortalHero />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <WhyWorkWithMeSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </MotionProvider>
  );
}
