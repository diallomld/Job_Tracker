import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ApplicationForm } from './components/ApplicationForm';
import { KanbanBoard } from './components/KanbanBoard';
import { Auth } from './components/Auth';
import { UserProfile } from './components/UserProfile';
import { TodoManager } from './components/TodoManager';
import { Footer } from './components/Footer';
import posthog from 'posthog-js';
import { supabase } from './lib/supabase';
import './App.css';

const initialApplications = [
  {
    id: '1',
    company: 'TechCorp',
    role: 'Développeur Fullstack',
    type: 'CDI',
    status: 'interview',
    date: '2026-02-15',
    url: 'https://example.com'
  },
  {
    id: '2',
    company: 'StartupStudio',
    role: 'Frontend Engineer',
    type: 'CDD',
    status: 'pending',
    date: '2026-03-01',
    url: ''
  }
];

function App() {
  const [session, setSession] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'todos'
  const [theme, setTheme] = useState(localStorage.getItem('job-tracker-theme') || 'dark');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        posthog.identify(session.user.id, {
          email: session.user.email,
          ...session.user.user_metadata
        });
      } else if (_event === 'SIGNED_OUT') {
        posthog.reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('job-tracker-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (session) {
      fetchApplications();
    } else {
      setApplications([]);
    }
  }, [session]);

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error.message);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleAddApplication = async (newApp) => {
    try {
      const { id, ...appData } = newApp; // Remove local id if present
      const { data, error } = await supabase
        .from('applications')
        .insert([{ ...appData, user_id: session.user.id }])
        .select();

      if (error) throw error;

      if (data) {
        setApplications(prev => [data[0], ...prev]);
        setShowForm(false);
        posthog.capture('application_added', {
          company: data[0].company,
          role: data[0].role,
          type: data[0].type
        });
      }
    } catch (error) {
      console.error('Error adding application:', error);
      alert('Erreur lors de l\'ajout. Veuillez réessayer.');
    }
  };

  const handleDeleteApplication = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
      try {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setApplications(prev => prev.filter(app => app.id !== id));
        posthog.capture('application_deleted', { id });
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI update
    const previousApps = [...applications];
    setApplications(prev =>
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );

    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (!error) {
        posthog.capture('application_status_changed', { id, newStatus });
      }

      if (error) {
        // Revert on failure
        setApplications(previousApps);
        throw error;
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur: Impossible de mettre à jour le statut.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="app-container" style={{ margin: '0 auto', maxWidth: '1200px', padding: '2rem 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Job Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez vos candidatures élégamment.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="glass-panel"
            onClick={toggleTheme}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              background: 'var(--bg-glass)'
            }}
            title={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>

          {session && (
            <>
              <button
                className="glass-panel"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '99px',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-glass)'
                }}
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowForm(false);
                }}
              >
                {showProfile ? 'Fermer Profil' : 'Mon Profil'}
              </button>

              {!showProfile && (
                <button
                  className="glass-panel"
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '99px',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid var(--accent-primary)',
                    background: 'rgba(99, 102, 241, 0.1)'
                  }}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Annuler' : '+ Nouvelle Candidature'}
                </button>
              )}

              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', color: 'var(--status-rejected)', cursor: 'pointer', fontWeight: 'bold' }}
                title="Se déconnecter"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </header>

      {session && !showProfile && (
        <nav style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setActiveTab('applications')}
            style={{
              padding: '0.75rem 0',
              color: activeTab === 'applications' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'applications' ? '2px solid var(--accent-primary)' : 'none',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            Candidatures
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            style={{
              padding: '0.75rem 0',
              color: activeTab === 'todos' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'todos' ? '2px solid var(--accent-primary)' : 'none',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            Ma To-Do List
          </button>
        </nav>
      )}

      <main>
        {!session ? (
          <Auth onAuthSuccess={setSession} />
        ) : showProfile ? (
          <UserProfile session={session} onClose={() => setShowProfile(false)} />
        ) : activeTab === 'todos' ? (
          <TodoManager session={session} />
        ) : (
          <>
            <Dashboard applications={applications} />

            {showForm && (
              <ApplicationForm onAdd={handleAddApplication} />
            )}

            <div style={{ marginTop: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Mes Candidatures</h2>

              {loadingApps ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p>Chargement de vos candidatures...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p>Aucune candidature pour le moment. Commencez par en ajouter une !</p>
                </div>
              ) : (
                <KanbanBoard
                  applications={applications}
                  onDelete={handleDeleteApplication}
                  onStatusChange={handleStatusChange}
                />
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
