import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoForm } from '../../components/TodoForm';

describe('TodoForm Component', () => {
    it('rend les champs du formulaire correctement', () => {
        render(<TodoForm onAdd={vi.fn()} />);

        expect(screen.getByPlaceholderText('+ Nouvelle tâche...')).toBeDefined();
        expect(screen.getByDisplayValue('Moyenne')).toBeDefined();
        expect(screen.getByPlaceholderText('Tags...')).toBeDefined();
    });

    it('ajoute des tags avec la touche Entrée', () => {
        render(<TodoForm onAdd={vi.fn()} />);
        const tagInput = screen.getByPlaceholderText('Tags...');

        fireEvent.change(tagInput, { target: { value: 'Urgent' } });
        fireEvent.keyDown(tagInput, { key: 'Enter' });

        expect(screen.getByText('Urgent')).toBeDefined();
        expect(tagInput.value).toBe('');
    });

    it('ajoute des tags avec une virgule', () => {
        render(<TodoForm onAdd={vi.fn()} />);
        const tagInput = screen.getByPlaceholderText('Tags...');

        fireEvent.change(tagInput, { target: { value: 'React,' } });
        fireEvent.keyDown(tagInput, { key: ',' });

        expect(screen.getByText('React')).toBeDefined();
        expect(tagInput.value).toBe('');
    });

    it('supprime un tag en cliquant sur la croix', () => {
        render(<TodoForm onAdd={vi.fn()} />);
        const tagInput = screen.getByPlaceholderText('Tags...');

        fireEvent.change(tagInput, { target: { value: 'Tech' } });
        fireEvent.keyDown(tagInput, { key: 'Enter' });

        const removeBtn = screen.getByText('×');
        fireEvent.click(removeBtn);

        expect(screen.queryByText('Tech')).toBeNull();
    });

    it('appelle onAdd avec les bonnes données lors de la soumission', () => {
        const mockAdd = vi.fn();
        render(<TodoForm onAdd={mockAdd} />);

        const titleInput = screen.getByPlaceholderText('+ Nouvelle tâche...');
        const prioritySelect = screen.getByDisplayValue('Moyenne');
        const tagInput = screen.getByPlaceholderText('Tags...');

        fireEvent.change(titleInput, { target: { value: 'Finir les tests' } });
        fireEvent.change(prioritySelect, { target: { value: 'high' } });

        fireEvent.change(tagInput, { target: { value: 'Jest' } });
        fireEvent.keyDown(tagInput, { key: 'Enter' });

        const submitBtn = screen.getByTitle('Ajouter');
        fireEvent.click(submitBtn);

        expect(mockAdd).toHaveBeenCalledWith({
            title: 'Finir les tests',
            priority: 'high',
            date: null,
            tags: ['Jest'],
            status: 'todo'
        });

        // Vérifie que le formulaire est vidé
        expect(titleInput.value).toBe('');
        expect(screen.queryByText('Jest')).toBeNull();
    });

    it('désactive le bouton si le titre est vide', () => {
        render(<TodoForm onAdd={vi.fn()} />);
        const submitBtn = screen.getByTitle('Ajouter');
        expect(submitBtn.disabled).toBe(true);
    });
});
