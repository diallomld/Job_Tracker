import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KanbanBoard } from './KanbanBoard';

describe('KanbanBoard Integration', () => {
    const apps = [
        { id: '1', status: 'pending', company: 'App1', role: 'Role1' },
        { id: '2', status: 'interview', company: 'App2', role: 'Role2' }
    ];

    it('renders all columns and cards', () => {
        render(<KanbanBoard applications={apps} onDelete={() => { }} onStatusChange={() => { }} />);

        expect(screen.getAllByText('En attente').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Entretien').length).toBeGreaterThan(0);
        expect(screen.getByText('App1')).toBeInTheDocument();
        expect(screen.getByText('App2')).toBeInTheDocument();
    });

    it('handles drag and drop to change status', () => {
        const onStatusChange = vi.fn();
        render(<KanbanBoard applications={apps} onDelete={() => { }} onStatusChange={onStatusChange} />);

        const cardToDrag = screen.getByText('App1').closest('.glass-panel');
        // Drag over "Accepté" column
        const acceptedColumnHeader = screen.getByText('Accepté');
        const acceptedColumn = acceptedColumnHeader.closest('div[class*="kanbanColumn"]');

        // Mock dataTransfer since jsdom doesn't fully implement it
        const dataTransfer = {
            setData: vi.fn(),
            getData: vi.fn(() => '1'),
            effectAllowed: '',
            dropEffect: ''
        };

        fireEvent.dragStart(cardToDrag, { dataTransfer });
        fireEvent.dragOver(acceptedColumn, { dataTransfer });
        fireEvent.drop(acceptedColumn, { dataTransfer });

        expect(onStatusChange).toHaveBeenCalledWith('1', 'accepted');
    });
});
