import AssociationLayout from '../../../layouts/AssociationLayout';
import AboutSection from './AboutSection.jsx';
import ChairmanSection from './ChairmanSection.jsx';
import CountiesMarqueeSection from './CountiesMarqueeSection.jsx';
import CTASection from './CTASection.jsx';
import HeroSection from './HeroSection.jsx';
import ImageRibbonSection from './ImageRibbonSection.jsx';
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
            <CountiesMarqueeSection />
            <ProgramsPreviewSection />
            <OpportunitiesSection />
            <TestimonialsSection />
            <ImageRibbonSection />
            <NewsPreviewSection />
            <ChairmanSection />
            <CTASection />
        </AssociationLayout>
    );
}
