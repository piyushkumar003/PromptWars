import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock scrollTo as it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.crypto.randomUUID = vi.fn(() => 'test-uuid');

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
