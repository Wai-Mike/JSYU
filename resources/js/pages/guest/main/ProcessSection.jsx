import { BookOpen, Brain, Laptop } from 'lucide-react';

export default function StudentProcessSection() {
    return (
        <section className="py-12">
            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
                {/* Get the Book */}
                <div className="group rounded-xl border-2 border-gray-200 bg-white p-8 text-center transition-all hover:border-blue-500 hover:shadow-xl">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-blue-100 p-6">
                            <BookOpen className="h-12 w-12 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">📖 Get the Book</h3>
                    <p className="text-gray-600">The tactile, screen-free adventure with stickers and stories.</p>
                </div>

                {/* Play Online */}
                <div className="group rounded-xl border-2 border-gray-200 bg-white p-8 text-center transition-all hover:border-purple-500 hover:shadow-xl">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-purple-100 p-6">
                            <Laptop className="h-12 w-12 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">💻 Play Online</h3>
                    <p className="text-gray-600">The interactive digital playground that brings characters to life.</p>
                </div>

                {/* Learn & Grow */}
                <div className="group rounded-xl border-2 border-gray-200 bg-white p-8 text-center transition-all hover:border-pink-500 hover:shadow-xl">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-pink-100 p-6">
                            <Brain className="h-12 w-12 text-pink-600" />
                        </div>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">🧠 Learn & Grow</h3>
                    <p className="text-gray-600">Watch confidence soar as they master the digital world.</p>
                </div>
            </div>
        </section>
    );
}
