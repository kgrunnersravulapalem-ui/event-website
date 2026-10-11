import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import RunnerFigure from "@/components/kg/RunnerFigure";
import { eventConfig } from "@/lib/eventConfig";
import { getWinnersByCategoryAndGender } from "@/lib/winnersData";

export const metadata: Metadata = {
  title: "Editions",
  description:
    "Every edition of the Konaseema Run. Relive Edition 01 (08 Feb 2026, Ravulapalem) and get ready for Edition 02, the Konaseema Half Marathon on 31 January 2027.",
};

const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" style={{ fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }} />
  </svg>
);

const ED1_CATEGORIES = [
  { distance: "10K", desc: "A challenging middle-distance race for runners who like to dig deep." },
  { distance: "5K", desc: "Fast, scenic and exhilarating. The classic distance." },
  { distance: "3K", desc: "Short and sweet, for beginners and speedsters alike." },
];

const ED1_PARTNERS: { name: string; logo?: string }[] = [
  { name: "Aditya University", logo: "/images/sponsor_logos/aditya_logo.png" },
  { name: "Teja Free Food" },
  { name: "Victory Bazars", logo: "/images/sponsor_logos/victory_logo.jpeg" },
  { name: "Manihamsa Power Projects", logo: "/images/sponsor_logos/manihamsa_logo.jpeg" },
  { name: "Recovery", logo: "/images/sponsor_logos/recovery_logo.png" },
  { name: "Reddy Drugs", logo: "/images/sponsor_logos/reddy_drugs.jpeg" },
  { name: "Haldi Plus", logo: "/images/sponsor_logos/haldi_plus_logo.png" },
  { name: "Creative", logo: "/images/sponsor_logos/creative_logo.jpeg" },
];

const RESULT_LABELS: Record<string, string> = {
  "10K>18Y": "10K · Above 18",
  "10K<18Y": "10K · Below 18",
  "5K>18Y": "5K · Above 18",
  "5K<18Y": "5K · Below 18",
  "3K<13Y": "3K Kids · Below 13",
};

