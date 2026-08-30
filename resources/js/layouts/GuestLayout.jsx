import Footer from '../components/Footer';
import GuestNavbar from '../components/navbars/GuestNavbar';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-white">
            <GuestNavbar />
            <main className="pt-16 lg:pt-[4.5rem]">{children}</main>
            <Footer />
        </div>
    );
}
