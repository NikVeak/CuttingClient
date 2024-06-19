import React from "react"

const Rectangle = ({rectanglesData}) => {
    return (
        <svg width="2500" height="120" className="rectangle">
            {rectanglesData.map((rectangle, index) => (
                <g key={index} className="all-rect">


                    <polygon
                        key={index}
                        points={
                            `
                                    ${rectangle.x1},
                                    ${rectangle.y1}
                                    ${rectangle.x2}
                                    ${rectangle.y2}
                                    ${rectangle.x3},
                                    ${rectangle.y3}
                                    ${rectangle.x4}
                                    ${rectangle.y4}
                            `
                        }
                        fill={rectangle.color}
                        stroke="black"  // цвет обводки
                        strokeWidth="2"  // толщина обводки
                        data-testid="polygon"
                    />

                    <text
                        x={(rectangle.x1 + rectangle.x2 + rectangle.x3 + rectangle.x4) / 4}  // центр трапеции по оси x
                        y={rectangle.y1 + 55}  // координата y над трапецией
                        textAnchor="middle"  // выравнивание текста по центру
                        transform={`rotate(-90 ${(rectangle.x1 + rectangle.x2 + rectangle.x3 + rectangle.x4) / 4},${rectangle.y1 + 55})`}  // поворот текста на 90 градусов
                        fill="black"
                        fontWeight="bold"// цвет текста
                        fontSize="14"  // размер шрифта
                        data-testid="text-cut"
                    >{rectangle.text}</text>
                    <text
                        x="100"  // центр трапеции по оси x
                        y="20" // координата y над трапецией
                        textAnchor="middle"  // выравнивание текста по центру
                        fill="black"
                        fontWeight="bold"// цвет текста
                        fontSize="14"
                        data-testid="text-count"
                    >
                        {rectangle.count}
                    </text>
                </g>
                ))}
        </svg>

    );
}
export default Rectangle;
