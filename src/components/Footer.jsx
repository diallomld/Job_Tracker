import React, { useState } from 'react';
import styles from './Footer.module.css';

export function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        // Simulation d'une API de newsletter
        setTimeout(() => {
            setLoading(false);
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 5000);
        }, 1000);
    };

    return (
        <footer className={styles.footer}>
            <div className={`glass-panel ${styles.newsletterContainer}`}>
                <h3 className={styles.newsletterTitle}>Newsletter Horizon Teck</h3>
                <p className={styles.newsletterSubtitle}>
                    Restez informé des dernières nouvelles sur l'IA et le Vibe Coding.
                </p>

                <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                    <input
                        type="email"
                        placeholder="votre@email.com"
                        className={styles.newsletterInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className={styles.subscribeBtn}
                        disabled={loading}
                    >
                        {loading ? '...' : (subscribed ? '✓' : "S'abonner")}
                    </button>
                </form>
                {subscribed && (
                    <p className={styles.successMsg}>Merci de votre inscription !</p>
                )}
            </div>

            <div className={styles.copyright}>
                <p>© {new Date().getFullYear()} Horizon Teck. Tous droits réservés.</p>
            </div>
        </footer>
    );
}
