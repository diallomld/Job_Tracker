import React from 'react';
import styles from './TodoItem.module.css';

export function TodoItem({ todo, onDelete, onStatusChange, isKanban = false }) {
    const priorityColors = {
        low: 'var(--status-accepted)',
        medium: 'var(--status-pending)',
        high: 'var(--status-rejected)'
    };

    const handleDragStart = (e) => {
        if (!isKanban) return;
        e.dataTransfer.setData('todoId', todo.id);
    };

    return (
        <div
            className={`glass-panel ${styles.todoCard} ${isKanban ? styles.kanbanCard : ''}`}
            draggable={isKanban}
            onDragStart={handleDragStart}
        >
            <div className={styles.todoHeader}>
                <span
                    className={styles.priorityIndicator}
                    style={{ backgroundColor: priorityColors[todo.priority] }}
                    title={`Priorité: ${todo.priority}`}
                />
                <h4 className={styles.title}>{todo.title}</h4>
                <button
                    onClick={() => onDelete(todo.id)}
                    className={styles.deleteBtn}
                    title="Supprimer"
                >
                    ×
                </button>
            </div>

            <div className={styles.details}>
                {todo.date && (
                    <span className={styles.date}>
                        📅 {new Date(todo.date).toLocaleDateString()}
                    </span>
                )}

                <div className={styles.tags}>
                    {todo.tags && todo.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>#{tag}</span>
                    ))}
                </div>
            </div>

            {!isKanban && (
                <div className={styles.actions}>
                    <select
                        value={todo.status}
                        onChange={(e) => onStatusChange(todo.id, e.target.value)}
                        className={styles.statusSelect}
                    >
                        <option value="todo">À faire</option>
                        <option value="doing">En cours</option>
                        <option value="done">Terminé</option>
                    </select>
                </div>
            )}
        </div>
    );
}
