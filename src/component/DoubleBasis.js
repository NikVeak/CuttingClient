import React, {useState} from "react";
import Header from "./Header";
import axios from "axios";
import CanvasDouble from "./CanvasDouble";

const DoubleBasis = () =>{
    const [inputLength, setInputLength] = useState(0);
    const handleInputLength = (event)=>{
        setInputLength(event.target.value);
    }

    const [inputWidth, setInputWidth] = useState(0);
    const handleInputWidth = (event) =>{
        setInputWidth(event.target.value);
    }

    const [rows, setRows] = useState([]);
    let rectangles = [];
    const countCutsDouble = (event) =>{
        event.preventDefault();
        const cut_lengths = rows.map(row => Number(row.lengths));
        const cut_widths = rows.map(row => Number(row.widths));
        const counts = rows.map(row => Number(row.counts));
        const pieces = [];
        pieces.push(cut_lengths);
        pieces.push(cut_widths);
        pieces.push(counts);
        let transposedPieces = pieces[0].map((col, i) => pieces.map(row => row[i]));

        const cutOptions = {
            'material_height': inputLength,
            'material_width':inputWidth,
            'pieces':transposedPieces,
        };
        console.log(cutOptions);
        try{
            axios.post("http://localhost:8000/bivariate-cut", cutOptions).then(
                response=>{
                    console.log(response);
                    let data = response.data;
                    setResult(data["result_maps"]);
                    console.log(data);
                    setLoading(false);
                }
            )
        }catch (error){
            console.log(error);
        }
    }

    const handleInputChange= (id, field, value) =>{
        const updatedRows = rows.map(row=>{
            if (row.id=== id){
                return {...row, [field]:value};
            }
            return row;
        });
        setRows(updatedRows);
    };
    const addRow = (e) => {
        e.preventDefault();

        setRows(prevRows => [...prevRows, { id: prevRows.length + 1, name: `Row ${prevRows.length + 1}` }]);
    };

    const deleteRow = (id) => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));

    };
    const [result, setResult] = useState([]);

    const [loading, setLoading] = useState(true);

    const [pieces, setPieces] = useState([]);
    return(
        <div data-testid="double-basis">
            <Header/>
            <div className="divBasis">
                <form data-testid="form-input-simple" onSubmit={countCutsDouble}>
                    <div className="begin" data-testid="begin">
                        <ul>
                            <li>
                                <label className="form__label">Длина исходной заготовки (мм)</label>
                            </li>
                            <li>
                                <input placeholder="Длина (мм)" onChange={handleInputLength}
                                       name="original_length"
                                       className="form__input"
                                       type="number"
                                       value={inputLength} min="0"/>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <label className="form__label">Ширина(мм)</label>
                            </li>
                            <li>
                                <input placeholder="Ширина(мм)"
                                       onChange={handleInputWidth}
                                       name="width"
                                       className="form__input"
                                       type="number"
                                       value={inputWidth} min="0"/>
                            </li>
                        </ul>

                        <button className="btnAction" id="countBtnBiv" type="submit">Рассчитать</button>
                    </div>

                </form>
                <div className="wrapperTable" data-testid="need-cut">
                    <div><h5>Ввод нарезаемых заготовок</h5></div>

                    <table className="table" data-testid="table-need">
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Длина заготовки (мм)</th>
                            <th>Ширина заготовки (мм)</th>
                            <th>Количество</th>
                            <th>
                                <button className="" data-testid="addRow" id="addRow" onClick={addRow}>+</button>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map(row => (
                            <tr key={row.id}>
                                <td id="id">
                                    {row.id}
                                </td>
                                <td id="length">
                                    <input className="tableInput" key={row.id}
                                           name="length_cut"
                                           value={row.lengths}
                                           placeholder="Длина"
                                           onChange={(e) =>
                                               handleInputChange(row.id, "lengths", e.target.value)}
                                           type="number" min="0"/>
                                </td>
                                <td id="width">
                                    <input className="tableInput" key={row.id}
                                           name="width_cut"
                                           value={row.widths}
                                           placeholder="Ширина"
                                           onChange={(e) =>
                                               handleInputChange(row.id, "widths", e.target.value)}
                                           type="number" min="0"/>
                                </td>
                                <td id="counts">
                                    <input className="tableInput" key={row.id}
                                           name="length_count"
                                           value={row.counts}
                                           placeholder="Количество"
                                           onChange={(e) =>
                                               handleInputChange(row.id, "counts", e.target.value)}
                                           type="number" min="0"/>
                                </td>
                                <td>
                                    <button style={{
                                        background: "#13a7b9",
                                        outline: "none",
                                        color: "#ffffff",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: ".1em .6em",
                                        fontWeight: "bold",
                                        borderRadius: "15px", fontSize: 20
                                    }} data-testid="row-1" key={row.id} onClick={() => deleteRow(row.id)}>
                                        &mdash;</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="res">
                    {loading ? (<p></p>) : (
                        <div className="res-wrapper">
                            <h3> Вариант раскроя </h3>

                            <p>Подсказка: черным цветом показано использование заготовки, серым остаток</p>

                            <CanvasDouble data={result} pieces={pieces}
                                          height={inputLength} width={inputWidth} />
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}

export default DoubleBasis;