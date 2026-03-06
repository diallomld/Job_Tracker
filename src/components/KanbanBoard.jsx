import React, { useState } from 'react';
import { ApplicationCard } from './ApplicationCard';
import styles from './KanbanBoard.module.css';

const COLUMNS = [
    { id: 'pending', title: 'En attente', color: 'var(--status-pending)' },
    { id: 'interview', title: 'Entretien', color: 'var(--status-interview)' },
    { id: 'followup', title: 'À relancer', color: 'var(--status-followup)' },
    { id: 'accepted', title: 'Accepté', color: 'var(--status-accepted)' },
    { id: 'rejected', title: 'Refusé', color: 'var(--status-rejected)' }
];

export function KanbanBoard({ applications, onDelete, onStatusChange }) {
    const [draggedAppId, setDraggedAppId] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    const handleDragStart = (e, id) => {
        setDraggedAppId(id);
        e.dataTransfer.effectAllowed = 'move';
        // Required for Firefox
        e.dataTransfer.setData('text/plain', id);
    };

    const handleDragOver = (e, columnId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverColumn !== columnId) {
            setDragOverColumn(columnId);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOverColumn(null);
    };

    const handleDrop = (e, statusId) => {
        e.preventDefault();
        setDragOverColumn(null);

        const appId = e.dataTransfer.getData('text/plain') || draggedAppId;

        if (appId) {
            const app = applications.find(a => a.id === appId);
            if (app && app.status !== statusId) {
                onStatusChange(appId, statusId);
            }
        }

        setDraggedAppId(null);
    };

    return (
        <div className={styles.kanbanBoard}>
            {COLUMNS.map(column => {
                const columnApps = applications.filter(app => app.status === column.id);
                const isDragOver = dragOverColumn === column.id;

                return (
                    <div
                        key={column.id}
                        className={`${styles.kanbanColumn} ${isDragOver ? styles.dragOver : ''}`}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        <div className={styles.columnHeader} style={{ '--column-color': column.color }}>
                            <span className={styles.columnTitle}>{column.title}</span>
                            <span className={styles.columnCount}>{columnApps.length}</span>
                        </div>

                        <div className={styles.columnContent}>
                            {columnApps.length === 0 ? (
                                <div className={styles.emptyColumn}>
                                    Glissez une candidature ici
                                </div>
                            ) : (
                                columnApps.map(app => (
                                    <ApplicationCard
                                        key={app.id}
                                        application={app}
                                        onDelete={onDelete}
                                        onDragStart={handleDragStart}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
