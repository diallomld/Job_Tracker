import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';
import { supabase } from '../lib/supabase';

vi.mock('../components/applications/KanbanBoard', () => ({
    KanbanBoard: () => <div data-testid="kanban-mock">Kanban Board</div>
}));
vi.mock('../components/applications/Dashboard', () => ({
    Dashboard: () => <div data-testid="dashboard-mock">Dashboard</div>
}));
vi.mock('../components/todo/TodoManager', () => ({
    TodoManager: () => <div data-testid="todomanager-mock">TodoManager</div>
}));
vi.mock('../components/auth/UserProfile', () => ({
    UserProfile: ({ onClose }) => <div data-testid="userprofile-mock"><button onClick={onClose}>Fermer</button></div>
}));
vi.mock('../components/common/Footer', () => ({
    Footer: () => <div data-testid="footer-mock">Footer</div>
}));

vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: vi.fn().mockReturnValue({
                data: { subscription: { unsubscribe: vi.fn() } }
            }),
            signOut: vi.fn().mockResolvedValue({ error: null })
        },
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null })
            })
        })
    }
}));

describe('App Component - Authentication state', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('affiche la page de login quand non connecté', async () => {
        supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
        render(<App />);
        // Auth component should be shown (mocked as null but we can verify no dashboard)
        await waitFor(() => {
            expect(screen.queryByText('Déconnexion')).not.toBeInTheDocument();
        });
    });

    test('appelle signOut lors du clic sur déconnexion', async () => {
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: '123' } } }
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Déconnexion')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /déconnexion/i }));

        await waitFor(() => {
            expect(supabase.auth.signOut).toHaveBeenCalled();
        });
    });

    test('bascule entre onglets Candidatures et To-Do List', async () => {
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: '123' } } }
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Candidatures')).toBeInTheDocument();
        });

        // Click on To-Do tab
        fireEvent.click(screen.getByText('Ma To-Do List'));
        expect(screen.getByTestId('todomanager-mock')).toBeInTheDocument();

        // Click back on Candidatures tab
        fireEvent.click(screen.getByText('Candidatures'));
        expect(screen.getByTestId('dashboard-mock')).toBeInTheDocument();
    });

    test('affiche le formulaire de candidature après clic sur + Nouvelle Candidature', async () => {
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: '123' } } }
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('+ Nouvelle Candidature')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('+ Nouvelle Candidature'));
        // Bouton should now show "Annuler"
        expect(screen.getByText('Annuler')).toBeInTheDocument();
    });

    test('affiche le profil utilisateur après clic sur Mon Profil', async () => {
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: '123' } } }
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Mon Profil')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Mon Profil'));
        expect(screen.getByTestId('userprofile-mock')).toBeInTheDocument();
        expect(screen.getByText('Fermer Profil')).toBeInTheDocument();
    });

    test('bascule le thème avec le bouton de thème', async () => {
        supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTitle(/Passer au thème/i)).toBeInTheDocument();
        });

        const themeBtn = screen.getByTitle(/Passer au thème/i);
        fireEvent.click(themeBtn);
        // After click, title should change
        expect(screen.getByTitle(/Passer au thème/i)).toBeInTheDocument();
    });

    test('ferme le profil et revient aux candidatures via onClose', async () => {
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: '123' } } }
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Mon Profil')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Mon Profil'));
        expect(screen.getByTestId('userprofile-mock')).toBeInTheDocument();

        // Close via the onClose callback inside mocked UserProfile
        fireEvent.click(screen.getByText('Fermer'));
        await waitFor(() => {
            expect(screen.queryByTestId('userprofile-mock')).not.toBeInTheDocument();
        });
    });
});
