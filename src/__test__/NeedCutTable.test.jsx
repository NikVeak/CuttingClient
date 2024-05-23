import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NeedCutTable from '../component/NeedCutTable';

describe('NeedCutTable Component', () => {
    test('renders table correctly', () => {
        const setTableData = jest.fn();
        const importTableData = [];
        const { getByText, getByLabelText,
            getByTestId } =
            render(<NeedCutTable data={importTableData}  onSetTableData={setTableData} />);
        expect(getByTestId('addRow')).toBeInTheDocument();
    });

    test('adds a row when "Добавить отрезок" button is clicked', () => {
        const setTableData = jest.fn();
        const importTableData = [];
        const { getByTestId, getAllByRole } =
            render(<NeedCutTable data={importTableData}  onSetTableData={setTableData} />);

        const addButton = getByTestId('addRow');
        fireEvent.click(addButton);

        const rows = getAllByRole('row');
        expect(rows.length).toBe(2); // Including the header row
    });

    test('deletes a row when "X" button is clicked', () => {
        const setTableData = jest.fn();
        const importTableData = [];
        const { getByTestId, getAllByRole, queryByTestId } =
            render(<NeedCutTable data={importTableData}  onSetTableData={setTableData} />);

        const addButton = getByTestId('addRow');
        fireEvent.click(addButton);

        const deleteButton = getByTestId('row-1');
        fireEvent.click(deleteButton);

        const rows = getAllByRole('row');
        expect(rows.length).toBe(1); // Only header row left after deletion
        expect(queryByTestId('row-1')).toBeNull(); // Row with id 1 should be deleted
    });
});