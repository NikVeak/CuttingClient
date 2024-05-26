import React from 'react';
import { render } from '@testing-library/react';
import CanvasDouble from '../component/CanvasDouble';

describe('CanvasDouble', () => {
    it('renders correctly with data', () => {
        const data = [
            [10, 20, 3],
            [15, 25, 2],
            [8, 30, 4]
        ];
        const pieces = 9;
        const height = 100;
        const width = 200;

        const { container } = render(
            <CanvasDouble data={data} pieces={pieces} height={height} width={width} />
        );

        // Assert that the SVG element is rendered correctly
        expect(container.querySelector('.wrapperSquare')).toBeInTheDocument();
        expect(container.querySelector('.square')).toBeInTheDocument();

        // Assert that the rectangles are rendered correctly
        const rectangles = container.querySelectorAll('rect');
        expect(rectangles.length).toBe(9); // Total number of rectangles should match the number of "pieces"

        // You can add more assertions if needed to check the positioning and dimensions of the rectangles

        // ...

    });
});