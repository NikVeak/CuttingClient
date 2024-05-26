import React from "react";
import rectangle from "./Rectangle";

const CanvasDouble = ({data, pieces, height, width}) =>{

    let x = 0;
    let y = 0;
    const padding = 5; // Отступ между прямоугольниками

    console.log(data)
    const rectangles = data.map(([height, width, count], index) => {
        const elements = [];
        for (let i = 0; i < count; i++) {
            elements.push(<rect key={index + "-" + i} x={x} y={y} width={width/10 } height={height/10 } fill="lightblue" />);
            x += (width/10)+ padding; // Увеличиваем координату x для следующего прямоугольника
        }
        x = 0; // Сбрасываем координату x для новой строки
        y += (height/10) + padding; // Переходим на новую строку
        return elements;
    });

    return(
        <div className="wrapperSquare">
            <svg width={width/10+padding} height={height/10+padding} className="square">
                {rectangles}
            </svg>
        </div>
);
}

export default CanvasDouble;