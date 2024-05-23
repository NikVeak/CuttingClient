import React from 'react';
import { render } from '@testing-library/react';
import Rectangle from '../component/Rectangle';

describe('Rectangle component', () => {
    it('renders rectangles correctly', () => {
        const rectanglesData = [
            {
                x1: 10,
                y1: 20,
                x2: 30,
                y2: 40,
                x3: 50,
                y3: 60,
                x4: 70,
                y4: 80,
                color: 'red',
                text: 'Sample Text',
                count: 5,
            },
        ];

        const { container } = render(<Rectangle rectanglesData={rectanglesData} />);
        const svgElement = container.querySelector('svg');

        expect(svgElement).toBeInTheDocument();
        // Проверяем, что прямоугольник и текст были отрендерены
        const polygonElement = container.querySelector('polygon');
        expect(polygonElement).toBeInTheDocument();

        const textElements = container.querySelectorAll('text');
        expect(textElements.length).toBe(2); // Проверяем, что оба текста отрендерены

    });
});