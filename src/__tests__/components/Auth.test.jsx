import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Auth } from '../../components/Auth';
import { supabase } from '../../lib/supabase';

// Mock du client Supabase
vi.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
            resetPasswordForEmail: vi.fn()
        }
    }
}));

describe('Auth Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('affiche le formulaire de connexion initialement', () => {
        render(<Auth onAuthSuccess={vi.fn()} />);
        expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    test('bascule vers le formulaire d\'inscription', () => {
        render(<Auth onAuthSuccess={vi.fn()} />);
        const switchBtn = screen.getByText(/pas encore de compte \? s'inscrire/i);
        fireEvent.click(switchBtn);

        expect(screen.getByRole('heading', { name: /inscription/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();
    });

    test('appelle signInWithPassword lors de la connexion', async () => {
        const mockOnAuthSuccess = vi.fn();
        supabase.auth.signInWithPassword.mockResolvedValue({ data: { session: { access_token: '123' }, user: {} }, error: null });

        render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

        // Remplissage du formulaire
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

        // Soumission
        fireEvent.submit(screen.getByRole('button', { name: /se connecter/i }).closest('form'));

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@test.com',
                password: 'password123'
            });
            expect(mockOnAuthSuccess).toHaveBeenCalledWith({ access_token: '123' });
        });
    });

    test('appelle signUp avec les metadata lors de l\'inscription', async () => {
        const mockOnAuthSuccess = vi.fn();
        supabase.auth.signUp.mockResolvedValue({
            data: { session: { access_token: '123' }, user: { identities: [{}] } },
            error: null
        });

        render(<Auth onAuthSuccess={mockOnAuthSuccess} />);

        // Bascule en mode inscription
        fireEvent.click(screen.getByText(/pas encore de compte \? s'inscrire/i));

        // Remplissage
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@test.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'newpass' } });
        fireEvent.change(screen.getByLabelText(/nom complet/i), { target: { value: 'Jean Dupont' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0600000000' } });

        // Soumission
        fireEvent.submit(screen.getByRole('button', { name: /s'inscrire/i }).closest('form'));

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'new@test.com',
                password: 'newpass',
                options: {
                    emailRedirectTo: expect.any(String),
                    data: {
                        full_name: 'Jean Dupont',
                        phone_number: '0600000000'
                    }
                }
            });
            expect(mockOnAuthSuccess).toHaveBeenCalledWith({ access_token: '123' });
        });
    });

    test('appelle resetPasswordForEmail lors de l\'oubli de mot de passe', async () => {
        supabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

        render(<Auth onAuthSuccess={vi.fn()} />);

        // Ouvre le mode mot de passe oublié
        fireEvent.click(screen.getByText(/mot de passe oublié \?/i));

        expect(screen.getByRole('heading', { name: /réinitialisation/i })).toBeInTheDocument();

        // Remplissage
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'reset@test.com' } });

        // Soumission
        fireEvent.click(screen.getByRole('button', { name: /envoyer lien/i }));

        await waitFor(() => {
            expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
                'reset@test.com',
                { redirectTo: expect.stringContaining('/reset-password') }
            );
            expect(screen.getByText(/email de réinitialisation envoyé/i)).toBeInTheDocument();
        });
    });
});
