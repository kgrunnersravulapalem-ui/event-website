import Link from 'next/link';
import { eventConfig } from '@/lib/eventConfig';
import { edition2 } from '@/lib/edition2';
import PageHero from '@/components/kg/PageHero';
import ImageLightbox from '@/components/kg/ImageLightbox';
import PrizeTables from '@/components/kg/PrizeTables';

// Edition 01 prize structure (Konaseema Run 2026), kept for reference.
// The Edition 02 prize list lives in lib/edition2.ts.
const ED1_PRIZES = [
    {
        id: 'above18',
        title: 'Above 18 years',
        criteria: 'DOB on or before 07/02/2008',
        categories: [
            { name: '10K', male: [5000, 4000, 3000], female: [5000, 4000, 3000] },
            { name: '5K', male: [3000, 2000, 1000], female: [3000, 2000, 1000] },
        ],
    },
    {
        id: 'below18',
        title: 'Below 18 years',
        criteria: 'DOB on or after 08/02/2008',
        categories: [
            { name: '10K', male: [3000, 2500, 2000], female: [3000, 2500, 2000] },
            { name: '5K', male: [2000, 1500, 1000], female: [2000, 1500, 1000] },
        ],
    },
    {
        id: 'below13',
        title: 'Below 13 years (Kids Run)',
        criteria: 'DOB on or after 08/02/2013',
        categories: [{ name: '3K', male: [2000, 1500, 1000], female: [2000, 1500, 1000] }],
    },
];

const NOTES = [
    edition2.prizeProofNote,
    'Prizes are awarded to the top 3 positions in each category.',
    'Age categories are determined by the date of birth criteria.',
    'Winners must present valid ID proof (Aadhar / Voter ID / School ID) for verification.',
    'Prize distribution is conducted at the venue after the race.',
    'The organiser’s decision is final in case of any dispute.',
];

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function Ranks({ label, amounts }: { label: string; amounts: number[] }) {
    return (
        <div>
            <span className="mono">{label}</span>
            {amounts.map((a, i) => (
                <div key={i} className="prize-row">
                    <span className={`medal m${i + 1}`} aria-label={`Position ${i + 1}`}>{i + 1}</span>
                    {rupees(a)}
                </div>
            ))}
        </div>
    );
}

