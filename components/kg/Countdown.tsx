'use client';
import { useEffect, useState } from 'react';

const pad = (n: number) => (n < 10 ? '0' : '') + n;

export default function Countdown({ targetISO }: { targetISO: string }) {
    const target = new Date(targetISO).getTime();
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        const tick = () => setNow(Date.now());
        const first = setTimeout(tick, 0);
        const id = setInterval(tick, 1000);
        return () => {
            clearTimeout(first);
            clearInterval(id);
        };
    }, []);

    const diff = now == null ? null : Math.max(0, target - now);
    const cells = [
        { label: 'Days', value: diff == null ? '--' : String(Math.floor(diff / 86400000)) },
        { label: 'Hrs', value: diff == null ? '--' : pad(Math.floor(diff / 3600000) % 24) },
        { label: 'Min', value: diff == null ? '--' : pad(Math.floor(diff / 60000) % 60) },
        { label: 'Sec', value: diff == null ? '--' : pad(Math.floor(diff / 1000) % 60) },
    ];

    return (
        <div className="countdown" role="timer" aria-label="Time left until race day">
            {cells.map((c) => (
                <div key={c.label} className="cd">
                    <b>{c.value}</b>
                    <span className="mono">{c.label}</span>
                </div>
            ))}
        </div>
    );
}