export default function EditionsPage() {
  const champions = getWinnersByCategoryAndGender().map((c) => {
    const win = c.positions.find((p) => p.position === "WINNER");
    return { key: c.baseCategory, label: RESULT_LABELS[c.baseCategory] ?? c.baseCategory, male: win?.male[0], female: win?.female[0] };
  });
  return (
    <main className="kg kg-main">

      {/* TIMELINE */}
      <header className="sec" style={{ paddingBottom: 72 }}>
        <div className="wrap">
          <div className="split mono">Editions</div>
          <h1 className="disp" style={{ fontSize: "clamp(44px,7vw,112px)", marginTop: 22 }}>
            Every edition,<br /><span style={{ color: "#F4B400" }}>every finish line.</span>
          </h1>

          <div aria-hidden="true">
            <div className="tl-line">
              <div className="tl-fill" />
              <span className="tl-node" style={{ left: 0 }} />
              <span className="tl-node n2" style={{ left: "100%" }} />
              <div className="tl-runner">
                <div className="run" style={{ "--s": ".6s" } as React.CSSProperties}>
                  <RunnerFigure />
                </div>
              </div>
            </div>
          </div>
          <div className="tl-labels">
            <div>
              <span className="mono" style={{ color: "rgba(247,242,228,.62)" }}>08 Feb 2026</span>
              <strong>Edition 01</strong>
              <span style={{ color: "rgba(247,242,228,.78)" }}>Konaseema Run · 10K, 5K, 3K</span>
            </div>
            <div style={{ textAlign: "right", alignItems: "flex-end" }}>
              <span className="mono" style={{ color: "#F4B400" }}>31 Jan 2027</span>
              <strong>Edition 02</strong>
              <span style={{ color: "rgba(247,242,228,.78)" }}>Half Marathon · 21.1K, 10K, 5K, 3K</span>
            </div>
          </div>

          <Link className="next" href="/">
            <div className="stack" style={{ gap: 10 }}>
              <span className="mono">Up next · 2nd Edition</span>
              <span className="disp" style={{ fontSize: "clamp(32px,3.8vw,54px)" }}>Konaseema Half Marathon</span>
            </div>
            <div className="stack" style={{ gap: 14 }}>
              <p className="lede" style={{ color: "#2A2400" }}>
                31 January 2027. The first-ever half marathon in Konaseema District. Timed 5K, 10K and 21.1K, and a non-timed 3K.
              </p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700 }}>Go to Edition 02 <Arrow /></span>
            </div>
          </Link>
        </div>
      </header>

      {/* EDITION 01 */}
      <section className="sec ed-head" id="edition-01">
        <div className="wrap">
          <div className="split mono">Edition 01 · 08 February 2026</div>
          <h2 className="disp rv" style={{ fontSize: "clamp(44px,6.4vw,104px)", marginTop: 22 }}>Konaseema<br />Run 2026</h2>
          <div className="two" style={{ marginTop: 36, alignItems: "end" }}>
            <div className="stack" style={{ gap: 10 }}>
              <p className="disp" style={{ fontSize: "clamp(24px,2.6vw,36px)", color: "#F4B400" }}>Run Green · Breathe Clean</p>
              <p className="te" style={{ margin: 0, fontSize: "clamp(22px,2.4vw,30px)", fontWeight: 700, lineHeight: 1.4 }}>మన ఆరోగ్యం, మన ఊరు, మన బాధ్యత</p>
              <p className="mono" style={{ margin: 0, color: "rgba(247,242,228,.66)" }}>Our health · Our village · Our responsibility</p>
            </div>
            <p className="lede" style={{ color: "rgba(247,242,228,.84)" }}>
              More than a race: a celebration of health, community and the human spirit, organised by running enthusiasts for running
              enthusiasts and powered by the Konaseema Godavari Runners Association, Ravulapalem. Thank you for the overwhelming response!
            </p>
          </div>
          <div className="facts">
            <div className="fact"><span className="mono">Race day</span><strong>08 February 2026</strong></div>
            <div className="fact"><span className="mono">Flag-off</span><strong>{eventConfig.venue.time}</strong></div>
            <div className="fact"><span className="mono">Venue</span><strong>{eventConfig.location}</strong></div>
            <div className="fact"><span className="mono">Entry</span><strong>₹{eventConfig.registration.entryFee} · all categories</strong></div>
          </div>
        </div>
      </section>

      <section className="sec light">
        <div className="wrap two">
          <div className="rv stack" style={{ gap: 22 }}>
            <div className="split mono">Edition 01 · Categories</div>
            <h2 className="disp" style={{ fontSize: "clamp(38px,4.4vw,68px)" }}>Three distances,<br />one morning.</h2>
            <div className="catrows">
              {ED1_CATEGORIES.map((c) => (
                <div key={c.distance} className="catrow">
                  <b>{c.distance}</b>
                  <p>{c.desc}</p>
                  <strong className="mono" style={{ fontSize: 14 }}>₹{eventConfig.registration.entryFee}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="rv stack" style={{ gap: 18 }}>
            <a className="btn btn-ink" href={eventConfig.youtubeVideoUrl} target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start" }}>
              Watch the Edition 01 film
            </a>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link className="btn btn-ink" href="/editions/2026/results">Edition 01 results</Link>
              <Link className="btn btn-ink" href="/prizes">Prizes</Link>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="sec" id="results">
        <div className="wrap">
          <div className="row-end">
            <div className="stack" style={{ gap: 22 }}>
              <div className="split mono">Edition 01 · Results</div>
              <h2 className="disp" style={{ fontSize: "clamp(38px,4.4vw,68px)" }}>Category winners.</h2>
            </div>
            <Link className="btn btn-gold" href="/editions/2026/results">Full results &amp; podiums</Link>
          </div>
          <div className="pod-head mono" aria-hidden="true" style={{ marginTop: 36 }}><span>Category</span><span>Male winner</span><span>Female winner</span></div>
          <div className="podium" style={{ marginTop: 10 }}>
            {champions.map((c) => (
              <div key={c.key} className="pod-row">
                <div className="pod-pos"><span className="medal m1" aria-hidden="true">1</span>{c.label}</div>
                {[{ w: c.male, g: "Male" }, { w: c.female, g: "Female" }].map(({ w, g }) =>
                  w && w.name.trim() ? (
                    <div key={g} className="pod-cell">
                      <span className="mono gender">{g}</span>
                      <div className="who"><strong>{w.name}</strong><span className="mono">#{w.bibNo}</span></div>
                    </div>
                  ) : (
                    <div key={g} className="pod-cell empty mono">—</div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTOS */}
      <section className="sec" id="gallery" style={{ background: "#142412" }}>
        <div className="wrap">
          <div className="row-end">
            <div className="stack" style={{ gap: 22 }}>
              <div className="split mono">Edition 01 · Gallery</div>
              <h2 className="disp" style={{ fontSize: "clamp(38px,4.4vw,68px)" }}>Moments from<br />race morning.</h2>
            </div>
            <Link className="btn btn-ghost" href="/gallery">Full gallery</Link>
          </div>
          <div className="photos">
            <div className="ph rv"><Image src="/images/run_1.jpeg" alt="Runners at Konaseema Run 2026" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
            <div className="ph rv"><Image src="/images/run_2.jpeg" alt="Konaseema Run 2026 race morning" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="sec light">
        <div className="wrap">
          <div className="split mono">Edition 01 · Partners</div>
          <h3 className="disp" style={{ fontSize: "clamp(30px,3.2vw,44px)", marginTop: 18 }}>They ran with us.</h3>
          <div className="logos">
            {ED1_PARTNERS.map((p) => (
              <div key={p.name} className="logo-tile">
                {p.logo ? <Image src={p.logo} alt={p.name} width={200} height={100} /> : <span>{p.name}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="wrap row-end" style={{ alignItems: "center" }}>
          <span className="disp" style={{ fontSize: "clamp(28px,3.2vw,46px)" }}>
            Next stop: <span style={{ color: "#F4B400" }}>31 Jan 2027</span>
          </span>
          <Link className="btn btn-gold" href="/">Go to Edition 02</Link>
        </div>
      </section>
    </main>
  );
}
