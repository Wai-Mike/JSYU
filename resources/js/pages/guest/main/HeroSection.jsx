export default function StudentHeroSection() {
    return (
        <section className="flex w-screen overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white shadow-2xl">
            <div className="flex-1">
                <h1 className="mb-6 text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">Your Child's First Guide to the Digital World</h1>
                <p className="mb-8 text-xl font-light md:text-2xl">The playful, safe way for kids ages 6–8 to build foundational digital literacy.</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <button className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:scale-105 hover:shadow-xl">
                        Start Your Adventure
                    </button>
                    <button className="rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-blue-600">
                        Explore Demo
                    </button>
                </div>
            </div>
            <div className="relative lg:w-[40%]">
                <img src="/images/login-image2.png" className="absolute inset-0 z-0 h-full w-full object-cover" />
            </div>
        </section>
    );
}
