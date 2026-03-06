import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApplicationCard } from '../../components/ApplicationCard';

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
});
