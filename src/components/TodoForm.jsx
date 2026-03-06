import { useState } from 'react';
import styles from './TodoForm.module.css';

export function TodoForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [date, setDate] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    const handleAddTag = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().replace(/,$/, '');
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAdd({
            title,
            priority,
            date: date || null,
            tags,
            status: 'todo'
        });

        setTitle('');
        setPriority('medium');
        setDate('');
        setTags([]);
    };

    return (
        <form className={styles.formRow} onSubmit={handleSubmit}>
            <div className={styles.cell}>
                <input
                    type="text"
                    className={styles.inputField}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="+ Nouvelle tâche..."
                    autoComplete="off"
                />
            </div>

            <div className={styles.cell}>
                <select
                    className={styles.selectField}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                </select>
            </div>

            <div className={styles.cell}>
                <input
                    type="date"
                    className={styles.dateField}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className={styles.cell}>
                <div className={styles.tagsWrapper}>
                    {tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                            {tag}
                            <span onClick={() => removeTag(index)} className={styles.removeTag}>×</span>
                        </span>
                    ))}
                    <input
                        type="text"
                        className={styles.inputField}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Tags..."
                        style={{ width: '80px' }}
                    />
                </div>
            </div>

            <div className={styles.cell}>
                <button type="submit" className={styles.submitBtn} disabled={!title.trim()} title="Ajouter">
                    +
                </button>
            </div>
        </form>
    );
}
