import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoManager } from '../../components/TodoManager';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: [], error: null }))
            })),
            insert: vi.fn(() => ({
                select: vi.fn(() => Promise.resolve({ data: [{ id: '1', title: 'Test Todo', status: 'todo', priority: 'medium' }], error: null }))
            })),
            update: vi.fn(() => ({
                eq: vi.fn(() => Promise.resolve({ error: null }))
            })),
            delete: vi.fn(() => ({
                eq: vi.fn(() => Promise.resolve({ error: null }))
            }))
        }))
    }
}));

const mockSession = {
    user: { id: 'user123' }
};

describe('TodoManager Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche le message de chargement initialement', () => {
        render(<TodoManager session={mockSession} />);
        expect(screen.getByText(/Chargement des tâches/i)).toBeDefined();
    });

    it('permet de basculer entre la vue Liste et Kanban', async () => {
        render(<TodoManager session={mockSession} />);

        await waitFor(() => {
            expect(screen.queryByText(/Chargement/i)).toBeNull();
        });

        const listBtn = screen.getByText('Tableau');
        const kanbanBtn = screen.getByText('Kanban');

        fireEvent.click(kanbanBtn);
        expect(screen.getByText('À faire')).toBeDefined();
        expect(screen.getByText('En cours')).toBeDefined();
        expect(screen.getByText('Terminé')).toBeDefined();

        fireEvent.click(listBtn);
        expect(screen.queryByText('À faire')).toBeNull(); // Titre de colonne kanban
    });

    it('permet d\'ajouter une tâche via le formulaire inline', async () => {
        render(<TodoManager session={mockSession} />);

        await waitFor(() => {
            expect(screen.queryByText(/Chargement/i)).toBeNull();
        });

        const input = screen.getByPlaceholderText(/Nouvelle tâche.../i);
        expect(input).toBeDefined();
    });

    it('supprime un todo après confirmation', async () => {
        const mockData = [{ id: '1', title: 'Task to delete', status: 'todo', priority: 'medium' }];
        supabase.from.mockReturnValueOnce({
            select: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockData, error: null }))
            })),
            delete: vi.fn(() => ({
                eq: vi.fn(() => Promise.resolve({ error: null }))
            }))
        });

        window.confirm = vi.fn(() => true);
        render(<TodoManager session={mockSession} />);

        await waitFor(() => {
            expect(screen.getByText('Task to delete')).toBeDefined();
        });

        const deleteBtn = screen.getByText('×');
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(screen.queryByText('Task to delete')).toBeNull();
        });
    });
});
