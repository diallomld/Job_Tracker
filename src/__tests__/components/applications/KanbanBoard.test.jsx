import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KanbanBoard } from '../../../components/applications/KanbanBoard';

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

    it('shows empty state message for empty columns', () => {
        render(<KanbanBoard applications={[]} onDelete={() => { }} onStatusChange={() => { }} />);
        const emptyMessages = screen.getAllByText('Glissez une candidature ici');
        expect(emptyMessages.length).toBe(5); // 5 columns, all empty
    });

    it('handles dragLeave on column', () => {
        const onStatusChange = vi.fn();
        render(<KanbanBoard applications={apps} onDelete={() => { }} onStatusChange={onStatusChange} />);

        const pendingHeader = screen.getAllByText('En attente')[0];
        const pendingColumn = pendingHeader.closest('div[class*="kanbanColumn"]');

        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => ''), effectAllowed: '', dropEffect: '' };
        fireEvent.dragOver(pendingColumn, { dataTransfer });
        fireEvent.dragLeave(pendingColumn);
        // DragLeave clears dragOverColumn — no error should occur
        expect(pendingColumn).toBeInTheDocument();
    });

    it('does not call onStatusChange when same status on drop', () => {
        const onStatusChange = vi.fn();
        render(<KanbanBoard applications={apps} onDelete={() => { }} onStatusChange={onStatusChange} />);

        const pendingHeader = screen.getAllByText('En attente')[0];
        const pendingColumn = pendingHeader.closest('div[class*="kanbanColumn"]');

        const dataTransfer = {
            setData: vi.fn(),
            getData: vi.fn(() => '1'), // app id '1' is already 'pending'
            effectAllowed: '',
            dropEffect: ''
        };

        fireEvent.dragStart(screen.getByText('App1').closest('.glass-panel'), { dataTransfer });
        fireEvent.drop(pendingColumn, { dataTransfer });
        // App '1' is already 'pending' so onStatusChange should NOT be called
        expect(onStatusChange).not.toHaveBeenCalled();
    });

    it('does not call onStatusChange when drop has no appId', () => {
        const onStatusChange = vi.fn();
        render(<KanbanBoard applications={apps} onDelete={() => { }} onStatusChange={onStatusChange} />);

        const acceptedHeader = screen.getByText('Accepté');
        const acceptedColumn = acceptedHeader.closest('div[class*="kanbanColumn"]');

        const dataTransfer = {
            setData: vi.fn(),
            getData: vi.fn(() => ''), // no id
            effectAllowed: '',
            dropEffect: ''
        };

        fireEvent.drop(acceptedColumn, { dataTransfer });
        expect(onStatusChange).not.toHaveBeenCalled();
    });
});
