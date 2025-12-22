import styles from './Footer.module.css';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';
import Link from 'next/link';
import { eventConfig } from '@/lib/eventConfig';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.contact}>
                        <h4>Contact Us</h4>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <FaEnvelope className={styles.contactIcon} />
                                <span>{eventConfig.contact.email}</span>
                            </div>
                            <div className={styles.contactItem}>
                                <FaPhone className={styles.contactIcon} />
                                <div>
                                    {eventConfig.contact.phones.map((phone, index) => (
                                        <div key={index}>{phone}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.links}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/#about">About Us</Link></li>
                            <li><Link href="/#race-categories">Race Categories</Link></li>
                            <li><Link href="/#venue">Venue</Link></li>
                            <li><Link href="/prizes">Prizes</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/register">Register</Link></li>
                        </ul>
                    </div>
                    <div className={styles.social}>
                        <h4>Follow Us</h4>
                        <div className={styles.icons}>
                            <a href="#" className={styles.icon}><FaFacebook /></a>
                            <a href="#" className={styles.icon}><FaInstagram /></a>
                            <a href="#" className={styles.icon}><FaTwitter /></a>
                        </div>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} {eventConfig.eventName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

