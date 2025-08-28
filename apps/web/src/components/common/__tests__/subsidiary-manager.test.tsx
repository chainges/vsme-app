import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SubsidiaryManager from '@/components/common/subsidiary-manager';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Test schema
const testSchema = z.object({
  subsidiaries: z.array(z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    organizationNumber: z.string().min(9, "Organization number must be valid"),
    address: z.string().min(5, "Address must be at least 5 characters"),
  })).optional(),
});

// Test wrapper component
function TestWrapper() {
  const { control, formState: { errors } } = useForm({
    resolver: zodResolver(testSchema),
    defaultValues: {
      subsidiaries: [],
    },
  });

  return <SubsidiaryManager control={control} errors={errors} />;
}

describe('SubsidiaryManager', () => {
  it('renders empty state when no subsidiaries are added', () => {
    render(<TestWrapper />);
    
    expect(screen.getByText('Subsidiaries')).toBeInTheDocument();
    expect(screen.getByText('Add Subsidiary')).toBeInTheDocument();
    expect(screen.getByText('No subsidiaries added yet. Click "Add Subsidiary" to get started.')).toBeInTheDocument();
  });

  it('adds a new subsidiary when "Add Subsidiary" button is clicked', async () => {
    render(<TestWrapper />);
    
    const addButton = screen.getByText('Add Subsidiary');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Subsidiary 1')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter subsidiary company name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('123456789')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Street address, City, Country')).toBeInTheDocument();
    });
  });

  it('allows multiple subsidiaries to be added', async () => {
    render(<TestWrapper />);
    
    const addButton = screen.getByText('Add Subsidiary');
    
    // Add first subsidiary
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText('Subsidiary 1')).toBeInTheDocument();
    });

    // Add second subsidiary
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText('Subsidiary 2')).toBeInTheDocument();
    });

    // Both subsidiaries should be present
    expect(screen.getByText('Subsidiary 1')).toBeInTheDocument();
    expect(screen.getByText('Subsidiary 2')).toBeInTheDocument();
  });

  it('removes a subsidiary when delete button is clicked', async () => {
    render(<TestWrapper />);
    
    const addButton = screen.getByText('Add Subsidiary');
    
    // Add a subsidiary
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText('Subsidiary 1')).toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: '' }); // Trash icon button
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Subsidiary 1')).not.toBeInTheDocument();
      expect(screen.getByText('No subsidiaries added yet. Click "Add Subsidiary" to get started.')).toBeInTheDocument();
    });
  });

  it('displays form fields with correct labels and placeholders', async () => {
    render(<TestWrapper />);
    
    const addButton = screen.getByText('Add Subsidiary');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Company Name')).toBeInTheDocument();
      expect(screen.getByText('Organization Number')).toBeInTheDocument();
      expect(screen.getByText('Registered Address')).toBeInTheDocument();
      
      expect(screen.getByPlaceholderText('Enter subsidiary company name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('123456789')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Street address, City, Country')).toBeInTheDocument();
    });
  });
});