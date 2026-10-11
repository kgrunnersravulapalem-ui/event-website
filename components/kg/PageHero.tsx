import RunnerFigure from './RunnerFigure';

// Dark page header used by the inner pages, with a runner jogging along the bottom edge.
export default function PageHero({
    label,
    title,
    lede,
    children,
}: {
    label: string;
    title: React.ReactNode;
    lede?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <header className="page-hero">
            <div className="wrap">
                <div className="split mono">{label}</div>
                <h1 className="disp">{title}</h1>
                {lede && <p className="lede">{lede}</p>}
                {children}
            </div>
            <div className="ground" aria-hidden="true" />
            <div className="hero-runner" aria-hidden="true">
                <div className="run">
                    <RunnerFigure />
                </div>
            </div>
        </header>
    );
}
