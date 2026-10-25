import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { edition2, TBA } from "@/lib/edition2";
import HeroScene from "@/components/kg/HeroScene";
import ScrollRunner from "@/components/kg/ScrollRunner";
import Countdown from "@/components/kg/Countdown";
import FilmSection from "@/components/kg/FilmSection";
import RouteMap from "@/components/kg/RouteMap";
import FinishTape from "@/components/kg/FinishTape";
import IndianFlag from "@/components/kg/IndianFlag";
import RunnerFigure from "@/components/kg/RunnerFigure";

export const metadata: Metadata = {
  title: "Konaseema Half Marathon 2027 · 2nd Edition | Ravulapalem",
  description:
    "31 January 2027 · Ravulapalem. The first-ever half marathon in Konaseema District — 21.1K, 10K, 5K (timed) and 3K (non-timed). Jai Jawan Jai Kisan.",
};

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" style={{ fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }} />
  </svg>
);

const CAUSE_ICONS: Record<number, React.ReactNode> = {
  0: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22V9" />
      <path d="M12 9c-2.5-.5-4-2.5-4-5 2.5.5 4 2.5 4 5z" /><path d="M12 9c2.5-.5 4-2.5 4-5-2.5.5-4 2.5-4 5z" />
      <path d="M12 14c-2.5-.5-4-2.5-4-5 2.5.5 4 2.5 4 5z" /><path d="M12 14c2.5-.5 4-2.5 4-5-2.5.5-4 2.5-4 5z" />
      <path d="M12 19c-2.5-.5-4-2.5-4-5 2.5.5 4 2.5 4 5z" /><path d="M12 19c2.5-.5 4-2.5 4-5-2.5.5-4 2.5-4 5z" />
    </svg>
  ),
  1: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 8.6a5 5 0 0 0-8.8-3.2 5 5 0 0 0-8.8 3.2c0 5.4 8.8 11 8.8 11s8.8-5.6 8.8-11z" />
      <path d="M3.5 12h4l1.5-3 3 6 1.5-3h7" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" /><path d="M5.3 5.3l13.4 13.4" /><path d="M8 10.5l3-3a2.5 2.5 0 0 1 3.5 3.5l-3 3" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 2h4v3l2 3v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8l2-3z" /><path d="M3 3l18 18" />
    </svg>
  ),
  4: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" /><path d="M8 14.5c1 1.5 2.4 2.3 4 2.3s3-.8 4-2.3" /><path d="M9 9.5h.01M15 9.5h.01" />
    </svg>
  ),
};


