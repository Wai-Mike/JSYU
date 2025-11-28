import GuestLayout from '../../../layouts/GuestLayout';
import CTASection from './CTASection.jsx';
import StudentDigiFriendSection from './DigiFriendSection.jsx';
import StudentHeroSection from './HeroSection.jsx';
import LearningJourneySection from './LearningJourneySection.jsx';
import StudentProcessSection from './ProcessSection.jsx';

export default function index() {
    return (
        <GuestLayout>
            <div className="mx-auto max-w-7xl">
                <StudentHeroSection />
                <StudentProcessSection />
                <StudentDigiFriendSection />
                <LearningJourneySection />
                <CTASection />
            </div>
        </GuestLayout>
    );
}
