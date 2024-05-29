import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BeginCutTable from "../component/BeginCutTable";

describe('BeginCutTable Component', () => {
    test('renders table correctly', () => {
        const handleBeginDataChange = jest.fn();
        const { getByText, getByLabelText, getByTestId } = render(<BeginCutTable setInputValueTable={handleBeginDataChange} />);
        expect(getByTestId('addRowBegin')).toBeInTheDocument();
    });

    test('adds a row when "Добавить заготовку" button is clicked', () => {
        const handleBeginDataChange = jest.fn();
        const { getByTestId, getAllByRole } = render(<BeginCutTable setInputValueTable={handleBeginDataChange} />);

        const addButton = getByTestId('addRowBegin');
        fireEvent.click(addButton);

        const rows = getAllByRole('row');
        expect(rows.length).toBe(2); // Including the header row
    });

    test('deletes a row when "X" button is clicked', () => {
        const handleBeginDataChange = jest.fn();
        const { getByTestId, getAllByRole, queryByTestId } =
            render(<BeginCutTable setInputValueTable={handleBeginDataChange} />);

        const addButton = getByTestId('addRowBegin');
        fireEvent.click(addButton);

        const deleteButton = getByTestId('row-1');
        fireEvent.click(deleteButton);

        const rows = getAllByRole('row');
        expect(rows.length).toBe(1); // Only header row left after deletion
        expect(queryByTestId('row-1')).toBeNull(); // Row with id 1 should be deleted
    });
});