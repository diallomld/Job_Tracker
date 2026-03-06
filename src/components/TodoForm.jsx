import React, { useState } from 'react';
import styles from './TodoForm.module.css';

export function TodoForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [date, setDate] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
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

        // Reset form
        setTitle('');
        setPriority('medium');
        setDate('');
        setTags([]);
    };

    return (
        <form className={`glass-panel ${styles.formContainer}`} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
                <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                    <label>Titre de la tâche</label>
                    <input
                        type="text"
                        className={styles.inputField}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Relancer l'entreprise TechCorp..."
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Priorité</label>
                    <select
                        className={styles.inputField}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Échéance</label>
                    <input
                        type="date"
                        className={styles.inputField}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className={`${styles.inputGroup} ${styles.tagsInput}`} style={{ gridColumn: 'span 2' }}>
                    <label>Tags (Appuyez sur Entrée)</label>
                    <input
                        type="text"
                        className={styles.inputField}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Ex: urgent, dev, agile..."
                    />
                    <div className={styles.tagsContainer}>
                        {tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>
                                {tag}
                                <button type="button" onClick={() => removeTag(index)} className={styles.removeTag}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
                Ajouter la tâche
            </button>
        </form>
    );
}
