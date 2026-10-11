import Link from 'next/link';
import Image from 'next/image';
import { edition2 } from '@/lib/edition2';

const fmtPhone = (p: string) => `+91 ${p.slice(0, 5)} ${p.slice(5)}`;

const Footer = () => {
    return (
        <footer className="kg kg-foot" id="contact">
            <div className="wrap">
                <div className="foot-grid">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Link className="logo" href="/">
                            <Image src="/images/logo.png" alt="" width={124} height={124} />
                            <strong>KG Runners</strong>
                        </Link>
                        <p style={{ margin: 0, color: 'rgba(247,242,228,.72)', lineHeight: 1.55, maxWidth: '32ch' }}>
                            Konaseema Godavari Runners Association, Ravulapalem. Organisers of the Konaseema Half Marathon.
                        </p>
                    </div>
                    <div>
                        <h4 className="mono">Contact</h4>
                        <ul>
                            <li><a href={`mailto:${edition2.contact.email}`}>{edition2.contact.email}</a></li>
                            {edition2.contact.phones.map((p) => (
                                <li key={p}><a href={`tel:+91${p}`}>{fmtPhone(p)}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="mono">Race</h4>
                        <ul>
                            <li><Link href="/#races">Categories</Link></li>
                            <li><Link href="/#route">Route &amp; venue</Link></li>
                            <li><Link href="/prizes">Prizes</Link></li>
                            <li><Link href="/gallery">Gallery</Link></li>
                            <li><Link href="/editions">Editions</Link></li>
                            <li><Link href="/editions/2026/results">Edition 01 results</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mono">Policies</h4>
                        <ul>
                            <li><Link href="/terms">Terms &amp; Conditions</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/refund">Refund Policy</Link></li>
                            <li><Link href="/contact">Contact us</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="foot-base mono">
                    <span>© {new Date().getFullYear()} Konaseema Half Marathon · Organised by KG Runners</span>
                    <span>kgrunners.in</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
