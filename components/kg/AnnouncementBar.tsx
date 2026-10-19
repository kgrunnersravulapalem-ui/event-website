'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { edition2 } from '@/lib/edition2';

// Change this key for a new announcement, so people who closed the last one see it.
const DISMISS_KEY = 'kg-announcement:prize-list-2027';
// Pages where the bar would be in the way or repeat the page itself.
const HIDDEN_ON = ['/prizes', '/admin', '/payment', '/register'];

// Whether this visitor closed the bar, kept in localStorage. Closing it also
// counts for the rest of this visit when storage is blocked (private mode).
let closedThisVisit = false;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
    listeners.add(onChange);
    window.addEventListener('storage', onChange);
    return () => {
        listeners.delete(onChange);
        window.removeEventListener('storage', onChange);
    };
}

function isDismissed() {
    if (closedThisVisit) return true;
    try {
        return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
        return false;
    }
}

function dismiss() {
    closedThisVisit = true;
    try {
        localStorage.setItem(DISMISS_KEY, '1');
    } catch {
        // Storage blocked: it stays closed for this visit only.
    }
    listeners.forEach((onChange) => onChange());
}

/**
 * Slim bar under the menu announcing the Edition 02 prize list. It doesn't
 * block the page, and once closed it stays closed on this device.
 */
export default function AnnouncementBar() {
    const pathname = usePathname();
    // Hidden in the server-rendered page, so it never flashes for people who closed it.
    const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);

    if (dismissed || HIDDEN_ON.some((path) => pathname.startsWith(path))) return null;

    return (
        <aside className="kg kg-announce" aria-label="Announcement">
            <div className="wrap ann-in">
                <p>
                    <span className="mono ann-tag">New</span>
                    Prize list announced: <strong>{edition2.prizeMoneyLabel}</strong> across {edition2.prizeCount} prizes.
                </p>
                <Link className="ann-link" href="/prizes#prize-list">
                    View prize list <span aria-hidden="true">→</span>
                </Link>
                <button type="button" className="ann-close" onClick={dismiss} aria-label="Close announcement">
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
            </div>
        </aside>
    );
}
