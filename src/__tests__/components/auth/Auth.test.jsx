import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Auth } from '../../../components/auth/Auth';
import { supabase } from '../../../lib/supabase';

vi.mock('../../../lib/supabase', () => ({
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

    test("bascule vers le formulaire d'inscription", () => {
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

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByRole('button', { name: /se connecter/i }).closest('form'));

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
            expect(mockOnAuthSuccess).toHaveBeenCalledWith({ access_token: '123' });
        });
    });

    test("appelle signUp avec les metadata lors de l'inscription (auto-login)", async () => {
        const mockOnAuthSuccess = vi.fn();
        supabase.auth.signUp.mockResolvedValue({
            data: { session: { access_token: '123' }, user: { identities: [{}] } },
            error: null
        });

        render(<Auth onAuthSuccess={mockOnAuthSuccess} />);
        fireEvent.click(screen.getByText(/pas encore de compte \? s'inscrire/i));

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@test.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'newpass' } });
        fireEvent.change(screen.getByLabelText(/nom complet/i), { target: { value: 'Jean Dupont' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0600000000' } });
        fireEvent.submit(screen.getByRole('button', { name: /s'inscrire/i }).closest('form'));

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'new@test.com',
                password: 'newpass',
                options: { emailRedirectTo: expect.any(String), data: { full_name: 'Jean Dupont', phone_number: '0600000000' } }
            });
            expect(mockOnAuthSuccess).toHaveBeenCalledWith({ access_token: '123' });
        });
    });

    test("appelle resetPasswordForEmail lors de l'oubli de mot de passe", async () => {
        supabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

        render(<Auth onAuthSuccess={vi.fn()} />);
        fireEvent.click(screen.getByText(/mot de passe oublié \?/i));
        expect(screen.getByRole('heading', { name: /réinitialisation/i })).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'reset@test.com' } });
        fireEvent.click(screen.getByRole('button', { name: /envoyer lien/i }));

        await waitFor(() => {
            expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('reset@test.com', { redirectTo: expect.stringContaining('/reset-password') });
            expect(screen.getByText(/email de réinitialisation envoyé/i)).toBeInTheDocument();
        });
    });

    test("affiche un message d'erreur lors d'un échec de connexion", async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({ data: {}, error: { message: 'Invalid credentials' } });

        render(<Auth onAuthSuccess={vi.fn()} />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad@test.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'wrong' } });
        fireEvent.submit(screen.getByRole('button', { name: /se connecter/i }).closest('form'));

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    test("affiche un message quand inscription nécessite confirmation email", async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { session: null, user: { identities: [{}] } },
            error: null
        });

        render(<Auth onAuthSuccess={vi.fn()} />);
        fireEvent.click(screen.getByText(/pas encore de compte \? s'inscrire/i));
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'confirm@test.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'pass123' } });
        fireEvent.submit(screen.getByRole('button', { name: /s'inscrire/i }).closest('form'));

        await waitFor(() => {
            expect(screen.getByText(/inscription réussie/i)).toBeInTheDocument();
        });
    });

    test("bascule depuis le mode mot de passe oublié avec le bouton retour", () => {
        render(<Auth onAuthSuccess={vi.fn()} />);
        // Ouvrir forgot password
        fireEvent.click(screen.getByText(/mot de passe oublié \?/i));
        expect(screen.getByRole('heading', { name: /réinitialisation/i })).toBeInTheDocument();

        // Retour à la connexion via le bouton toggle
        fireEvent.click(screen.getByText(/retour à la connexion/i));
        expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
    });

    test("bascule depuis inscription vers connexion", () => {
        render(<Auth onAuthSuccess={vi.fn()} />);
        fireEvent.click(screen.getByText(/pas encore de compte \? s'inscrire/i));
        expect(screen.getByRole('heading', { name: /inscription/i })).toBeInTheDocument();

        fireEvent.click(screen.getByText(/déjà un compte \? se connecter/i));
        expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
    });

    test("affiche erreur si utilisateur existe déjà lors de l'inscription", async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { identities: [] } },
            error: null
        });

        render(<Auth onAuthSuccess={vi.fn()} />);
        fireEvent.click(screen.getByText(/pas encore de compte \? s'inscrire/i));
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@test.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'pass123' } });
        fireEvent.submit(screen.getByRole('button', { name: /s'inscrire/i }).closest('form'));

        await waitFor(() => {
            expect(screen.getByText(/cet utilisateur existe déjà/i)).toBeInTheDocument();
        });
    });
});
