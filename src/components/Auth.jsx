import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './ApplicationForm.module.css';

export function Auth({ onAuthSuccess }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            let result;
            if (isLogin) {
                result = await supabase.auth.signInWithPassword({ email, password });
            } else {
                result = await supabase.auth.signUp({ email, password });
                if (result.data?.user && result.data.user.identities?.length === 0) {
                    setErrorMsg("Cet utilisateur existe déjà. Veuillez vous connecter.");
                    setIsLogin(true);
                    setLoading(false);
                    return;
                }
            }

            if (result.error) throw result.error;

            if (!isLogin && result.data?.user) {
                // Auto sign-in or check email verification depending on supabase project settings
                if (!result.session) {
                    setErrorMsg("Inscription réussie ! Veuillez vérifier votre boîte mail si nécessaire, ou connectez-vous.");
                    setIsLogin(true);
                } else {
                    onAuthSuccess(result.session);
                }
            } else if (result.session) {
                onAuthSuccess(result.session);
            }

        } catch (error) {
            setErrorMsg(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className={`glass-panel ${styles.formContainer}`} style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>
                    {isLogin ? 'Connexion' : 'Inscription'}
                </h2>

                {errorMsg && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-rejected)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            className={styles.inputField}
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            id="password"
                            className={styles.inputField}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                        {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem' }}
                    >
                        {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
                    </button>
                </div>
            </div>
        </div>
    );
}
