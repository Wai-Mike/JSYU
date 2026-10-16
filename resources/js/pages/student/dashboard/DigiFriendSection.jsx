export default function StudentDigiFriendSection() {
    return (
        <section className="bg-gradient-to-r from-yellow-50 to-orange-50 px-8 py-16">
            <div className="mx-auto max-w-6xl">
                <h2 className="mb-4 text-center text-4xl font-bold text-gray-900">Meet the DigiFriends</h2>
                <p className="mb-12 text-center text-xl text-gray-700">Your child's guides on this learning adventure!</p>
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Kibo */}
                    <div className="bg-white p-8 text-center transition-transform hover:scale-105">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-32 w-32 items-center justify-center bg-blue-200 text-6xl">🤖</div>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-gray-900">Kibo</h3>
                        <p className="text-lg text-gray-600 italic">Curious Explorer</p>
                    </div>

                    {/* Nuru */}
                    <div className="bg-white p-8 text-center transition-transform hover:scale-105">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-32 w-32 items-center justify-center bg-purple-200 text-6xl">🌟</div>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-gray-900">Nuru</h3>
                        <p className="text-lg text-gray-600 italic">Friendly Explainer</p>
                    </div>

                    {/* Piki */}
                    <div className="bg-white p-8 text-center transition-transform hover:scale-105">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-32 w-32 items-center justify-center bg-pink-200 text-6xl">⚡</div>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-gray-900">Piki</h3>
                        <p className="text-lg text-gray-600 italic">Helpful Robot Friend</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
