import styles from './Dashboard.module.css';

export function Dashboard({ applications }) {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const interviewing = applications.filter(app => app.status === 'interview').length;
    const followup = applications.filter(app => app.status === 'followup').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const accepted = applications.filter(app => app.status === 'accepted').length;

    const stats = [
        { label: 'Total', value: total, color: 'var(--accent-primary)' },
        { label: 'En attente', value: pending, color: 'var(--status-pending)' },
        { label: 'Entretiens', value: interviewing, color: 'var(--status-interview)' },
        { label: 'À relancer', value: followup, color: 'var(--status-followup)' },
        { label: 'Refusés', value: rejected, color: 'var(--status-rejected)' },
        { label: 'Acceptés', value: accepted, color: 'var(--status-accepted)' },
    ];

    return (
        <div className={styles.dashboardContainer}>
            <button onClick={() => { throw new Error("Test Sentry React 18"); }}>
                Casser l'application pour des test
            </button>
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
