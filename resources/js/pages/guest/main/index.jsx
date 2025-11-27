import GuestLayout from '../../../layouts/GuestLayout';

export default function index() {
    return (
        <GuestLayout>
            <div className="mx-auto max-w-7xl">
                <div className="py-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">Welcome to DigiPhabet</h1>
                    <p className="text-xl text-gray-600">Your learning platform</p>
                </div>
            </div>
        </GuestLayout>
    );
}
