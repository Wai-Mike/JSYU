import GuestLayout from '../../../layouts/GuestLayout';
import AboutSection from './AboutSection.jsx';
import CTASection from './CTASection.jsx';
import StudentDigiFriendSection from './DigiFriendSection.jsx';
import FooterSection from './FooterSection.jsx';
import StudentHeroSection from './HeroSection.jsx';
import LearningJourneySection from './LearningJourneySection.jsx';
import StudentProcessSection from './ProcessSection.jsx';

export default function index() {
    return (
        <GuestLayout>
            <div className="mx-auto max-w-7xl">
                <StudentHeroSection />
                <AboutSection />
                <StudentProcessSection />
                <StudentDigiFriendSection />
                <LearningJourneySection />
                <CTASection />
                <FooterSection />
            </div>
        </GuestLayout>
    );
}
