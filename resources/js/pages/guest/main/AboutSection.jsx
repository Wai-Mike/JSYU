export default function AboutSection() {
    return (
        <section
            className="mx-auto py-14 lg:w-[80%] lg:px-44"
            style={{ backgroundImage: 'url(/images/colors.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="py-20 text-center">
                <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">About Our Platform</h2>
                <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl">
                    We believe every child deserves a strong foundation in digital literacy. Our platform provides a playful, safe, and engaging way
                    for young learners to explore the digital world with confidence and curiosity.
                </p>
            </div>
        </section>
    );
}
