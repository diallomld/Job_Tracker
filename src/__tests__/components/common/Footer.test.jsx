import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Footer } from '../../../components/common/Footer';

describe('Footer Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders newsletter section', () => {
        render(<Footer />);
        expect(screen.getByText(/Newsletter Horizon Teck/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/votre@email.com/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /s'abonner/i })).toBeInTheDocument();
    });

    it('renders current year in copyright', () => {
        render(<Footer />);
        const year = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    });

    it('does not submit when email is empty', () => {
        render(<Footer />);
        const btn = screen.getByRole('button', { name: /s'abonner/i });
        fireEvent.click(btn);
        expect(screen.queryByText(/Merci de votre inscription/i)).not.toBeInTheDocument();
    });

    it('shows loading then success after subscribing', async () => {
        render(<Footer />);
        const input = screen.getByPlaceholderText(/votre@email.com/i);
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.submit(input.closest('form'));

        // After submit, loading state
        expect(screen.getByText('...')).toBeInTheDocument();

        // Advance 1s timer → subscribed
        await act(async () => { vi.advanceTimersByTime(1000); });
        expect(screen.getByText(/Merci de votre inscription/i)).toBeInTheDocument();
        expect(screen.getByText('✓')).toBeInTheDocument();

        // Advance 5s timer → reset
        await act(async () => { vi.advanceTimersByTime(5000); });
        expect(screen.queryByText(/Merci de votre inscription/i)).not.toBeInTheDocument();
    });

    it('updates email input value on change', () => {
        render(<Footer />);
        const input = screen.getByPlaceholderText(/votre@email.com/i);
        fireEvent.change(input, { target: { value: 'hello@test.com' } });
        expect(input.value).toBe('hello@test.com');
    });
});
