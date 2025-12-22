'use client';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button/Button';
import { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Detect active section based on scroll position
            const sections = ['about', 'race-categories', 'venue'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(`#${section}`);
                        return;
                    }
                }
            }

            // If at top of page, set home as active
            if (window.scrollY < 100) {
                setActiveSection('');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/#about' },
        { name: 'Race Info', href: '/#race-categories' },
        { name: 'Venue', href: '/#venue' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Contact', href: '/contact' },
    ];

    const isActive = (href: string) => {
        // For page routes (not hash links)
        if (!href.includes('#')) {
            return pathname === href;
        }

        // For hash links on home page
        if (pathname === '/') {
            const hash = href.split('#')[1];
            return activeSection === `#${hash}`;
        }

        return false;
    };

    return (
        <nav className={clsx(styles.navbar, { [styles.scrolled]: scrolled })}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">
                        RUN<span className={styles.logoHighlight}>EVENT</span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(styles.navLink, { [styles.active]: isActive(link.href) })}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/register">
                        <Button size="sm">Register Now</Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.mobileMenu}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(styles.mobileNavLink, { [styles.active]: isActive(link.href) })}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className={styles.mobileAction}>
                            <Link href="/register" onClick={() => setIsOpen(false)}>
                                <Button fullWidth>
                                    Register Now
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

