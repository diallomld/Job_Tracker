import React from 'react';
import styles from './Dashboard.module.css';

export function Dashboard({ applications }) {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const interviewing = applications.filter(app => app.status === 'interview').length;
    const followup = applications.filter(app => app.status === 'followup').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const accepted = applications.filter(app => app.status === 'accepted').length;

    const stats = [
        { label: 'Total Applications', value: total, color: 'var(--accent-primary)' },
        { label: 'Pending', value: pending, color: 'var(--status-pending)' },
        { label: 'Interviewing', value: interviewing, color: 'var(--status-interview)' },
        { label: 'À relancer', value: followup, color: 'var(--status-followup)' },
        { label: 'Accepted', value: accepted, color: 'var(--status-accepted)' },
    ];

    return (
        <div className={styles.dashboardContainer}>
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`glass-panel ${styles.statCard}`}
                    style={{ '--card-color': stat.color }}
                >
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                </div>
            ))}
        </div>
    );
}
