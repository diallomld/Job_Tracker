import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './ApplicationForm.module.css';

export function Auth({ onAuthSuccess }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');

    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            let result;
            const redirectUrl = window.location.origin;

            if (isForgotPassword) {
                result = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${redirectUrl}/reset-password`,
                });
                if (!result.error) {
                    setSuccessMsg("Email de réinitialisation envoyé ! Vérifiez votre boîte mail.");
                }
            } else if (isLogin) {
                result = await supabase.auth.signInWithPassword({ email, password });
            } else {
                result = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: redirectUrl,
                        data: {
                            full_name: fullName,
                            phone_number: phone
                        }
                    }
                });
                if (result.data?.user && result.data.user.identities?.length === 0) {
                    setErrorMsg("Cet utilisateur existe déjà. Veuillez vous connecter.");
                    setIsLogin(true);
                    setLoading(false);
                    return;
                }
            }

            if (result.error) throw result.error;

            if (!isLogin && !isForgotPassword && result.data?.user) {
                if (!result.data.session) {
                    setSuccessMsg("Inscription réussie ! Veuillez vérifier votre boîte mail.");
                    setIsLogin(true);
                } else {
                    onAuthSuccess(result.data.session);
                }
            } else if (result.data.session) {
                onAuthSuccess(result.data.session);
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
                    {isForgotPassword ? 'Réinitialisation' : (isLogin ? 'Connexion' : 'Inscription')}
                </h2>

                {errorMsg && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-rejected)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {errorMsg}
                    </div>
                )}

                {successMsg && (
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-accepted)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {successMsg}
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

                    {!isForgotPassword && (
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
                    )}

                    {!isLogin && !isForgotPassword && (
                        <>
                            <div className={styles.inputGroup}>
                                <label htmlFor="fullName">Nom complet (Optionnel)</label>
                                <input
                                    id="fullName"
                                    className={styles.inputField}
                                    type="text"
                                    placeholder="Jean Dupont"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="phone">Téléphone (Optionnel)</label>
                                <input
                                    id="phone"
                                    className={styles.inputField}
                                    type="tel"
                                    placeholder="+33 6 00 00 00 00"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                        {loading ? 'Chargement...' : (isForgotPassword ? 'Envoyer lien' : (isLogin ? 'Se connecter' : "S'inscrire"))}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {!isForgotPassword && isLogin && (
                        <button
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            Mot de passe oublié ?
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            if (isForgotPassword) {
                                setIsForgotPassword(false);
                            } else {
                                setIsLogin(!isLogin);
                            }
                            setErrorMsg('');
                            setSuccessMsg('');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem' }}
                    >
                        {isForgotPassword ? 'Retour à la connexion' : (isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter')}
                    </button>
                </div>
            </div>
        </div>
    );
}
