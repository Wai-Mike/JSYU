import AssociationLayout from '../../../layouts/AssociationLayout';
import HeroSection from './HeroSection.jsx';
import AboutSection from './AboutSection.jsx';
import ChairmanSection from './ChairmanSection.jsx';
import ProgramsPreviewSection from './ProgramsPreviewSection.jsx';
import CTASection from './CTASection.jsx';

export default function Index() {
    return (
        <AssociationLayout>
            <HeroSection />
            <AboutSection />
            <ChairmanSection />
            <ProgramsPreviewSection />
            <CTASection />
        </AssociationLayout>
    );
}