export default function Home() {
  const registerHref = edition2.registrationOpen ? edition2.registerHref : "#register";
  const registerLabel = edition2.registrationOpen ? "Register now" : `Registration opens ${edition2.registrationOpensLabel}`;
  // External registration (iFinish) opens in a new tab
  const regLinkProps = registerHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const feeLabel = (fee: number | null) => (fee == null ? TBA : `₹${fee}`);
  const tickerItems = [...edition2.causes, ...edition2.causes];

  return (
    <main className="kg kg-main">
      <ScrollRunner />


      {/* HERO */}
      <header id="top">
        <div className="wrap hero-top">
          <div className="badges">
            <span className="pill gold mono">{edition2.edition}</span>
            <span className="pill line mono">{edition2.tagline}</span>
            <span className="pill line mono">{edition2.prizeMoneyLabel} prize money</span>
          </div>
          <h1 className="disp" style={{ marginTop: 22 }}>
            <span className="h1a">Konaseema</span>
            <span className="h1b">Half Marathon</span>
          </h1>
          <p className="powered mono">Powered by <strong>{edition2.poweredBy}</strong></p>
          <div className="hero-row">
            <div className="date-block">
              <span className="mono" style={{ color: "rgba(247,242,228,.65)" }}>Race day · Ravulapalem</span>
              <strong className="disp">{edition2.raceDateLabel}</strong>
              <span className="jj">
                <IndianFlag className="flag" width={36} />
                Jai Jawan · Jai Kisan
              </span>
            </div>
            <div className="stack" style={{ gap: 10 }}>
              <span className="mono" style={{ color: "rgba(247,242,228,.65)" }}>Countdown to flag-off</span>
              <Countdown targetISO={edition2.flagOffISO} />
            </div>
          </div>
          <div className="cats">
            {[...edition2.categories].reverse().map((c) => (
              <a key={c.id} className={`cat${c.id === "r21" ? " hm" : ""}`} href="#races" style={{ "--cat": c.color } as React.CSSProperties}>
                <i className="cat-dot" aria-hidden="true" />
                <b>{c.distance}K</b>
                <span className="mono">{c.timed ? (c.id === "r21" ? "Timed · Half Marathon" : "Timed") : "Non-timed"}</span>
              </a>
            ))}
          </div>
          <div className="cta-row">
            <Link className="btn btn-gold" href={registerHref} {...regLinkProps}>{registerLabel}</Link>
            <a className="btn btn-ghost" href="#poster">See the race poster</a>
          </div>
        </div>
        <HeroScene />
      </header>

      {/* CAUSES TICKER */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-in">
          {tickerItems.map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </div>

      {/* FILM (autoplays muted, sound on first tap) */}
      <FilmSection videoId={edition2.youtubeId} />

      {/* FIRST HALF MARATHON */}
      <section className="sec" id="first">
        <div className="wrap two">
          <div className="rv stack">
            <div className="split mono">A first for Konaseema</div>
            <h2 className="disp h2">The district’s first half marathon.</h2>
            <p className="lede" style={{ color: "rgba(247,242,228,.84)" }}>
              For its second edition, Konaseema Run steps up to the full 21.1 km, the first half marathon ever held in Konaseema District.
              Timed races over 5K, 10K and 21.1K, and a non-timed 3K for everyone who wants to be part of the morning.
            </p>
            <div className="cta-row" style={{ marginTop: 4 }}>
              <a className="btn btn-gold" href="#races">Explore categories</a>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <div className="disp big211" aria-label="21.1 kilometres">21.1</div>
            <div className="mono" style={{ fontSize: 14, color: "#F4B400", paddingLeft: 6 }}>Kilometres · Half Marathon</div>
          </div>
        </div>
      </section>

      {/* RACE CATEGORIES — colour-coded bibs: 3K pink, 5K blue, 10K red, 21.1K green */}
      <section className="sec" id="races" style={{ background: "#232B1A" }}>
        <div className="wrap">
          <div className="rv row-end">
            <div className="stack">
              <div className="split mono">Race categories</div>
              <h2 className="disp h2">Choose your<br />distance.</h2>
            </div>
            <div className="race-meta">
              <Link className="meta-link" href="/prizes#prize-list">
                <span className="mono">Total prize money · {edition2.prizeCount} prizes</span>
                <strong>{edition2.prizeMoneyLabel}</strong>
                <span className="meta-more">See the prize list <Arrow /></span>
              </Link>
              <div><span className="mono">Early bird ends</span><strong>{edition2.earlyBirdLastDate}</strong></div>
            </div>
          </div>
          <div className="bibs">
            {edition2.categories.map((c) => {
              const feat = c.id === "r21";
              const prizes = edition2.prizes.find((r) => r.id === c.id);
              const fee = (
                <div className="bib-foot">
                  <div className="fee">
                    <span className="mono">Early bird · till {edition2.earlyBirdShort}</span>
                    {c.earlyBird != null ? (
                      <span className="price">
                        <strong>₹{c.earlyBird}</strong>
                        {c.fee != null && <s aria-label={`Regular fee ₹${c.fee}`}>₹{c.fee}</s>}
                      </span>
                    ) : (
                      <strong>{feeLabel(c.fee)}</strong>
                    )}
                    {c.fee != null && <span className="regular">Regular fee ₹{c.fee}</span>}
                  </div>
                  <Link href={registerHref} {...regLinkProps}>Register <Arrow /></Link>
                </div>
              );
              return (
                <article key={c.id} className={`bib rv${feat ? " feat" : ""}`} style={{ "--cat": c.color } as React.CSSProperties}>
                  <span className="pin a" /><span className="pin b" /><span className="pin c" /><span className="pin d" />
                  <div className="bib-band mono">
                    <span>{feat ? "Konaseema Half Marathon" : "Konaseema Run"}<span className="band-ed"> · Ed. 02</span></span>
                    <span>{c.timed ? "Timed" : "Non-timed"}</span>
                  </div>
                  <div className="disp bib-num">{c.distance}<small>K</small></div>
                  <div className="bib-body">
                    <span className="mono bib-race">
                      {c.name}
                      {prizes && <> · <Link href={`/prizes#prizes-${c.id}`}>₹{prizes.pool.toLocaleString("en-IN")} prizes</Link></>}
                    </span>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                    {feat && fee}
                  </div>
                  {!feat && fee}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAUSES — five checkpoints a runner passes through */}
      <section className="sec light" id="causes">
        <div className="wrap">
          <div className="rv row-end">
            <div className="stack">
              <div className="split mono">We run for</div>
              <h2 className="disp h2">Five causes.<br />Five checkpoints.</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "34ch" }}>
              <p className="te" style={{ margin: 0, fontSize: 24, fontWeight: 700, lineHeight: 1.4 }}>మన ఆరోగ్యం, మన ఊరు, మన బాధ్యత</p>
              <p className="mono" style={{ margin: 0, color: "#4D5039" }}>Our health · Our village · Our responsibility</p>
            </div>
          </div>
          <div className="cp-course rv">
            <div className="cp-track" aria-hidden="true">
              <div className="cp-runner run"><RunnerFigure /></div>
            </div>
            <ol className="cp-list">
              {edition2.causes.map((title, i) => (
                <li key={title} className={`cp${i === 0 ? " jj-cp" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                  <span className="cp-mark">{CAUSE_ICONS[i]}</span>
                  <div className="cp-text">
                    <span className="mono cp-no">Checkpoint {String(i + 1).padStart(2, "0")}</span>
                    <h3>{title}</h3>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* POSTER */}
      <section className="sec camo" id="poster">
        <div className="wrap two">
          <div className="rv stack">
            <div className="split mono">Official poster</div>
            <h2 className="disp h2">Wear it.<br />Share it.</h2>
            <p className="lede" style={{ color: "rgba(247,242,228,.84)" }}>
              Jai Jawan, Jai Kisan. Our Edition 02 poster salutes the soldier and the farmer, and the runners of every age who will
              take the start line together on 31 January 2027.
            </p>
            <div className="cta-row" style={{ marginTop: 4 }}>
              <a className="btn btn-gold" href={edition2.poster} download="Konaseema-Half-Marathon-2027-poster.jpg">Download poster</a>
              <Link className="btn btn-ghost" href={registerHref} {...regLinkProps}>Register</Link>
            </div>
          </div>
          <div className="poster-card rv">
            <Image
              src={edition2.poster}
              alt="Konaseema Half Marathon poster: 31 Jan 2027, 2nd Edition, 3K, 5K, 10K and 21.1K, with a soldier, a farmer, runners of all ages, palms and the Godavari bridge at sunrise"
              width={1536}
              height={1024}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ROUTE & VENUE */}
      <section className="sec light" id="route">
        <div className="wrap">
          <RouteMap>
            <div className="meta-list">
              <div><span className="mono">Start &amp; finish</span><strong>{edition2.startVenue ? `${edition2.startVenue}, Ravulapalem` : `Ravulapalem · venue ${TBA.toLowerCase()}`}</strong></div>
              <div><span className="mono">Race day</span><strong>{edition2.raceDateLong}</strong></div>
              <div><span className="mono">Flag-off</span><strong>{edition2.flagOffTime ?? TBA}</strong></div>
              <div><span className="mono">Bib collection</span><strong>{edition2.bibExpo ?? TBA}</strong></div>
            </div>
            <div className="cta-row" style={{ marginTop: 0 }}>
              <a className="btn btn-ink" href={edition2.mapsLink} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </div>
          </RouteMap>
        </div>
      </section>

      {/* EDITIONS TEASER */}
      <section className="sec" id="editions">
        <div className="wrap">
          <div className="split mono rv">Where it began</div>
          <Link className="ed-card rv" href="/editions">
            <div className="stack" style={{ gap: 12 }}>
              <span className="mono" style={{ color: "#F4B400" }}>Edition 01 · 08 Feb 2026</span>
              <span className="disp" style={{ fontSize: "clamp(36px,4.4vw,64px)" }}>Konaseema Run 2026</span>
            </div>
            <div className="stack" style={{ gap: 18 }}>
              <p className="lede" style={{ color: "rgba(247,242,228,.84)" }}>
                Run Green, Breathe Clean. Our first edition brought runners to Ravulapalem over 10K, 5K and 3K. Thank you for the
                overwhelming response that made Edition 02 possible.
              </p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700, color: "#F4B400" }}>
                Relive Edition 01 <span className="go"><Arrow /></span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="sec light" id="partners" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="wrap rv row-end">
          <div className="stack" style={{ gap: 20 }}>
            <div className="split mono">Partners</div>
            <h2 className="disp" style={{ fontSize: "clamp(34px,4vw,56px)" }}>Run with us<br />as a partner.</h2>
            <p className="lede" style={{ color: "#3E4630", maxWidth: "48ch" }}>
              Put your brand at the start line of Konaseema’s first half marathon.
            </p>
          </div>
          <a className="btn btn-ink" href={`mailto:${edition2.contact.email}?subject=Partnering%20with%20Konaseema%20Half%20Marathon%202027`}>
            Become a partner
          </a>
        </div>
      </section>

      {/* FINISH / REGISTER */}
      <section className="sec finish" id="register">
        <div className="wrap">
          <div className="split mono">Finish line · 31 Jan 2027</div>
          <h2 className="disp rv" style={{ marginTop: 24 }}>See you at<br />the start line.</h2>
        </div>
        <FinishTape />
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <p className="lede" style={{ maxWidth: "46ch" }}>
            {edition2.registrationOpen
              ? `Registration for the Konaseema Half Marathon is open. 3K, 5K, 10K and 21.1K, with early-bird prices till ${edition2.earlyBirdLastDate}.`
              : `Registration for the Konaseema Half Marathon opens ${edition2.registrationOpensLabel}. 3K, 5K, 10K and 21.1K. Lace up early.`}
          </p>
          {edition2.registrationOpen ? (
            <Link className="btn btn-ink" href={edition2.registerHref} {...regLinkProps} style={{ minHeight: 56, padding: "0 30px", fontSize: 17 }}>Register now</Link>
          ) : (
            <a className="btn btn-ink" href={`mailto:${edition2.contact.email}?subject=Notify%20me%20when%20registration%20opens`} style={{ minHeight: 56, padding: "0 30px", fontSize: 17 }}>
              Notify me when it opens
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
