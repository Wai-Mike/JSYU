import { MapPin } from 'lucide-react';

/** The nine canonical counties — keep in sync with App\Services\Geography\JongleiGeography. */
const counties = ['Akobo', 'Ayod', 'Bor', 'Duk', 'Fangak', 'Nyirol', 'Canal/Pigi', 'Twic East', 'Uror'];

function CountyRow({ outlined = false, ariaHidden = false }) {
    return (
        <ul className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
            {counties.map((county, i) => (
                <li key={county} className="flex items-center">
                    <span
                        className={`font-display px-6 text-3xl font-extrabold tracking-tight whitespace-nowrap uppercase transition-colors duration-300 sm:px-8 sm:text-5xl lg:text-6xl ${
                            (i % 2 === 0) !== outlined ? 'hover:text-jsyu-accent text-white' : 'county-outline'
                        }`}
                    >
                        {county}
                    </span>
                    <span className="bg-jsyu-accent h-3 w-3 shrink-0 rotate-45 sm:h-4 sm:w-4" />
                </li>
            ))}
        </ul>
    );
}

export default function CountiesMarqueeSection() {
    return (
        <section className="bg-jsyu-green-deep relative overflow-hidden py-12 lg:py-16" aria-label="Counties of Jonglei State">
            <div className="mx-auto mb-8 flex max-w-7xl flex-col items-center gap-2 px-4 text-center sm:px-6 lg:px-8">
                <span className="text-jsyu-accent inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase">
                    <MapPin className="h-4 w-4" />
                    One union · nine counties
                </span>
                <p className="text-sm font-medium text-white/70">Representing young people in every corner of Jonglei State</p>
            </div>

            <div className="marquee-mask group space-y-4 sm:space-y-6">
                <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
                    <CountyRow />
                    <CountyRow ariaHidden />
                </div>
                <div className="animate-marquee-reverse flex w-max group-hover:[animation-play-state:paused]">
                    <CountyRow outlined ariaHidden />
                    <CountyRow outlined ariaHidden />
                </div>
            </div>
        </section>
    );
}
