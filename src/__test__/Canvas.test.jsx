import Canvas from '../component/Canvas'
import {queryAllByText, queryByTestId, render} from "@testing-library/react";

describe("Canvas component", () => {


    test("renders the correct number of Rectangle components", () => {
        const maps = [
            [1500, 2000, 365],
            [4000, 550, 660],
        ];
        const thickness = 10;
        const angle = 45;
        const { container } = render(<Canvas maps={maps} thickness={thickness} angle={angle}/>);
        const rectangles = container.querySelectorAll(".rectangle");
        expect(rectangles.length).toBe(maps.length);
    });

    test("passes the correct rectangle data to each Rectangle component", () => {
        const maps = [
            [1500, 2000, 365],
            [4000, 550, 660],
        ];
        const thickness = 10;
        const angle = 45;
        const { container } = render(<Canvas maps={maps} thickness={thickness} angle={angle}/>);
        const rectangles = container.querySelectorAll(".rectangle");

        rectangles.forEach((rectangle, index) => {
            const polygon = rectangle.querySelector('polygon[data-testid="polygon"]');
            const text_cut = rectangle.querySelector('text[data-testid="text-cut"]');
            const text_count = rectangle.querySelector('text[data-testid="text-count"]');

            expect(polygon).toBeInTheDocument();
            expect(text_cut).toBeInTheDocument();
            expect(text_count).toBeInTheDocument();
        });
    });

    test("each Rectangle component contains the correct text from maps", () => {
        const maps = [
            [1500, 2000, 365],
            [4000, 550, 660],
        ];
        const thickness = 10;
        const angle = 45;
        const { container } = render(<Canvas maps={maps} thickness={thickness} angle={angle}/>);
        const rectangles = container.querySelectorAll(".rectangle");
        expect(rectangles.length).toBe(maps.length);

        rectangles.forEach((rectangle, index) => {
            const expectedData = maps[index];
            const textElements = rectangle.querySelectorAll('text[data-testid="text"]');

            textElements.forEach((textElement, i) => {
                expect(textElement).toHaveTextContent(expectedData[i].toString());
            });
        });
    });

    test("does not render any Rectangle components", () => {
        const { container } = render(<Canvas maps={[]} thickness={0} angle={0}/>);
        const rectangles = container.querySelectorAll(".rectangle");
        expect(rectangles.length).toBe(0);
    });
});