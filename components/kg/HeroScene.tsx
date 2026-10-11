import RunnerFigure from './RunnerFigure';

const PALMS: [number, number][] = [
    [50, 1.02], [150, 0.74], [470, 0.9], [560, 0.62], [820, 1.06], [1010, 0.8], [1100, 0.6],
    [1250, 1.02], [1350, 0.74], [1670, 0.9], [1760, 0.62], [2020, 1.06], [2210, 0.8], [2300, 0.6],
];
const JET = 'M0 12 L22 9 L34 0 L39 0 L33 9 L52 10 Q60 12 52 14 L33 15 L39 24 L34 24 L22 15 Z';
const PACK = [
    { pos: 'r1', pony: true },
    { pos: 'r2', pony: false },
    { pos: 'r3', pony: true },
    { pos: 'r4', pony: false },
];

function Paddy({ side }: { side: 'lf' | 'rt' }) {
    return (
        <div className={`paddy ${side}`}>
            <svg viewBox="0 0 160 200">
                <path className="leaf" d="M44 200 Q30 150 8 124" />
                {side === 'lf' && <path className="leaf" d="M96 200 Q120 150 150 132" />}
                <g className="stalk a"><path className="stem" d="M40 200 Q42 120 66 44" /><path className="grain" d="M54 92 Q60 64 66 44 Q74 60 84 72" /></g>
                <g className="stalk b"><path className="stem" d="M70 200 Q72 110 96 30" /><path className="grain" d="M84 80 Q90 50 96 30 Q106 46 116 58" /></g>
                {side === 'lf' && <g className="stalk c"><path className="stem" d="M100 200 Q104 130 126 64" /><path className="grain" d="M114 108 Q120 82 126 64 Q134 78 142 90" /></g>}
                <path className="leaf" d={side === 'lf' ? 'M70 200 Q62 140 40 100' : 'M96 200 Q120 150 150 132'} />
            </svg>
        </div>
    );
}

// Sunrise over the Godavari: jets with tricolour trails, bridge, palms, paddy and a pack of runners.
export default function HeroScene() {
    return (
        <div className="scene" aria-hidden="true">
            <div className="sky" />
            <div className="sun" />
            <div className="jets">
                {['j1', 'j2', 'j3'].map((j) => (
                    <div key={j} className={`jet ${j}`}>
                        <span className="trail" />
                        <svg viewBox="0 0 60 24"><path d={JET} /></svg>
                    </div>
                ))}
            </div>
            <div className="bridge">
                <svg viewBox="0 0 1440 140" preserveAspectRatio="xMaxYMax slice">
                    <defs>
                        <pattern id="kgTruss" width="120" height="70" patternUnits="userSpaceOnUse" x="0" y="20">
                            <path className="truss" d="M2 70 Q60 4 118 70 M22 44 L22 70 M41 27 L41 70 M60 21 L60 70 M79 27 L79 70 M98 44 L98 70 M22 44 L41 70 M41 27 L60 70 M60 21 L79 70 M79 27 L98 70" />
                        </pattern>
                        <pattern id="kgPier" width="120" height="40" patternUnits="userSpaceOnUse" x="0" y="98">
                            <rect className="pier" x="0" y="0" width="11" height="40" />
                        </pattern>
                    </defs>
                    <rect x="360" y="20" width="1080" height="70" fill="url(#kgTruss)" />
                    <rect className="deck" x="300" y="88" width="1140" height="10" />
                    <rect x="360" y="98" width="1080" height="40" fill="url(#kgPier)" />
                </svg>
            </div>
            <div className="river"><div className="shim a" /><div className="shim b" /></div>
            <div className="palms">
                <svg viewBox="0 0 2400 200" preserveAspectRatio="xMinYMax meet">
                    <defs>
                        <g id="kgpalm">
                            <path className="trunk" d="M0 0 C -4 -50, 8 -100, 18 -140" />
                            <path className="frond" d="M18 -140 C 0 -150, -22 -146, -38 -126" />
                            <path className="frond" d="M18 -140 C 36 -152, 60 -148, 74 -128" />
                            <path className="frond" d="M18 -140 C 6 -162, -14 -170, -30 -166" />
                            <path className="frond" d="M18 -140 C 30 -164, 50 -172, 66 -166" />
                            <path className="frond" d="M18 -140 C 16 -158, 20 -172, 28 -184" />
                            <path className="frond" d="M18 -140 C 4 -146, -10 -138, -18 -116" />
                            <path className="frond" d="M18 -140 C 34 -144, 48 -136, 54 -114" />
                        </g>
                    </defs>
                    {PALMS.map(([x, s]) => (
                        <use key={x} href="#kgpalm" transform={`translate(${x} 200) scale(${s})`} />
                    ))}
                </svg>
            </div>
            <div className="road"><div className="kerb" /><div className="lane-dash" /></div>
            <div className="pack">
                {PACK.map((r) => (
                    <div key={r.pos} className={`pr ${r.pos}`}>
                        <div className={`run${r.pony ? ' pony-on' : ''}`}>
                            <RunnerFigure />
                        </div>
                    </div>
                ))}
            </div>
            <Paddy side="lf" />
            <Paddy side="rt" />
        </div>
    );
}
