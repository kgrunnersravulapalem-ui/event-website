import type { CSSProperties } from 'react';
import { edition2 } from '@/lib/edition2';

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const PLACES = ['1st', '2nd', '3rd'];
const rowTotal = (amounts: number[]) => amounts.reduce((a, b) => a + b, 0);

/**
 * Edition 02 prize money as one table per race, as printed on the prize
 * poster, so it can be read on a phone and found by search. Amounts in ₹.
 */
export default function PrizeTables() {
    return (
        <div className="prize-races">
            {edition2.prizes.map((race) => {
                const cat = edition2.categories.find((c) => c.id === race.id);
                if (!cat) return null;
                const headingId = `prizes-${race.id}`;
                return (
                    <section key={race.id} className="prize-race" aria-labelledby={headingId} style={{ '--cat': cat.color } as CSSProperties}>
                        <header className="prize-race-head">
                            <h3 id={headingId}>
                                <b className="disp">{cat.distance}K</b>
                                <span>{cat.name}</span>
                            </h3>
                            <div className="prize-race-pool">
                                <strong className="disp">{rupees(race.pool)}</strong>
                            </div>
                        </header>
                        {race.note && <p className="prize-race-note">{race.note}</p>}
                        <div className="prize-table-wrap">
                            <table className="prize-table">
                                <thead>
                                    <tr>
                                        <th scope="col" className="mono unit">In ₹</th>
                                        {PLACES.map((place, i) => (
                                            <th key={place} scope="col" className="amt">
                                                <span className={`medal m${i + 1}`} aria-label={place}>{i + 1}</span>
                                            </th>
                                        ))}
                                        <th scope="col" className="amt mono total">Total</th>
                                    </tr>
                                </thead>
                                {/* One body per category: its name and who qualifies, then the two rows. */}
                                {race.groups.map((g) => {
                                    const [menLabel, womenLabel] = g.labels ?? ['Male', 'Female'];
                                    return (
                                        <tbody key={g.group}>
                                            <tr className="grp">
                                                <th scope="rowgroup" colSpan={5}>
                                                    {g.group}
                                                    {g.criteria && <small>{g.criteria}</small>}
                                                </th>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="who">{menLabel}</th>
                                                {g.men.map((a, i) => <td key={i} className="amt">{a}</td>)}
                                                <td className="amt total">{rowTotal(g.men)}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="who">{womenLabel}</th>
                                                {g.women.map((a, i) => <td key={i} className="amt">{a}</td>)}
                                                <td className="amt total">{rowTotal(g.women)}</td>
                                            </tr>
                                        </tbody>
                                    );
                                })}
                            </table>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
