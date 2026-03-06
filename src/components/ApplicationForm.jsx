import React, { useState } from 'react';
import styles from './ApplicationForm.module.css';

export function ApplicationForm({ onAdd }) {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        type: 'CDI',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        url: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.company || !formData.role) return;

        onAdd({
            ...formData,
            id: Date.now().toString(),
        });

        // Reset form
        setFormData({
            company: '',
            role: '',
            type: 'CDI',
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            url: '',
            notes: ''
        });
    };

    return (
        <div className={`glass-panel ${styles.formContainer}`}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Nouvelle Candidature</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="company">Entreprise *</label>
                        <input required type="text" id="company" name="company" className={styles.inputField} value={formData.company} onChange={handleChange} placeholder="Ex: Google" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="role">Poste *</label>
                        <input required type="text" id="role" name="role" className={styles.inputField} value={formData.role} onChange={handleChange} placeholder="Ex: Développeur Frontend" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="type">Type de contrat</label>
                        <select id="type" name="type" className={styles.inputField} value={formData.type} onChange={handleChange}>
                            <option value="CDI">CDI</option>
                            <option value="CDD">CDD</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Stage">Stage</option>
                            <option value="Alternance">Alternance</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="status">Statut</label>
                        <select id="status" name="status" className={styles.inputField} value={formData.status} onChange={handleChange}>
                            <option value="pending">En attente</option>
                            <option value="interview">Entretien</option>
                            <option value="followup">À relancer</option>
                            <option value="accepted">Accepté</option>
                            <option value="rejected">Refusé</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="date">Date de candidature</label>
                        <input type="date" id="date" name="date" className={styles.inputField} value={formData.date} onChange={handleChange} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="url">Lien de l'offre</label>
                        <input type="url" id="url" name="url" className={styles.inputField} value={formData.url} onChange={handleChange} placeholder="https://..." />
                    </div>
                </div>

                <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                    <label htmlFor="notes">Notes (Salaire, contacts, remarques...)</label>
                    <textarea
                        id="notes"
                        name="notes"
                        className={styles.inputField}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Ajoutez vos notes ici..."
                        rows="3"
                        style={{ resize: 'vertical' }}
                    ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="submit" className={styles.submitBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Ajouter la candidature
                    </button>
                </div>
            </form>
        </div>
    );
}
