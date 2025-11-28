export default function StudentHeroSection() {
    return (
        <>
            <section className="bg-primary flex w-screen overflow-hidden px-6 text-white sm:px-8 md:px-12 lg:px-16 xl:px-20">
                {/* Left Content Section */}
                <div className="flex flex-1 flex-col items-start justify-center pt-14 md:pt-0">
                    {/* Main Heading */}
                    <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                        Your <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Child's</span> First Guide to
                        the <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Digital World</span>
                    </h1>

                    {/* Subheading */}
                    <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl md:text-2xl">
                        The playful, safe way for kids ages 6–8 to build foundational digital literacy through interactive adventures.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                        <button className="group hover:shadow-3xl relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
                            <span className="relative z-10">Start Your Adventure</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                        </button>
                        <button className="group rounded-full border-2 border-white/80 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-blue-600 hover:shadow-xl active:scale-95">
                            Explore Demo
                        </button>
                    </div>
                </div>

                {/* Right Image Section */}
                <div className="relative hidden lg:flex lg:w-[35%] xl:w-[40%]">
                    <div className="relative h-full w-full overflow-hidden">
                        <img src="/images/login-image2.png" alt="Digital learning adventure" className="h-full w-full" />
                    </div>
                </div>
            </section>
            <img src="/images/hero-footer.png" alt="DigiFriends" className="h-20 w-full lg:h-32" />
        </>
    );
}
