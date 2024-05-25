import React from 'react';
import { render, screen } from '@testing-library/react';
import Basis from '../component/Basis';
import {act} from "react-dom/test-utils";

describe('Basis component', (object, method) => {
    it('renders the Basis component with header and form', async () => {
        await act(async () => {
            const {container, getByTestId} = render(<Basis />);


        });
    });

});