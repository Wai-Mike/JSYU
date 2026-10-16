export default function StudentHeroSection() {
    return (
        <section className="relative w-screen overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-center text-white">
            <div className="relative z-10">
                <h1 className="mb-6 text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
                    Welcome to Jonglei State Youth Union
                </h1>
                <p className="mb-8 text-xl font-light md:text-2xl">Representation. Peacebuilding. Empowerment. Your voice matters in shaping the future of Jonglei.</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <a href="/programs" className="bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:scale-105">
                        Explore Programs
                    </a>
                    <a href="/#about" className="border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-blue-600">
                        Learn About Us
                    </a>
                </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute inset-0 -z-0 opacity-20">
                <div className="absolute top-10 left-10 h-32 w-32 bg-white"></div>
                <div className="absolute top-20 right-20 h-24 w-24 bg-yellow-300"></div>
                <div className="absolute bottom-10 left-1/3 h-40 w-40 bg-pink-300"></div>
            </div>
        </section>
    );
}
