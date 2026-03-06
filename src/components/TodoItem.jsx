import React from 'react';
import styles from './TodoItem.module.css';

export function TodoItem({ todo, onDelete, onStatusChange, isKanban = false }) {
    const handleDragStart = (e) => {
        if (!isKanban) return;
        e.dataTransfer.setData('todoId', todo.id);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        <div
            className={`glass-panel ${styles.todoCard} ${isKanban ? styles.kanbanCard : ''}`}
            draggable={isKanban}
            onDragStart={handleDragStart}
        >
            <div className={styles.todoHeader}>
                <div className={styles.titleWrapper}>
                    <span
                        className={styles.priorityBadge}
                        data-priority={todo.priority}
                    >
                        {todo.priority === 'high' ? 'High' : todo.priority === 'medium' ? 'Mod' : 'Low'}
                    </span>
                    <h4 className={styles.title}>{todo.title}</h4>
                </div>
                <button
                    onClick={() => onDelete(todo.id)}
                    className={styles.deleteBtn}
                >
                    ×
                </button>
            </div>

            <div className={styles.metaInfo}>
                {todo.date && (
                    <div className={styles.infoItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>{formatDate(todo.date)}</span>
                    </div>
                )}

                <div className={styles.tags}>
                    {todo.tags && todo.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>#{tag}</span>
                    ))}
                </div>
            </div>

            {!isKanban && (
                <div className={styles.footerActions}>
                    <div className={styles.statusSelector}>
                        {['todo', 'doing', 'done'].map(s => (
                            <button
                                key={s}
                                className={`${styles.statusBtn} ${todo.status === s ? styles.activeStatus : ''}`}
                                onClick={() => onStatusChange(todo.id, s)}
                            >
                                {s === 'todo' ? 'À faire' : s === 'doing' ? 'En cours' : 'Fait'}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
