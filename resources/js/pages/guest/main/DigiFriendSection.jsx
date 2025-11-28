export default function StudentDigiFriendSection() {
    const digiFriends = [
        {
            name: 'Kibo',
            image: '/images/icons/kibo.png',
            backgroundImage: '/images/colors.png',
            description: 'Curious Explorer',
            bgColor: 'bg-blue-200',
        },
        {
            name: 'Nuru',
            image: '/images/icons/nuru.png',
            backgroundImage: '/images/colors.png',
            description: 'Friendly Explainer',
            bgColor: 'bg-purple-200',
        },
        {
            name: 'Piki',
            image: '/images/icons/piki.png',
            backgroundImage: '/images/colors.png',
            description: 'Helpful Robot Friend',
            bgColor: 'bg-pink-200',
        },
    ];

    return (
        <section className="">
            <img src="/images/curve.png" alt="DigiFriends" className="h-20 w-full lg:h-48" />
            <div className="bg-[rgb(61,116,165)] px-8">
                <h2 className="mb-4 text-center text-4xl font-bold text-gray-900">Meet the DigiFriends</h2>
                <p className="mb-12 text-center text-xl text-gray-700">Your child's guides on this learning adventure!</p>
                <div className="grid gap-8 md:grid-cols-3">
                    {digiFriends.map((friend) => (
                        <div key={friend.name} className="rounded-xl p-8 text-center transition-transform hover:scale-105">
                            <div className="relative mb-6 flex justify-center">
                                {/* <img src={friend.backgroundImage} alt="Bubble" className="w- absolute inset-0 -z-0 h-[12rem]" /> */}
                                <div className={`w- z-10 flex h-[16rem] items-center justify-center rounded-full`}>
                                    <img src={friend.image} alt={friend.name} className="h-full w-full object-contain" />
                                </div>
                            </div>
                            <div className="z-10">
                                <h3 className="mb-2 text-2xl font-bold text-white">{friend.name}</h3>
                                <p className="text-lg text-white italic">{friend.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <img src="/images/curve.png" alt="DigiFriends" className="h-20 w-full rotate-180 lg:h-48" />
        </section>
    );
}
