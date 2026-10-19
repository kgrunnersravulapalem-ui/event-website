'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { edition2 } from '@/lib/edition2';

const NAV_LINKS = [
    { name: 'Races', href: '/#races' },
    { name: 'Route & venue', href: '/#route' },
    { name: 'Editions', href: '/editions' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Photo frame', href: '/frame' },
    { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Edition pages (incl. Edition 01 results) highlight "Editions"
    const isCurrent = (href: string) =>
        !href.includes('#') && (pathname === href || (href === '/editions' && pathname.startsWith('/editions/')));
    const registerLabel = 'Register';
    const registerHref = edition2.registrationOpen ? edition2.registerHref : '/#register';

    return (
        <nav className="kg kg-nav" aria-label="Main">
            <div className="wrap nav-in">
                <Link className="logo" href="/">
                    <Image src="/images/logo.png" alt="" width={124} height={124} priority />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <strong>KG RUNNERS</strong>
                        <span className="mono sub" style={{ fontSize: 10, opacity: 0.72 }}>Konaseema Half Marathon</span>
                    </span>
                </Link>
                <div className="links">
                    {NAV_LINKS.map((l) => (
                        <Link key={l.name} href={l.href} className={isCurrent(l.href) ? 'cur' : undefined} aria-current={isCurrent(l.href) ? 'page' : undefined}>
                            {l.name}
                        </Link>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Link className="btn btn-gold nav-cta" href={registerHref}>{registerLabel}</Link>
                    <button
                        type="button"
                        className="btn btn-ghost menu-btn"
                        aria-expanded={open}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen((o) => !o)}
                    >
                        {open ? 'Close' : 'Menu'}
                    </button>
                </div>
            </div>
            {open && (
                <div className="mpanel">
                    {NAV_LINKS.map((l) => (
                        <Link key={l.name} href={l.href} className={isCurrent(l.href) ? 'cur' : undefined} onClick={() => setOpen(false)}>
                            {l.name}
                        </Link>
                    ))}
                    <Link href={registerHref} onClick={() => setOpen(false)} style={{ color: '#F4B400' }}>
                        {registerLabel}
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
