'use client';
import RunnerFigure from './RunnerFigure';
import { useScrollProgress } from './useScrollProgress';

const TOTAL_KM = 21.1;
const TICKS = [3, 5, 10, 15];

// A runner that travels down a 21.1 km course on the right edge as the page scrolls.
export default function ScrollRunner({ kitColor = '#F4B400' }: { kitColor?: string }) {
    const { p, dir, moving } = useScrollProgress();
    const mode = `${moving ? 'sprint' : 'jog'}${dir < 0 ? ' up' : ''}`;

    return (
        <div className="kg-rail" aria-hidden="true">
            <div className="rail-cap top mono">Start</div>
            <div className="rail-track">
                <div className="rail-fill" style={{ height: `${(p * 100).toFixed(2)}%` }} />
                {TICKS.map((k) => (
                    <div key={k} className="tick" style={{ top: `${((k / TOTAL_KM) * 100).toFixed(1)}%` }}>
                        <span>{k}K</span>
                    </div>
                ))}
            </div>
            <div className="rail-cap end mono">21.1K</div>
            <div
                className={`rail-runner run ${mode}`}
                style={{ top: `calc(var(--rt0) + (100% - var(--rspan)) * ${p.toFixed(4)})`, color: kitColor }}
            >
                <div className="rail-km mono">{(p * TOTAL_KM).toFixed(1)} km</div>
                <span className="dust" />
                <span className="dust b" />
                <RunnerFigure />
            </div>
        </div>
    );
}
