import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

describe('useLocalStorage', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('should return initial value when storage is empty', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
        expect(result.current[0]).toBe('initial');
    });

    it('should return stored value when it exists', () => {
        window.localStorage.setItem('test-key', JSON.stringify('stored-value'));
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
        expect(result.current[0]).toBe('stored-value');
    });

    it('should update value and localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

        act(() => {
            result.current[1]('new-value');
        });

        expect(result.current[0]).toBe('new-value');
        expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    });

    it('should support function updater (like useState setter)', () => {
        const { result } = renderHook(() => useLocalStorage('count-key', 10));

        act(() => {
            result.current[1]((prev) => prev + 5);
        });

        expect(result.current[0]).toBe(15);
        expect(window.localStorage.getItem('count-key')).toBe(JSON.stringify(15));
    });

    it('should return initialValue on localStorage read error', () => {
        const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
            throw new Error('Storage error');
        });

        const { result } = renderHook(() => useLocalStorage('error-key', 'fallback'));
        expect(result.current[0]).toBe('fallback');
        spy.mockRestore();
    });

    it('should handle localStorage setItem error gracefully', () => {
        const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
            throw new Error('Storage full');
        });

        const { result } = renderHook(() => useLocalStorage('error-key', 'initial'));
        // Should not throw
        act(() => {
            result.current[1]('new-value');
        });
        spy.mockRestore();
    });
});
