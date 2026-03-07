import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { UserProfile } from '../../../components/auth/UserProfile';
import { supabase } from '../../../lib/supabase';

vi.mock('../../../lib/supabase', () => ({
    supabase: {
        auth: {
            updateUser: vi.fn()
        }
    }
}));

describe('UserProfile Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockSession = {
        user: {
            email: 'test@test.com',
            user_metadata: {
                full_name: 'John Doe',
                phone_number: '0612345678'
            }
        }
    };

    test('affiche les informations existantes du profil', () => {
        render(<UserProfile session={mockSession} onClose={vi.fn()} />);

        expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('0612345678')).toBeInTheDocument();
    });

    test('appelle updateUser et affiche un message de succès', async () => {
        supabase.auth.updateUser.mockResolvedValue({ error: null });

        render(<UserProfile session={mockSession} onClose={vi.fn()} />);

        // Changement des valeurs
        fireEvent.change(screen.getByLabelText(/nom complet/i), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0700000000' } });

        // Soumission
        fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

        await waitFor(() => {
            expect(supabase.auth.updateUser).toHaveBeenCalledWith({
                data: {
                    full_name: 'Jane Doe',
                    phone_number: '0700000000'
                }
            });
            expect(screen.getByText(/profil mis à jour avec succès/i)).toBeInTheDocument();
        });
    });

    test('affiche une erreur en cas d\'échec de mise à jour', async () => {
        supabase.auth.updateUser.mockResolvedValue({ error: { message: 'Erreur réseau' } });

        render(<UserProfile session={mockSession} onClose={vi.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

        await waitFor(() => {
            expect(screen.getByText(/erreur réseau/i)).toBeInTheDocument();
        });
    });

    test('ferme le profil au clic sur le bouton fermer', () => {
        const mockOnClose = vi.fn();
        render(<UserProfile session={mockSession} onClose={mockOnClose} />);

        fireEvent.click(screen.getByRole('button', { name: /fermer/i }));
        expect(mockOnClose).toHaveBeenCalled();
    });
});
