import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoItem } from '../../../components/todo/TodoItem';

const mockTodo = {
    id: '1',
    title: 'Test Feature',
    priority: 'high',
    date: '2026-03-06',
    tags: ['Next.js', 'Vite'],
    status: 'todo'
};

describe('TodoItem Component', () => {
    it('rend les informations de la tâche correctement', () => {
        render(<TodoItem todo={mockTodo} onDelete={vi.fn()} onStatusChange={vi.fn()} />);

        expect(screen.getByText('Test Feature')).toBeDefined();
        expect(screen.getByText('high')).toBeDefined();
        // Vérifie le format de date long (ex: 6 mars 2026)
        expect(screen.getByText(/6 mars 2026/i)).toBeDefined();
        expect(screen.getByText('Next.js')).toBeDefined();
        expect(screen.getByText('Vite')).toBeDefined();
    });

    it('appelle onDelete lors du clic sur la croix', () => {
        const mockDelete = vi.fn();
        render(<TodoItem todo={mockTodo} onDelete={mockDelete} onStatusChange={vi.fn()} />);

        const deleteBtn = screen.getByText('×');
        fireEvent.click(deleteBtn);

        expect(mockDelete).toHaveBeenCalledWith('1');
    });

    it('gère le drag start en mode Kanban', () => {
        const setDataMock = vi.fn();
        render(<TodoItem todo={mockTodo} isKanban={true} onDelete={vi.fn()} onStatusChange={vi.fn()} />);

        const card = screen.getByText('Test Feature').closest('div[draggable="true"]');
        expect(card).toBeDefined();

        fireEvent.dragStart(card, {
            dataTransfer: {
                setData: setDataMock,
                effectAllowed: ''
            },
            stopPropagation: vi.fn()
        });

        expect(setDataMock).toHaveBeenCalledWith('todoId', '1');
        expect(setDataMock).toHaveBeenCalledWith('text/plain', '1');
    });

    it('n’est pas draggable si n’est pas en mode Kanban', () => {
        render(<TodoItem todo={mockTodo} isKanban={false} onDelete={vi.fn()} onStatusChange={vi.fn()} />);
        const titleElement = screen.getByText('Test Feature');
        const container = titleElement.closest('div');
        expect(container.getAttribute('draggable')).not.toBe('true');
    });
});
