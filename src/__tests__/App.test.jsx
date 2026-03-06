import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';
import { supabase } from '../lib/supabase';

// Mock du module KanbanBoard pour simplifier le test
vi.mock('../components/KanbanBoard', () => ({
    KanbanBoard: () => <div data-testid="kanban-mock">Kanban Board</div>
}));

// Mock du module Dashboard
vi.mock('../components/Dashboard', () => ({
    Dashboard: () => <div data-testid="dashboard-mock">Dashboard</div>
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

    test('appelle signOut lors du clic sur déconnexion', async () => {
        // Simuler un utilisateur connecté
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: '123' } } }
        });

        render(<App />);

        // Attendre que l'interface se charge avec la session
        await waitFor(() => {
            expect(screen.getByText('Déconnexion')).toBeInTheDocument();
        });

        // Clic sur le bouton de déconnexion
        fireEvent.click(screen.getByRole('button', { name: /déconnexion/i }));

        // Vérifier l'appel à Supabase
        await waitFor(() => {
            expect(supabase.auth.signOut).toHaveBeenCalled();
        });
    });
});
