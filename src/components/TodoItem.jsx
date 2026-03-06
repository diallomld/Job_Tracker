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
            className={`${styles.todoCard} ${isKanban ? styles.kanbanCard : ''}`}
            draggable={isKanban}
            onDragStart={handleDragStart}
        >
            <div className={styles.todoMain}>
                <span
                    className={styles.priorityDot}
                    data-priority={todo.priority}
                    title={`Priorité: ${todo.priority}`}
                />
                <span className={styles.title}>{todo.title}</span>
            </div>

            <div className={styles.tags}>
                {todo.tags && todo.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>{tag}</span>
                ))}
            </div>

            {todo.date && (
                <span className={styles.date}>{formatDate(todo.date)}</span>
            )}

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(todo.id);
                }}
                className={styles.deleteBtn}
            >
                ×
            </button>
        </div>
    );
}
