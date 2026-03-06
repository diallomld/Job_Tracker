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

        setTitle('');
        setPriority('medium');
        setDate('');
        setTags([]);
    };

    return (
        <form className={`glass-panel ${styles.formContainer}`} onSubmit={handleSubmit}>
            <div className={styles.titleSection}>
                <h3 className="gradient-text">Ajouter une nouvelle mission</h3>
                <p>Organisez votre recherche d'emploi avec précision.</p>
            </div>

            <div className={styles.formGrid}>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Titre de la tâche</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.inputIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </span>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Préparer l'entretien pour TechCorp..."
                            required
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Priorité</label>
                    <div className={styles.prioritySélecteur}>
                        {['low', 'medium', 'high'].map(p => (
                            <div
                                key={p}
                                className={`${styles.priorityOption} ${priority === p ? styles.active : ''}`}
                                data-priority={p}
                                onClick={() => setPriority(p)}
                            >
                                {p === 'low' ? 'Basse' : p === 'medium' ? 'Moyenne' : 'Haute'}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Échéance</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.inputIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </span>
                        <input
                            type="date"
                            className={styles.inputField}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Tags & Catégories</label>
                    <div className={styles.tagsWrapper}>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                            </span>
                            <input
                                type="text"
                                className={styles.inputField}
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Appuyez sur Entrée pour ajouter un tag..."
                            />
                        </div>
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
            </div>

            <button type="submit" className={styles.submitBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Ajouter à ma liste
            </button>
        </form>
    );
}
