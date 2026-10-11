// Animated side-view runner (CSS-driven gait — see .rsvg rules in app/kg.css).
// The tee takes the parent's text colour (currentColor).

const SHOE = 'M45.5 113 L58 115.5 Q62.5 118.5 58.5 121 L46 120.5 Q43.5 117 45.5 113 Z';

function Leg({ back = false }: { back?: boolean }) {
    return (
        <g className={back ? 'leg back' : 'leg'}>
            <line className="th" x1="50" y1="66" x2="50" y2="92" />
            <line className="thsh" x1="50" y1="66" x2="50" y2="77" />
            <g className="shin">
                <line className="sh" x1="50" y1="92" x2="50" y2="115" />
                <g className="foot">
                    <path className="shoe" d={SHOE} />
                </g>
            </g>
        </g>
    );
}

function Arm({ back = false }: { back?: boolean }) {
    return (
        <g className={back ? 'arm back' : 'arm'}>
            <line className="ua" x1="55" y1="37" x2="55" y2="56" />
            <line className="sleeve" x1="55" y1="37" x2="55" y2="45" />
            <g className="fore">
                <line className="fa" x1="55" y1="56" x2="55" y2="70" />
                <circle className="fist" cx="55" cy="72" r="3.8" />
            </g>
        </g>
    );
}

export default function RunnerFigure() {
    return (
        <svg className="rsvg" viewBox="0 0 100 130" aria-hidden="true" focusable="false">
            <ellipse className="shadow" cx="50" cy="125" rx="22" ry="3.5" />
            <g className="bob">
                <Arm back />
                <Leg back />
                <path className="tee" d="M46 31 Q55 27.5 64 33 L58.5 67 L43.5 65 Z" />
                <path className="shorts" d="M43 63 L58.6 65 L58 74 L43.5 72 Z" />
                <line className="neck" x1="58" y1="27" x2="57" y2="32" />
                <path className="pony" d="M53 14 Q43 15 41 26 Q47 22 53 20 Z" />
                <circle className="head" cx="61" cy="19" r="8.6" />
                <path className="hair" d="M52.5 18 Q53 9.5 61.5 10 Q69 10.5 69.6 17 Q64 13.5 57 15.5 Q55 17 52.5 18 Z" />
                <Leg />
                <Arm />
            </g>
        </svg>
    );
}
