'use client';
import { useState } from 'react';

// Illustrative course loops — swap in the official route maps when they are ready.
const ROUTES = [
    { id: 'r3', label: '3K', name: '3K · Non-timed', d: 'M300 330 C 262 304, 262 262, 300 252 S 344 300, 300 330 Z' },
    { id: 'r5', label: '5K', name: '5K · Timed', d: 'M300 330 C 230 322, 210 240, 270 214 S 390 236, 376 290 S 330 336, 300 330 Z' },
    { id: 'r10', label: '10K', name: '10K · Timed', d: 'M300 330 C 170 330, 130 210, 200 160 S 380 120, 440 196 S 420 322, 300 330 Z' },
    { id: 'r21', label: '21.1K', name: '21.1K · Half Marathon', d: 'M300 330 C 80 340, 40 180, 140 110 S 360 50, 500 92 S 580 260, 470 310 S 380 345, 300 330 Z' },
];

export function RouteTabs({ active, onPick }: { active: string; onPick: (id: string) => void }) {
    return (
        <div className="tabs" role="group" aria-label="Choose a distance">
            {ROUTES.map((r) => (
                <button
                    key={r.id}
                    type="button"
                    className={`tab${active === r.id ? ' on' : ''}`}
                    aria-pressed={active === r.id}
                    onClick={() => onPick(r.id)}
                >
                    {r.label}
                </button>
            ))}
        </div>
    );
}

export function RouteCanvas({ active }: { active: string }) {
    const current = ROUTES.find((r) => r.id === active) ?? ROUTES[3];
    const drawOrder = [...ROUTES].reverse();
    return (
        <div className="map">
            <svg viewBox="0 0 600 400" aria-hidden="true">
                <path className="river-m" d="M-20 40 C 120 10, 240 70, 340 40 S 520 0, 640 26" />
                {drawOrder.map((r) => (
                    <path key={`b-${r.id}`} className={`rp${active === r.id ? ' on' : ''}`} d={r.d} />
                ))}
                {drawOrder.map((r) => (
                    <path key={`l-${r.id}`} className={`rl${active === r.id ? ' on' : ''}`} pathLength={1000} d={r.d} />
                ))}
                <circle className="map-pin" cx="300" cy="330" r="13" />
                <circle className="map-pin-in" cx="300" cy="330" r="5" />
            </svg>
            <span className="map-name mono">{current.name}</span>
            <span className="map-label mono">Illustrative · official route maps coming soon</span>
        </div>
    );
}

// Tabs + map wired together; children render between them (venue details).
export default function RouteMap({ children }: { children?: React.ReactNode }) {
    const [active, setActive] = useState('r21');
    return (
        <div className="two" style={{ alignItems: 'start' }}>
            <div className="rv stack">
                <div className="split mono">Route &amp; venue</div>
                <h2 className="disp h2">Ravulapalem,<br />race morning.</h2>
                <RouteTabs active={active} onPick={setActive} />
                {children}
            </div>
            <div className="rv">
                <RouteCanvas active={active} />
            </div>
        </div>
    );
}
