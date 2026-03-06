import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import styles from './ApplicationForm.module.css';

export function UserProfile({ session, onClose }) {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        if (session?.user?.user_metadata) {
            setFullName(session.user.user_metadata.full_name || '');
            setPhone(session.user.user_metadata.phone || '');
        }
    }, [session]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    phone: phone,
                }
            });

            if (error) throw error;
            setMsg({ type: 'success', text: 'Profil mis à jour avec succès !' });
        } catch (error) {
            setMsg({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`glass-panel ${styles.formContainer}`} style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Mon Profil</h2>

            {msg && (
                <div style={{
                    backgroundColor: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: msg.type === 'error' ? 'var(--status-rejected)' : 'var(--status-accepted)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                }}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={styles.inputGroup}>
                    <label htmlFor="profileEmail">Email</label>
                    <input
                        id="profileEmail"
                        className={styles.inputField}
                        type="email"
                        value={session?.user?.email || ''}
                        disabled
                        style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="profileFullName">Nom complet</label>
                    <input
                        id="profileFullName"
                        className={styles.inputField}
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jean Dupont"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="profilePhone">Téléphone</label>
                    <input
                        id="profilePhone"
                        className={styles.inputField}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+33 6 00 00 00 00"
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.inputField} style={{ flex: 1, cursor: 'pointer', textAlign: 'center', background: 'transparent' }}>
                        Fermer
                    </button>
                    <button type="submit" className={styles.submitBtn} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
