import React from "react"
import Rectangle from "./Rectangle";
import {findAndCountDuplicates} from "./helpers/helper"

const Canvas = ({maps, thickness, angle}) => {

    let new_thickness = thickness / 3 +20;
    let angle_rad = (3.14 * angle) / 180
    let cutting = thickness/3 * (Math.tan(angle_rad));

    let modifier_maps = findAndCountDuplicates(maps);
    let maps_svg = [];
    let count = "";
    for (let i = 0; i < modifier_maps.length; i++){
        let cut = {};
        let x = 0;
        let mappa = [];
        let color = '#41403f';
        let text = '';
        let remain = "";
        //y += spacing;
        for (let j = 0; j < modifier_maps[i].length; j++) {
            text = modifier_maps[i][j];
            if (j === modifier_maps[i].length - 2) {
                color = 'grey';
                remain = modifier_maps[i][j];
            }

            if (j === modifier_maps[i].length - 1)
            {
                count = "Нарезать: " + modifier_maps[i][j] + " раз(а)";
                text = "";
                cut = {
                    x1: x, y1: 40,
                    x2:x + modifier_maps[i][j]/3, y2:40,
                    x3:x + modifier_maps[i][j]/3 - 2*cutting, y3: 40+new_thickness,
                    x4:x + 2*cutting, y4: 40+new_thickness,
                    remain:remain,
                    count: count,
                    text:text,
                    color:color
                }
            }
            if (j === 0){
                x = 10;
            }else{
                x += (modifier_maps[i][j-1])/3+15
            }
            if (j % 2 === 0  && j !== modifier_maps[i].length - 1)
            {
                cut = {
                    x1: x, y1: 40,
                    x2:x + modifier_maps[i][j]/3, y2:40,
                    x3:x + modifier_maps[i][j]/3 - 2*cutting, y3: 40+new_thickness,
                    x4:x + 2*cutting, y4: 40+new_thickness,
                    remain:remain,
                    count: count,
                    text:text,
                    color:color
                }
            }
            if (j % 2 !== 0  && j !== modifier_maps[i].length - 1){
                cut = {
                    x1: x, y1: 40,
                    x2: x + modifier_maps[i][j]/3 - 4*cutting, y2: 40,
                    x3:x + modifier_maps[i][j]/3 -2*cutting, y3: 40+new_thickness,
                    x4: x-2*cutting, y4:40+new_thickness,
                    count: count,
                    remain:remain,
                    text:text,
                    color:color
                }
            }

            mappa.push(cut);
        }
        maps_svg.push(mappa);
        count = "";
        remain = "";
    }
    //console.log(maps_svg[0]);
    return(
        <div className='canvas'>
            {maps_svg.map((map, index)=> {
                return(
                    <Rectangle data-testid="rectangle" key={index} rectanglesData={map}/>
                )
            })}
        </div>
    )
}
export default Canvas;