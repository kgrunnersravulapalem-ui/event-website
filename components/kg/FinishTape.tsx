'use client';
import { useScrollProgress } from './useScrollProgress';

// The finish tape breaks when the scroll runner reaches the bottom of the page.
export default function FinishTape() {
    const { p } = useScrollProgress();
    const text = 'FINISH · FINISH · FINISH · FINISH · FINISH · FINISH ·';
    return (
        <div className={`tape${p > 0.96 ? ' broken' : ''}`} aria-hidden="true">
            <div className="tape-half l"><span>{text}</span></div>
            <div className="tape-half r"><span>{text}</span></div>
        </div>
    );
}
