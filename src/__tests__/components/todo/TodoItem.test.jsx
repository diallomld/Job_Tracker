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

    it("n'est pas draggable si n'est pas en mode Kanban", () => {
        render(<TodoItem todo={mockTodo} isKanban={false} onDelete={vi.fn()} onStatusChange={vi.fn()} />);
        const titleElement = screen.getByText('Test Feature');
        const container = titleElement.closest('div');
        expect(container.getAttribute('draggable')).not.toBe('true');
    });

    it('appelle onStatusChange avec done quand la tâche est cochée (list)', () => {
        const onStatusChange = vi.fn();
        render(<TodoItem todo={mockTodo} onDelete={vi.fn()} onStatusChange={onStatusChange} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(onStatusChange).toHaveBeenCalledWith('1', 'done');
    });

    it('appelle onStatusChange avec todo quand done est décochée (list)', () => {
        const onStatusChange = vi.fn();
        const doneTodo = { ...mockTodo, status: 'done' };
        render(<TodoItem todo={doneTodo} onDelete={vi.fn()} onStatusChange={onStatusChange} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(onStatusChange).toHaveBeenCalledWith('1', 'todo');
    });

    it('affiche "-" quand pas de date (list view)', () => {
        const noDateTodo = { ...mockTodo, date: null };
        render(<TodoItem todo={noDateTodo} onDelete={vi.fn()} onStatusChange={vi.fn()} />);
        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('rend en mode Kanban sans date ni tags', () => {
        const minimalTodo = { id: '2', title: 'Simple', priority: 'low', date: null, tags: null, status: 'doing' };
        render(<TodoItem todo={minimalTodo} isKanban={true} onDelete={vi.fn()} onStatusChange={vi.fn()} />);
        expect(screen.getByText('Simple')).toBeInTheDocument();
    });

    it('appelle onStatusChange via checkbox en mode kanban', () => {
        const onStatusChange = vi.fn();
        render(<TodoItem todo={mockTodo} isKanban={true} onDelete={vi.fn()} onStatusChange={onStatusChange} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(onStatusChange).toHaveBeenCalledWith('1', 'done');
    });

    it('rend les tags en mode Kanban', () => {
        render(<TodoItem todo={mockTodo} isKanban={true} onDelete={vi.fn()} onStatusChange={vi.fn()} />);
        expect(screen.getByText('Next.js')).toBeInTheDocument();
        expect(screen.getByText('Vite')).toBeInTheDocument();
    });

    it('rend la date en mode Kanban quand elle existe', () => {
        render(<TodoItem todo={mockTodo} isKanban={true} onDelete={vi.fn()} onStatusChange={vi.fn()} />);
        expect(screen.getByText(/6 mars 2026/i)).toBeInTheDocument();
    });
});