export default function PrizesPage() {
    return (
        <main className="kg kg-main">
            <PageHero
                label="Prizes & benefits"
                title={<>Run for the<br /><span style={{ color: '#F4B400' }}>podium.</span></>}
                lede={`Total prize money, male & female: ${edition2.prizeMoneyLabel} across ${edition2.prizeCount} prizes.`}
            />

            <section className="sec light" style={{ paddingTop: 64 }}>
                <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(56px,7vw,96px)' }}>
                    <div id="prize-list" className="two prize-intro">
                        <div className="stack">
                            <div className="split mono">Edition 02 · Prize list</div>
                            <h2 className="disp h2">{edition2.prizeMoneyLabel}.<br />{edition2.prizeCount} prizes.</h2>
                            <p className="lede">
                                Prizes for 1st, 2nd and 3rd place in every run and age category. Tap the prize list to see it full
                                size.
                            </p>
                            <div className="prize-pools">
                                {edition2.categories.map((c) => {
                                    const race = edition2.prizes.find((r) => r.id === c.id);
                                    return race && (
                                        <a key={c.id} href={`#prizes-${c.id}`} style={{ '--cat': c.color } as React.CSSProperties}>
                                            <span className="mono">{c.distance}K · {c.name}</span>
                                            <strong>{rupees(race.pool)}</strong>
                                        </a>
                                    );
                                })}
                            </div>
                            <div className="cta-row">
                                <a className="btn btn-ink" href={edition2.prizeList} download="Konaseema-Half-Marathon-2027-prize-list.jpg">
                                    Download prize list
                                </a>
                            </div>
                        </div>
                        <div className="prize-poster">
                            <ImageLightbox
                                src={edition2.prizeList}
                                alt="Konaseema Half Marathon 2027 prize list: Rs 2.04 Lakh in total across 21.1K Jawan Run, 10K Kisan Run, 5K Arthur Cotton Run and 3K Fun Run"
                                width={1024}
                                height={1536}
                                downloadName="Konaseema-Half-Marathon-2027-prize-list.jpg"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="sec-head">
                            <div className="split mono">Edition 02 · Prize money by race</div>
                            <h2 className="disp">Top three, every category</h2>
                        </div>
                        <div className="notice prize-proof" role="note">
                            <span className="ic" aria-hidden="true">!</span>
                            <p><strong>Note:</strong> {edition2.prizeProofNote}</p>
                        </div>
                        <PrizeTables />
                    </div>

                    <div>
                        <div className="sec-head">
                            <div className="split mono">Edition 02 · Entry fees</div>
                            <h2 className="disp">Early bird till {edition2.earlyBirdLastDate}</h2>
                        </div>
                        <div className="fee-table" role="table" aria-label="Edition 02 entry fees">
                            <div className="fee-row head mono" role="row">
                                <span role="columnheader">Category</span>
                                <span role="columnheader">Early bird</span>
                                <span role="columnheader">Regular</span>
                            </div>
                            {[...edition2.categories].reverse().map((c) => (
                                <div key={c.id} className="fee-row" role="row" style={{ '--cat': c.color } as React.CSSProperties}>
                                    <span role="cell" className="fee-cat">
                                        <i aria-hidden="true" />
                                        <b>{c.distance}K</b>
                                        <span className="mono">{c.timed ? 'Timed' : 'Non-timed'}</span>
                                    </span>
                                    <span role="cell" className="fee-eb">₹{c.earlyBird}</span>
                                    <span role="cell" className="fee-reg">₹{c.fee}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="two" style={{ alignItems: 'start' }}>
                        <div className="sec-head" style={{ marginBottom: 0 }}>
                            <div className="split mono">Good to know</div>
                            <h2 className="disp">Important notes</h2>
                        </div>
                        <ul className="notes">
                            {NOTES.map((n) => <li key={n}>{n}</li>)}
                        </ul>
                    </div>

                    <div>
                        <div className="sec-head">
                            <div className="split mono">Edition 01 · Participant benefits</div>
                            <h2 className="disp">Every finisher received</h2>
                        </div>
                        <div className="chips">
                            {eventConfig.deliverables.map((d) => (
                                <span key={d} className="chip">{d}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="sec-head">
                            <div className="split mono">Edition 01 · At a glance</div>
                        </div>
                        <div className="stat-grid">
                            <div><span className="mono">Total prize pool</span><strong>{rupees(eventConfig.registration.prizeMoney.total)}</strong></div>
                            <div><span className="mono">Entry fee</span><strong>{rupees(eventConfig.registration.entryFee)}</strong><small>3K, 5K and 10K</small></div>
                            <div><span className="mono">Podium places</span><strong>Top 3</strong><small>Male &amp; female, every category</small></div>
                        </div>
                    </div>

                    <div>
                        <div className="sec-head">
                            <div className="split mono">Edition 01 · Prize money</div>
                            <h2 className="disp">Prize distribution</h2>
                        </div>
                        <div className="age-groups">
                            {ED1_PRIZES.map((g) => (
                                <div key={g.id} className="age-group">
                                    <div className="age-group-head">
                                        <h3>{g.title}</h3>
                                        <span className="mono">{g.criteria}</span>
                                    </div>
                                    <div className="prize-cards">
                                        {g.categories.map((c) => (
                                            <div key={c.name} className="prize-card">
                                                <div className="prize-card-head">
                                                    <b>{c.name}</b>
                                                    <span className="mono">Run</span>
                                                </div>
                                                <div className="prize-split">
                                                    <Ranks label="Male" amounts={c.male} />
                                                    <Ranks label="Female" amounts={c.female} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            <section className="sec" style={{ paddingTop: 72, paddingBottom: 72 }}>
                <div className="wrap row-end" style={{ alignItems: 'center' }}>
                    <span className="disp" style={{ fontSize: 'clamp(28px,3.2vw,46px)' }}>
                        See who made the <span style={{ color: '#F4B400' }}>Edition 01 podium</span>
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        <Link className="btn btn-gold" href="/editions/2026/results">View results</Link>
                        <Link className="btn btn-ghost" href="/">Edition 02</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
