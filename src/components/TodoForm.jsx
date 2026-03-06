import React, { useState, useRef, useEffect } from 'react';
import styles from './TodoForm.module.css';

export function TodoForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [date, setDate] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target) && !title.trim()) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [title]);

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
        if (!title.trim()) {
            setIsExpanded(false);
            return;
        }

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
        setIsExpanded(false);
    };

    return (
        <form
            ref={formRef}
            className={`glass-panel ${styles.formContainer}`}
            onSubmit={handleSubmit}
        >
            <div className={styles.inlineInputWrapper} onClick={() => setIsExpanded(true)}>
                <span className={styles.addIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </span>
                <input
                    type="text"
                    className={styles.inputField}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    placeholder="Nouvelle tâche..."
                    autoComplete="off"
                />
            </div>

            {isExpanded && (
                <div className={styles.expandedControls}>
                    <div className={styles.controlItem}>
                        <label>Priorité</label>
                        <select
                            className={styles.prioritySelect}
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="low">L</option>
                            <option value="medium">M</option>
                            <option value="high">H</option>
                        </select>
                    </div>

                    <div className={styles.controlItem}>
                        <label>Date</label>
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.controlItem}>
                        <label>Tags</label>
                        <div className={styles.tagsContainer}>
                            {tags.map((tag, index) => (
                                <span key={index} className={styles.tag}>
                                    {tag}
                                    <span onClick={() => removeTag(index)} className={styles.removeTag}>×</span>
                                </span>
                            ))}
                            <input
                                type="text"
                                className={styles.tagInput}
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="..."
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => {
                                setTitle('');
                                setTags([]);
                                setIsExpanded(false);
                            }}
                        >
                            Annuler
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            Enregistrer
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
