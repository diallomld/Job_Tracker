import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
import { usePostHog } from '@posthog/react';
import styles from './TodoManager.module.css';

export function TodoManager({ session }) {
    const posthog = usePostHog();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' or 'kanban'

    useEffect(() => {
        if (session) fetchTodos();
    }, [session]);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setTodos(data || []);
        } catch (_err) {
            console.error('Error fetching todos:', _err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async (newTodo) => {
        try {
            const { data, error } = await supabase
                .from('todos')
                .insert([{ ...newTodo, user_id: session.user.id }])
                .select();
            if (error) throw error;
            if (data) {
                setTodos([data[0], ...todos]);
                posthog.capture('todo_added', {
                    priority: data[0].priority,
                    has_date: !!data[0].date,
                    tag_count: data[0].tags?.length || 0
                });
            }
        } catch {
            alert('Erreur lors de l’ajout du todo');
        }
    };

    const handleDeleteTodo = async (id) => {
        if (!window.confirm('Supprimer cette tâche ?')) return;
        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setTodos(todos.filter(t => t.id !== id));
            posthog.capture('todo_deleted', { id });
        } catch {
            alert('Erreur lors de la suppression');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const previousTodos = [...todos];
        setTodos(todos.map(t => t.id === id ? { ...t, status: newStatus } : t));

        try {
            const { error } = await supabase
                .from('todos')
                .update({ status: newStatus })
                .eq('id', id);

            if (!error) {
                posthog.capture('todo_status_changed', { id, newStatus });
            }

            if (error) throw error;
        } catch {
            setTodos(previousTodos);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const onDrop = (e, status) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('todoId');
        if (id) {
            handleStatusChange(id, status);
        }
    };

    const columns = [
        { id: 'todo', title: 'À faire' },
        { id: 'doing', title: 'En cours' },
        { id: 'done', title: 'Terminé' }
    ];

    if (loading) return <div className={styles.loading}>Chargement des tâches...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2 className="gradient-text">Mes Tâches</h2>
                    <div className={styles.viewTabs}>
                        <button
                            className={view === 'list' ? styles.activeTab : ''}
                            onClick={() => setView('list')}
                        >
                            Tableau
                        </button>
                        <button
                            className={view === 'kanban' ? styles.activeTab : ''}
                            onClick={() => setView('kanban')}
                        >
                            Kanban
                        </button>
                    </div>
                </div>
            </header>

            {view === 'list' ? (
                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <div className={styles.headerCell}>Titre</div>
                        <div className={styles.headerCell}>Priorité</div>
                        <div className={styles.headerCell}>Échéance</div>
                        <div className={styles.headerCell}>Tags</div>
                        <div className={styles.headerCell}>Action</div>
                    </div>

                    <TodoForm onAdd={handleAddTodo} />

                    <div className={styles.tableBody}>
                        {todos.length === 0 ? (
                            <p className={styles.empty}>Aucune tâche pour le moment.</p>
                        ) : (
                            todos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onDelete={handleDeleteTodo}
                                    onStatusChange={handleStatusChange}
                                />
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.kanbanView}>
                    {columns.map(col => (
                        <div
                            key={col.id}
                            className={styles.column}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => onDrop(e, col.id)}
                        >
                            <h3 className={styles.columnHeader}>
                                {col.title}
                                <span className={styles.count}>
                                    {todos.filter(t => t.status === col.id).length}
                                </span>
                            </h3>
                            <div className={styles.columnBody}>
                                {todos
                                    .filter(t => t.status === col.id)
                                    .map(todo => (
                                        <TodoItem
                                            key={todo.id}
                                            todo={todo}
                                            isKanban={true}
                                            onDelete={handleDeleteTodo}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
