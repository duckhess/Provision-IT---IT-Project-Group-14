import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarFilter from './SidebarFilter';
import type { Dataset } from '../../Types/Types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDatasets: Dataset[] = [
  { name: 'Revenue', metric: 'income_statements', unit: '$', data: [] },
  { name: 'Profit', metric: 'income_statements', unit: '$', data: [] },
  { name: 'Liabilities', metric: 'liabilities', unit: '$', data: [] },
];

describe('SidebarFilter Component', () => {
  let selectedKeys: string[] = [];
  const toggleSelection = (key: string) => {
    if (selectedKeys.includes(key)) {
      selectedKeys = selectedKeys.filter(k => k !== key);
    } else {
      selectedKeys.push(key);
    }
  };
  const onClose = vi.fn();

  beforeEach(() => {
    selectedKeys = [];
    vi.clearAllMocks();
  });

  it('renders grouped metrics correctly', () => {
    render(
      <SidebarFilter
        datasets={mockDatasets}
        selectedKeys={selectedKeys}
        toggleSelection={toggleSelection}
        onClose={onClose}
      />
    );

    // Check metric group headings
    expect(screen.getByText('income_statements')).toBeInTheDocument();
    expect(screen.getByText('liabilities')).toBeInTheDocument();

    // Check dataset names
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Profit')).toBeInTheDocument();
    expect(screen.getByText('Liabilities')).toBeInTheDocument();
  });

  it('toggles selection when checkbox is clicked', () => {
    render(
      <SidebarFilter
        datasets={mockDatasets}
        selectedKeys={selectedKeys}
        toggleSelection={toggleSelection}
        onClose={onClose}
      />
    );

    const revenueCheckbox = screen.getByLabelText('Revenue') as HTMLInputElement;
    expect(revenueCheckbox.checked).toBe(false);

    fireEvent.click(revenueCheckbox);
    expect(selectedKeys).toContain('Revenue__income_statements');

    fireEvent.click(revenueCheckbox);
    expect(selectedKeys).not.toContain('Revenue__income_statements');
  });

  it('calls onClose when Generate Graph button is clicked', () => {
    render(
      <SidebarFilter
        datasets={mockDatasets}
        selectedKeys={selectedKeys}
        toggleSelection={toggleSelection}
        onClose={onClose}
      />
    );

    const generateBtn = screen.getByText(/Generate Graph/i);
    fireEvent.click(generateBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
