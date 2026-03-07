import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApplicationCard } from '../../../components/applications/ApplicationCard';

describe('ApplicationCard', () => {
    const mockApp = {
        id: '123',
        company: 'TestCorp',
        role: 'Tester',
        type: 'CDI',
        status: 'pending',
        date: '2026-03-06',
        url: 'https://test.com',
        notes: 'Some important notes'
    };

    it('renders application details correctly', () => {
        render(<ApplicationCard application={mockApp} onDelete={() => { }} onDragStart={() => { }} />);

        expect(screen.getByText('TestCorp')).toBeInTheDocument();
        expect(screen.getByText('Tester')).toBeInTheDocument();
        expect(screen.getByText('CDI')).toBeInTheDocument();
        expect(screen.getByText('En attente')).toBeInTheDocument();
        expect(screen.getByText('Some important notes')).toBeInTheDocument();
        expect(screen.getByTitle("Voir l'offre").closest('a')).toHaveAttribute('href', 'https://test.com');
    });

    it('calls onDelete when delete button is clicked', () => {
        const onDelete = vi.fn();
        render(<ApplicationCard application={mockApp} onDelete={onDelete} onDragStart={() => { }} />);

        fireEvent.click(screen.getByTitle('Supprimer'));
        expect(onDelete).toHaveBeenCalledWith('123');
    });

    it('calls onDragStart when dragged', () => {
        const onDragStart = vi.fn();
        render(<ApplicationCard application={mockApp} onDelete={() => { }} onDragStart={onDragStart} />);

        const card = screen.getByText('TestCorp').closest('.glass-panel');
        fireEvent.dragStart(card);

        expect(onDragStart).toHaveBeenCalled();
        expect(onDragStart.mock.calls[0][1]).toBe('123'); // Check if ID is passed
    });

    it('does not render url link when url is missing', () => {
        const appNoUrl = { ...mockApp, url: undefined };
        render(<ApplicationCard application={appNoUrl} onDelete={() => { }} onDragStart={() => { }} />);
        expect(screen.queryByTitle("Voir l'offre")).not.toBeInTheDocument();
    });

    it('does not render notes section when notes is missing', () => {
        const appNoNotes = { ...mockApp, notes: undefined };
        render(<ApplicationCard application={appNoNotes} onDelete={() => { }} onDragStart={() => { }} />);
        expect(screen.queryByText('Some important notes')).not.toBeInTheDocument();
    });

    it('renders empty date when date is missing', () => {
        const appNoDate = { ...mockApp, date: undefined };
        render(<ApplicationCard application={appNoDate} onDelete={() => { }} onDragStart={() => { }} />);
        // Should render without crashing
        expect(screen.getByText('TestCorp')).toBeInTheDocument();
    });

    it('renders all status labels correctly', () => {
        const statuses = [
            { status: 'interview', label: 'Entretien' },
            { status: 'followup', label: 'À relancer' },
            { status: 'accepted', label: 'Accepté' },
            { status: 'rejected', label: 'Refusé' },
        ];
        for (const { status, label } of statuses) {
            const { unmount } = render(
                <ApplicationCard application={{ ...mockApp, status }} onDelete={() => { }} onDragStart={() => { }} />
            );
            expect(screen.getByText(label)).toBeInTheDocument();
            unmount();
        }
    });
});
