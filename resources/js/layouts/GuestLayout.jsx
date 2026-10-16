import Footer from '../components/Footer';
import GuestNavbar from '../components/navbars/GuestNavbar';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-white">
            <GuestNavbar />
            <main className="pt-[6.5rem] sm:pt-[7.25rem]">{children}</main>
            <Footer />
        </div>
    );
}
