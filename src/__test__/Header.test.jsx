import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Header from '../component/Header';
import {ipcRenderer} from "../__mocks__/electron";

describe('Header component', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('renders correctly', () => {
        const events = {};
        const onSpy = jest.spyOn(ipcRenderer, 'on').mockImplementation((event, handler) => {
            events[event] = handler;
        });
        const sendSpy = jest.spyOn(ipcRenderer, 'send').mockImplementation((event, data) => {
            events[event](event, data);
        });
        const { getByTestId } = render(<Header />);
        expect(getByTestId('header')).toBeInTheDocument();
    });

    it('handles export button click', () => {
        const mockExportTable = [[1, 2, 3], [4, 5, 6]];
        const mockHeaders = ['Header1', 'Header2', 'Header3'];
        const mockEvent = { preventDefault: jest.fn() };

        const { getByText } = render(<Header exportTable={mockExportTable} headers={mockHeaders} />);

        // Simulate the click on the export button
        fireEvent.click(getByText('Экспорт в Excel'));

        // Add your expectations here based on what should happen when export button is clicked
    });

    it('opens history cuts', () => {
        const ipcRendererMock = {
            send: jest.fn(),
        };
        window.require = jest.fn().mockReturnValue({ electron: { ipcRenderer: ipcRendererMock } });
        const { getByText } = render(<Header />);

    });
});