import Link from 'next/link';
import { Metadata } from 'next';
import { getWinnersByCategoryAndGender, type GenderSeparatedWinners, type Winner } from '@/lib/winnersData';
import PageHero from '@/components/kg/PageHero';

export const metadata: Metadata = {
    title: 'Edition 01 Results',
    description: 'Official podium finishers of Konaseema Run 2026 (Edition 01), Ravulapalem — 10K, 5K and 3K Kids Run.',
};

const RACES = [
    {
        distance: '10K',
        title: '10K Run',
        groups: [
            { key: '10K>18Y', label: 'Above 18 years' },
            { key: '10K<18Y', label: 'Below 18 years' },
        ],
    },
    {
        distance: '5K',
        title: '5K Run',
        groups: [
            { key: '5K>18Y', label: 'Above 18 years' },
            { key: '5K<18Y', label: 'Below 18 years' },
        ],
    },
    {
        distance: '3K',
        title: '3K Kids Run',
        groups: [{ key: '3K<13Y', label: 'Below 13 years' }],
    },
];

const POSITION_LABEL: Record<string, string> = {
    WINNER: 'Winner',
    '1st RUNNER UP': '1st runner-up',
    '2nd RUNNER UP': '2nd runner-up',
};
const POSITION_RANK: Record<string, number> = { WINNER: 1, '1st RUNNER UP': 2, '2nd RUNNER UP': 3 };

function WinnerCell({ winners, gender }: { winners: Winner[]; gender: string }) {
    const valid = winners.filter((w) => w.name && w.name.trim());
    if (valid.length === 0) {
        return <div className="pod-cell empty mono">—</div>;
    }
    return (
        <div className="pod-cell">
            <span className="mono gender">{gender}</span>
            {valid.map((w) => (
                <div key={w.bibNo} className="who">
                    <strong>{w.name}</strong>
                    <span className="mono">#{w.bibNo}{w.school ? ` · ${w.school}` : ''}</span>
                </div>
            ))}
        </div>
    );
}

function AgeGroup({ label, data }: { label: string; data?: GenderSeparatedWinners }) {
    if (!data || data.positions.length === 0) return null;
    return (
        <div className="res-age">
            <h3 className="mono">{label}</h3>
            <div className="pod-head mono" aria-hidden="true"><span>Position</span><span>Male</span><span>Female</span></div>
            <div className="podium">
                {data.positions.map((p) => {
                    const rank = POSITION_RANK[p.position] ?? 3;
                    return (
                        <div key={p.position} className="pod-row">
                            <div className="pod-pos">
                                <span className={`medal m${rank}`} aria-hidden="true">{rank}</span>
                                {POSITION_LABEL[p.position] ?? p.position}
                            </div>
                            <WinnerCell winners={p.male} gender="Male" />
                            <WinnerCell winners={p.female} gender="Female" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ResultsPage() {
    const byCategory = new Map(getWinnersByCategoryAndGender().map((c) => [c.baseCategory, c]));

    return (
        <main className="kg kg-main">
            <PageHero
                label="Editions · Edition 01 · 08 Feb 2026"
                title={<>Konaseema Run 2026<br /><span style={{ color: '#F4B400' }}>results.</span></>}
                lede="The official podium finishers from our first edition in Ravulapalem. Congratulations to every runner who crossed the line."
            >
                <nav className="res-nav" aria-label="Jump to race">
                    <Link className="btn btn-gold" href="/editions#edition-01">← Edition 01</Link>
                    {RACES.map((r) => (
                        <a key={r.distance} className="btn btn-ghost" href={`#race-${r.distance.toLowerCase()}`}>{r.title}</a>
                    ))}
                </nav>
            </PageHero>

            {RACES.map((race) => (
                <section key={race.distance} id={`race-${race.distance.toLowerCase()}`} className="res-race">
                    <div className="wrap">
                        <div className="res-race-head">
                            <div className="disp">{race.distance}</div>
                            <span className="mono" style={{ color: 'rgba(247,242,228,.7)' }}>{race.title} · Podium</span>
                        </div>
                        {race.groups.map((g) => (
                            <AgeGroup key={g.key} label={g.label} data={byCategory.get(g.key)} />
                        ))}
                    </div>
                </section>
            ))}

            <section className="sec finish" style={{ paddingTop: 72, paddingBottom: 72 }}>
                <div className="wrap row-end" style={{ alignItems: 'center' }}>
                    <span className="disp" style={{ fontSize: 'clamp(30px,3.6vw,52px)' }}>Your turn: 21.1K on 31 Jan 2027</span>
                    <Link className="btn btn-ink" href="/">Go to Edition 02</Link>
                </div>
            </section>
        </main>
    );
}
