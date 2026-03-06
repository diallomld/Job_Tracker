import React from 'react';
import styles from './ApplicationCard.module.css';

const statusLabels = {
    pending: 'En attente',
    interview: 'Entretien',
    followup: 'À relancer',
    accepted: 'Accepté',
    rejected: 'Refusé'
};

export function ApplicationCard({ application, onDelete, onDragStart }) {
    const { id, company, role, type, status, date, url, notes } = application;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const dateObj = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(dateObj);
    };

    return (
        <div
            className={`glass-panel ${styles.card}`}
            draggable="true"
            onDragStart={(e) => onDragStart(e, id)}
        >
            <div className={styles.cardHeader}>
                <div className={styles.companyInfo}>
                    <div className={styles.companyName}>{company}</div>
                    <div className={styles.roleName}>{role}</div>
                </div>
                <div className={styles.badges}>
                    <span className={`${styles.badge} ${styles.badgeType}`}>{type}</span>
                    <span className={`${styles.badge} ${styles.badgeStatus} ${styles[status]}`}>
                        {statusLabels[status]}
                    </span>
                </div>
            </div>

            {notes && (
                <div className={styles.notes}>
                    {notes}
                </div>
            )}

            <div className={styles.cardFooter}>
                <div className={styles.date}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {formatDate(date)}
                </div>

                <div className={styles.actions}>
                    {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} title="Voir l'offre">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                    )}
                    <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => onDelete(id)} title="Supprimer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
