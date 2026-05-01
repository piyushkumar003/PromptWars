import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AshokaChakra } from '@/components/AshokaChakra';

describe('AshokaChakra', () => {
  it('renders correctly', () => {
    const { container } = render(<AshokaChakra />);
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom className', () => {
    const { container } = render(<AshokaChakra className="test-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('test-class');
  });
});
