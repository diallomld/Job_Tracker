import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApplicationForm } from '../../../components/applications/ApplicationForm';

describe('ApplicationForm', () => {
    it('renders the form with basic fields', () => {
        render(<ApplicationForm onAdd={() => { }} />);
        expect(screen.getByText('Nouvelle Candidature')).toBeInTheDocument();
        expect(screen.getByLabelText(/Entreprise/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Poste/i)).toBeInTheDocument();
    });

    it('requires company and role fields', () => {
        const onAdd = vi.fn();
        render(<ApplicationForm onAdd={onAdd} />);

        fireEvent.click(screen.getByText('Ajouter la candidature'));
        expect(onAdd).not.toHaveBeenCalled();
    });

    it('submits valid data and resets form', () => {
        const onAdd = vi.fn();
        render(<ApplicationForm onAdd={onAdd} />);

        fireEvent.change(screen.getByLabelText(/Entreprise/i), { target: { value: 'Google' } });
        fireEvent.change(screen.getByLabelText(/Poste/i), { target: { value: 'Dev' } });

        fireEvent.click(screen.getByText('Ajouter la candidature'));

        expect(onAdd).toHaveBeenCalledTimes(1);
        expect(onAdd.mock.calls[0][0]).toMatchObject({
            company: 'Google',
            role: 'Dev',
            type: 'CDI',
            status: 'pending'
        });

        // Check reset
        expect(screen.getByLabelText(/Entreprise/i).value).toBe('');
        expect(screen.getByLabelText(/Poste/i).value).toBe('');
    });
});
