import StudentLayout from '../../../layouts/StudentLayout';
import CTASection from './CTASection.jsx';
import StudentDigiFriendSection from './DigiFriendSection.jsx';
import StudentHeroSection from './HeroSection.jsx';
import LearningJourneySection from './LearningJourneySection.jsx';
import StudentProcessSection from './ProcessSection.jsx';

export default function StudentDashboard() {
    return (
        <StudentLayout>
            <div className="space-y-20">
                {/* Hero Section */}
                <StudentHeroSection />

                {/* How It Works Section */}
                <StudentProcessSection />

                {/* Meet the DigiFriends */}
                <StudentDigiFriendSection />

                {/* Learning Journey */}
                <LearningJourneySection />

                {/* Final CTA Section */}
                <CTASection />
            </div>
        </StudentLayout>
    );
}
