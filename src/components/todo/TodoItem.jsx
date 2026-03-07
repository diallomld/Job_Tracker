import styles from './TodoItem.module.css';

export function TodoItem({ todo, onDelete, onStatusChange, isKanban = false }) {
    const handleDragStart = (e) => {
        if (!isKanban) return;
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('todoId', todo.id);
        e.dataTransfer.setData('text/plain', todo.id);
    };

    const toggleComplete = () => {
        const newStatus = todo.status === 'done' ? 'todo' : 'done';
        onStatusChange(todo.id, newStatus);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const isDone = todo.status === 'done';

    if (isKanban) {
        return (
            <div
                className={`${styles.kanbanCard} ${isDone ? styles.completed : ''}`}
                draggable="true"
                onDragStart={handleDragStart}
            >
                <div className={styles.kanbanHeader}>
                    <input
                        type="checkbox"
                        checked={isDone}
                        onChange={toggleComplete}
                        className={styles.checkbox}
                    />
                    <span className={styles.title}>{todo.title}</span>
                </div>
                <div className={styles.meta}>
                    <div className={styles.cell}>
                        <span className={styles.priorityBadge} data-priority={todo.priority}>
                            {todo.priority}
                        </span>
                    </div>
                    {todo.date && (
                        <div className={styles.cell}>
                            <span className={styles.date}>{formatDate(todo.date)}</span>
                        </div>
                    )}
                    <div className={styles.cell}>
                        <div className={styles.tags}>
                            {todo.tags && todo.tags.map((tag, i) => (
                                <span key={i} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={() => onDelete(todo.id)} className={styles.deleteBtn}>×</button>
            </div>
        );
    }

    return (
        <div className={`${styles.todoRow} ${isDone ? styles.completedRow : ''}`}>
            <div className={styles.cell}>
                <input
                    type="checkbox"
                    checked={isDone}
                    onChange={toggleComplete}
                    className={styles.checkbox}
                />
                <span className={styles.title}>{todo.title}</span>
            </div>

            <div className={styles.cell}>
                <span className={styles.priorityBadge} data-priority={todo.priority}>
                    {todo.priority}
                </span>
            </div>

            <div className={styles.cell}>
                <span className={styles.date}>{formatDate(todo.date) || '-'}</span>
            </div>

            <div className={styles.cell}>
                <div className={styles.tags}>
                    {todo.tags && todo.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                </div>
            </div>

            <div className={styles.cell}>
                <button onClick={() => onDelete(todo.id)} className={styles.deleteBtn}>×</button>
            </div>
        </div>
    );
}
