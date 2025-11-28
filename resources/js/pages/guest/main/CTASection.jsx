import { ArrowRight } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-16 text-center text-white">
            <div className="mx-auto max-w-3xl">
                <h2 className="mb-6 text-4xl font-bold">Ready to Begin Your Digital Adventure?</h2>
                <p className="mb-8 text-xl text-indigo-100">
                    Start exploring the digital world with fun, interactive activities designed just for you!
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <button className="group flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-indigo-600 transition-all hover:scale-105 hover:shadow-xl">
                        Explore Free Activities
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button className="rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-indigo-600">
                        Buy the Book & Get Digital Access*
                    </button>
                </div>
                <p className="mt-4 text-sm text-indigo-200">*Digital access included with book purchase</p>
            </div>
        </section>
    );
}
