export default function LearningJourneySection() {
    return (
        <section className="py-12">
            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">Learning Journey</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {/* Magical Tech Tree */}
                <div className="group rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center transition-all hover:border-green-500 hover:shadow-lg">
                    <div className="mb-4 text-5xl">🌳</div>
                    <h3 className="text-lg font-bold text-gray-900">Magical Tech Tree</h3>
                </div>

                {/* Digital ABCs */}
                <div className="group rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 text-center transition-all hover:border-blue-500 hover:shadow-lg">
                    <div className="mb-4 text-5xl">🔤</div>
                    <h3 className="text-lg font-bold text-gray-900">Digital ABCs</h3>
                </div>

                {/* Inside Computers */}
                <div className="group rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 p-6 text-center transition-all hover:border-purple-500 hover:shadow-lg">
                    <div className="mb-4 text-5xl">💻</div>
                    <h3 className="text-lg font-bold text-gray-900">Inside Computers</h3>
                </div>

                {/* Digital Superstars */}
                <div className="group rounded-xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 text-center transition-all hover:border-yellow-500 hover:shadow-lg">
                    <div className="mb-4 text-5xl">⭐</div>
                    <h3 className="text-lg font-bold text-gray-900">Digital Superstars</h3>
                </div>

                {/* Mini Makers */}
                <div className="group rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 p-6 text-center transition-all hover:border-pink-500 hover:shadow-lg">
                    <div className="mb-4 text-5xl">🤖</div>
                    <h3 className="text-lg font-bold text-gray-900">Mini Makers</h3>
                </div>
            </div>
        </section>
    );
}
