import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dashboard } from '../../components/Dashboard';

describe('Dashboard', () => {
    const apps = [
        { status: 'pending' },
        { status: 'pending' },
        { status: 'interview' },
        { status: 'followup' },
        { status: 'accepted' },
        { status: 'rejected' },
    ];

    it('calculates statistics correctly based on applications status', () => {
        render(<Dashboard applications={apps} />);

        expect(screen.getByText('Total Applications').previousSibling).toHaveTextContent('6');
        expect(screen.getByText('Pending').previousSibling).toHaveTextContent('2');
        expect(screen.getByText('Interviewing').previousSibling).toHaveTextContent('1');
        expect(screen.getByText('À relancer').previousSibling).toHaveTextContent('1');
        expect(screen.getByText('Accepted').previousSibling).toHaveTextContent('1');
    });

    it('displays zeroes when there are no applications', () => {
        render(<Dashboard applications={[]} />);

        expect(screen.getByText('Total Applications').previousSibling).toHaveTextContent('0');
        expect(screen.getByText('Pending').previousSibling).toHaveTextContent('0');
    });
});
