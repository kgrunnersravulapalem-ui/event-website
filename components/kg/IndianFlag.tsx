// The national flag of India, drawn to the Flag Code proportions:
// 3:2 ratio, three equal bands (India saffron, white, India green) and the
// navy-blue Ashoka Chakra with 24 spokes centred on the white band.

const SAFFRON = '#FF9933';
const WHITE = '#FFFFFF';
const GREEN = '#138808';
const NAVY = '#000080';

const SPOKES = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);

export function AshokaChakra({ size = 24, className }: { size?: number; className?: string }) {
    return (
        <svg className={className} width={size} height={size} viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
            <circle r="92" fill="none" stroke={NAVY} strokeWidth="10" />
            <circle r="16" fill={NAVY} />
            {SPOKES.map((a) => (
                <g key={a} transform={`rotate(${a})`}>
                    {/* tapered spoke */}
                    <path d="M0 -16 L4 -52 L0 -87 L-4 -52 Z" fill={NAVY} />
                    {/* small dot on the rim between spokes */}
                    <circle cy="-87" r="5" fill={NAVY} transform="rotate(7.5)" />
                </g>
            ))}
        </svg>
    );
}

export default function IndianFlag({ className, width = 36 }: { className?: string; width?: number }) {
    return (
        <svg
            className={className}
            width={width}
            height={(width * 2) / 3}
            viewBox="0 0 900 600"
            role="img"
            aria-label="Flag of India"
        >
            <rect width="900" height="200" fill={SAFFRON} />
            <rect y="200" width="900" height="200" fill={WHITE} />
            <rect y="400" width="900" height="200" fill={GREEN} />
            <g transform="translate(450 300) scale(.97)">
                <circle r="92" fill="none" stroke={NAVY} strokeWidth="10" />
                <circle r="16" fill={NAVY} />
                {SPOKES.map((a) => (
                    <g key={a} transform={`rotate(${a})`}>
                        <path d="M0 -16 L4 -52 L0 -87 L-4 -52 Z" fill={NAVY} />
                        <circle cy="-87" r="5" fill={NAVY} transform="rotate(7.5)" />
                    </g>
                ))}
            </g>
        </svg>
    );
}

// Tricolour band (used at the top of pages and on the Jai Jawan Jai Kisan card)
// with the Ashoka Chakra centred on the white band.
export function FlagStripe({ chakra = 22 }: { chakra?: number }) {
    return (
        <div className="tri" aria-hidden="true">
            <span className="s" />
            <span className="w" />
            <span className="g" />
            <span className="tri-chakra"><AshokaChakra size={chakra} /></span>
        </div>
    );
}
