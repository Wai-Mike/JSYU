import AssociationLayout from '../../../layouts/AssociationLayout';
import AboutSection from './AboutSection.jsx';
import ChairmanSection from './ChairmanSection.jsx';
import CTASection from './CTASection.jsx';
import HeroSection from './HeroSection.jsx';
import ImpactStatsSection from './ImpactStatsSection.jsx';
import NewsPreviewSection from './NewsPreviewSection.jsx';
import OpportunitiesSection from './OpportunitiesSection.jsx';
import ProgramsPreviewSection from './ProgramsPreviewSection.jsx';
import TestimonialsSection from './TestimonialsSection.jsx';

export default function Index() {
    return (
        <AssociationLayout>
            <HeroSection />
            <ImpactStatsSection />
            <AboutSection />
            <ProgramsPreviewSection />
            <OpportunitiesSection />
            <NewsPreviewSection />
            <TestimonialsSection />
            <ChairmanSection />
            <CTASection />
        </AssociationLayout>
    );
}
