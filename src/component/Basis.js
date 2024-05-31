import React, {lazy, Suspense, useEffect, useState} from "react";
import axios from 'axios';
import Canvas from "./Canvas";
import Header from "./Header";
import {findAndCountDuplicates,
    transformArray,
    hasZeros,
    hasZeroIn,
    isLessThanAny} from "./helpers/helper"
//const { ipcRenderer } = window.require('electron');
let ipcRenderer;
try {
    const electronWindow = window.require('electron');
    ipcRenderer = electronWindow.ipcRenderer;
} catch (error) {
}

// подгружаем динамические таблици
const NeedCutTable = lazy(()=> import('./NeedCutTable'));
const BeginCutTable = lazy(()=> import('./BeginCutTable'));

// базовый компонент
const Basis = React.memo(function Basis(props){
    // вана коса проверяем занпужены ли данные
    const [isLoadingLocalData, setIsLoadingLocalData] = useState(false);

    // вана коса сохраняем исходные данные
    const [optionCutting, setOptionCut] = useState({});

    // Используем хук для обновления контекста данных между компонентами
    const [headers, setExportData] = useState([]);

    // вана коса результат загружать будем
    const [data, setData] = useState([]);

    // вана коса результат загружать в таблицу будем
    const [tableData, setTableResultData] = useState([]);

    // вана тоса проверка будет загрузились ли результаты
    const [loading, setLoading] = useState(true);

    // вана тоса проверка будет на идет ли процесс вычисления
    const [counting, setCounting] = useState(false);

    // вана коса установка длин заготовок
    const [cuts, setCuts] = useState([]);

    // вана коса ввод исходных материалов
    //-------------------------------------------------------------------------------
    const [inputValue, setInputValue] = useState(0);
    const handleInputChange = (event) => {
        if (event.target.value === ''){
            //setInputValue(0);
        }else{
            setInputValue(event.target.value);
        }

    }
    //-------------------------------------------------------------------------------

    // вана коса установка данных в таблицу с исходными заготовками
    //-------------------------------------------------------------------------------
    const handleBeginDataChange = (inputValueTable)=>{
        setInputValueTable(inputValueTable)
    }
    const [inputValueTable, setInputValueTable] = useState([]);
    //-------------------------------------------------------------------------------

    // вана коса требуемые заготовки загружать будем
    //-------------------------------------------------------------------------------
    const [rows, setTableData] = useState([]);
    // вана коса установка данных в таблицу с требуемыми заготовками
    const handleTableDataChange = (data)=>{
        if (isLoadingLocalData){
            setTableData(data);
        }

    };
    //-------------------------------------------------------------------------------

    // вана коса импортированные данные
    //-------------------------------------------------------------------------------
    const [importTableData, setImportTableData] = useState([]);
    const handleImportData = (data)=>{

        setTableData([]);
        setImportTableData(transformArray(data));
    }
    //-------------------------------------------------------------------------------

    // вана коса установка угла реза
    //-------------------------------------------------------------------------------
    const [angle, setAngle] = useState(0);
    const handleAngle = (event)=>{
        setAngle(event.target.value);
    }
    //-------------------------------------------------------------------------------

    // вана коса установка толщины лезвия
    //-------------------------------------------------------------------------------
    const [blade, setBlade] = useState(0);
    const handleBlade = (event)=>{
        if (event.target.value === ''){
            //setBlade(0);
        }else{
            setBlade(event.target.value);
        }
    }
    //-------------------------------------------------------------------------------


    // вана коса установка толщины заготовки
    //-------------------------------------------------------------------------------
    const [thickness, setThickness] = useState(0);
    const handleThickness = (event)=>{
        if (event.target.value === ''){
            //setThickness(0);
        }else{
            setThickness(event.target.value);
        }

    }
    //-------------------------------------------------------------------------------


    // вана коса установка раскрой с несколькими исходными материалами
    //-------------------------------------------------------------------------------
    const [multiLinear, setMultiLinear] = useState(false);
    const handleMultiLinear = (e) =>{
        setMultiLinear(e.target.checked);
    }
    //-------------------------------------------------------------------------------


    // сохранение локальных данных
    useEffect(() => {
        if (isLoadingLocalData){
            let localData = [];
            localData.splice(0, localData.length);
            localData.push({"inputValue": inputValue});
            localData.push({"angle": angle});
            localData.push({"blade": blade});
            localData.push({"thickness": thickness});
            localData.push({"rows": rows});
            setOptionCut(localData);
            console.log(localData)
        }

    }, [inputValue, angle, blade, thickness, rows]);

    useEffect(()=>{
        if (ipcRenderer !== undefined){
            ipcRenderer.send('load-data');
            ipcRenderer.on('data-loaded', (event, load_data)=>{
                if (load_data.length === 0){
                    setIsLoadingLocalData(true);
                }else{
                    console.log(load_data);
                    setInputValue(load_data[0].inputValue);
                    setBlade(load_data[2].blade);
                    setAngle(load_data[1].angle);
                    setThickness(load_data[3].thickness);
                    setImportTableData(load_data[4].rows);
                    setIsLoadingLocalData(true);
                    console.log(importTableData);
                }
            });
            return () => {
                ipcRenderer.removeAllListeners('data-loaded');
            };
        }
    }, [isLoadingLocalData]);


    // создание результата-таблицы заголовков
    const renderTableHeader = () => {
        if (cuts.length === 0) {
            return null;
        }
        return (
            <tr>
                {cuts.map((column, index) => {
                    return <th key={index}>{column}</th>;
                })}
                <th>Остаток</th>
                <th>Количество заготовок</th>
            </tr>
        );
    };

    // создание результата-таблицы данных
    const renderTableData = (data) => {
        if (data.length === 0) {
            return <tr><td colSpan="3">Нет данных</td></tr>;
        }

        const columns = Object.keys(data[0]);

        return data.map((item, index) => {
            return (
                <tr key={index}>
                    {
                        columns.map((column, columnIndex) => {

                            return <td key={columnIndex}>{item[column]}</td>;
                        })}

                </tr>
            );
        });
    };
    // линейный раскрой с одним исходным материалом
    const countCutsLinear = (event) => {
        event.preventDefault();
        setLoading(true);
        if(multiLinear){
            try {
                const cut_lengths = rows.map(row => Number(row.cuts));
                const counts = rows.map(row => Number(row.counts));
                const input_values = inputValueTable.map(row=>
                    Number(row.cuts));

                if (cut_lengths.length === 0 || counts.length === 0){
                    ipcRenderer.send(
                        "uncorrect-enter", {
                            "type": 1,
                            "message": "Не введены заготовки или их количества !"
                        });
                    return;
                }else if (cut_lengths.length !== counts.length) {
                    ipcRenderer.send("uncorrect-enter", {
                        "type": 1,
                        "message": "Количество заготовок и их количества не совпдают !"
                    });
                    return;
                }else if (blade > 5){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Толщина лезвия не может быть больше 5 мм !"});
                    return;
                }else if (angle !== 0 && angle !== '0' && (thickness === 0 || thickness === '')){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "При угле реза, отличным от нуля, требуется ввод толщины заготовки !"});
                    return;
                }else if (hasZeros(cut_lengths) || hasZeros(counts) || hasZeroIn(cut_lengths) || hasZeroIn(counts)){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Длины или количества заготовок содержат нули !"});
                    return;
                }else if (thickness > 100){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Ограничение по толщине заготовки ! (Не больше 100 мм)"});
                    return;
                }else if (hasZeros(input_values) || hasZeroIn(input_values)){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Исходные заготовки не могут быть равны 0"});
                    return;
                }
                const cutOptions = {
                    'originals_length': input_values,
                    'cut_length':cut_lengths,
                    'cut_count':counts,
                    'blade_thickness':blade,
                    'cutting_angle':angle,
                    'original_thickness':thickness
                };
                setCounting(true);
                let result_data_draw;
                let result_data_table;
                let headers = [];
                console.log(cutOptions)
                axios.post('http://localhost:8000/linear-multi-cut', cutOptions)
                    .then(response=>{
                        console.log(response.data)
                        result_data_draw = response.data["result_maps"];
                        result_data_table = response.data["maps"];
                        setCuts(cut_lengths);
                        for (let i = 0; i < cut_lengths.length; i++){
                            headers.push(cut_lengths[i].toString());
                        }
                        headers.push("Остаток");
                        headers.push("Количество заготовок")
                        setExportData(headers);
                        setTableResultData(findAndCountDuplicates(result_data_table));
                        setData(result_data_draw);
                        setLoading(false);
                        setCounting(false);
                    }).catch(error=>{
                    console.error(error);
                });

            } catch (e) {
                console.error('Error send', e);
            }
        }else{
            try {
                const cut_lengths = rows.map(row => Number(row.cuts));
                const counts = rows.map(row => Number(row.counts));

                if (cut_lengths.length === 0 || counts.length === 0){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Не введены заготовки или их количества !"});
                    return;
                }else if (cut_lengths.length !== counts.length){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Количество заготовок и их количества не совпдают !"});
                    return;
                }else if (isLessThanAny(inputValue, cut_lengths)){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Одна из заготовок больше чем исходная заготовка!"});
                    return;
                }else if (blade > 5){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Толщина лезвия не может быть больше 5 мм !"});
                    return;
                }else if (angle !== 0 && angle !== '0' && (thickness === 0 || thickness === '')){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "При угле реза, отличным от нуля, требуется ввод толщины заготовки !"});
                    return;
                }else if (hasZeros(cut_lengths) || hasZeros(counts) || hasZeroIn(cut_lengths) || hasZeroIn(counts)){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Длины или количества заготовок содержат нули !"});
                    return;
                }else if (thickness > 100){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Ограничение по толщине заготовки ! (Не больше 100 мм)"});
                    return;
                }else if (inputValue === 0 || inputValue === ''){
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Исходная заготовка не может быть равна 0"});
                    return;
                }



                const cutOptions = {
                    'original_length': inputValue,
                    'cut_length':cut_lengths,
                    'cut_count':counts,
                    'blade_thickness':blade,
                    'cutting_angle':angle,
                    'original_thickness':thickness
                };
                setCounting(true);
                let result_data_draw;
                let result_data_table;
                let headers = [];
                axios.post('http://localhost:8000/linear-cut/', cutOptions, {timeout: 5000 })
                    .then(response=>{
                        console.log(response.data)
                        result_data_draw = response.data["result_maps"];
                        result_data_table = response.data["maps"];
                        if (result_data_draw.length === 0)
                        {
                            axios.post('http://localhost:8000/linear-cut-dynamic', cutOptions, {timeout: 5000 }).then(
                                response=>{
                                    result_data_draw = response.data["result_maps"];
                                    result_data_table = response.data["maps"];
                                    setCuts(cut_lengths);
                                    setData(result_data_draw);
                                    for (let i = 0; i < cut_lengths.length; i++){
                                        headers.push(cut_lengths[i].toString());
                                    }
                                    headers.push("Остаток");
                                    headers.push("Количество заготовок")
                                    setExportData(headers);
                                    setTableResultData(findAndCountDuplicates(result_data_table));
                                    setLoading(false);
                                    setCounting(false);
                                }
                            ).catch(error=>{
                                console.log(error);
                                setLoading(false);
                                ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Ошибка ! Неверные входные данные !"});
                                return 1;
                            })
                        }else{
                            setCuts(cut_lengths);
                            for (let i = 0; i < cut_lengths.length; i++){
                                headers.push(cut_lengths[i].toString());
                            }
                            headers.push("Остаток");
                            headers.push("Количество заготовок")
                            setExportData(headers);
                            setTableResultData(findAndCountDuplicates(result_data_table));
                            setData(result_data_draw);
                            setLoading(false);
                            setCounting(false);
                        }
                    }).catch(error=>{
                    console.error(error);
                    setLoading(false);
                    ipcRenderer.send("uncorrect-enter", {"type": 1, "message": "Ошибка ! Неверные входные данные !"});
                    return 1;
                });

            } catch (e) {
                console.error('Error send', e);
            }
        }
    };

    return(
        <div data-testid="basis-component">
            <Header exportTable={tableData} headers={headers} cuttingOption={optionCutting}
                    onImportData={handleImportData}/>
            <div className="divBasis" data-testid="basis">
                <label className="toggle">
                    <input  className="toggle-checkbox" type="checkbox" checked={multiLinear}
                           onChange={handleMultiLinear}/>
                    <div className="toggle-switch" data-testid="toggle"></div>
                    <span className="toggle-label">Несколько исходных заготовок</span>
                </label>
                {multiLinear ? (<form data-testid="form-input-multi" onSubmit={countCutsLinear}>
                    <div className="begin">

                        <ul>
                            <li>
                                <label className="form__label">Толщина лезвия(мм)</label>
                            </li>
                            <li>
                                <input placeholder="Толщина лезвия(мм)" onChange={handleBlade}
                                       name="blade"
                                       className="form__input" type="number" value={blade} min="0"/>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <label className="form__label">Толщина исходной заготовки(мм)</label>
                            </li>
                            <li>
                                <input placeholder="Толщина исходной заготовки(мм)"
                                       onChange={handleThickness}
                                       name="thickness"
                                       className="form__input"
                                       type="number" value={thickness}
                                       min="0"/>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <label className="form__label">Угол реза</label>
                            </li>
                            <li>
                                <div className="select-container">
                                    <select className="selectAngle" value={angle} onChange={handleAngle}>
                                        {/* Опции для выбора */}
                                        <option value="0">0</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                        <option value="60">60</option>
                                    </select>
                                </div>
                            </li>
                        </ul>
                        <button className="btnAction" id="countBtnMulti" type="submit">Рассчитать</button>

                    </div>
                    <Suspense fallback={<div>Загрузка...</div>}>
                        <BeginCutTable setInputValueTable={handleBeginDataChange}/>
                    </Suspense>
                    <Suspense fallback={<div>Загрузка...</div>}>
                        <NeedCutTable data={importTableData} onSetTableData={handleTableDataChange}/>
                    </Suspense>


                </form>) : (<form data-testid="form-input-simple" onSubmit={countCutsLinear}>
                    <div className="begin">
                        <ul>
                            <li>
                                <label className="form__label">Длина исходной заготовки (мм)</label>
                            </li>
                            <li>
                                <input placeholder="Длина (мм)" onChange={handleInputChange}
                                       name="original_length"
                                       className="form__input"
                                       type="number"
                                       value={inputValue} min="0"/>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <label className="form__label">Толщина лезвия(мм)</label>
                            </li>
                            <li>
                                <input placeholder="Толщина лезвия(мм)"
                                       onChange={handleBlade}
                                       name="blade"
                                       className="form__input"
                                       type="number"
                                       value={blade} min="0"/>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <label className="form__label">Толщина исходной заготовки(мм)</label>
                            </li>
                            <li>
                                <input placeholder="Толщина исходной заготовки(мм)"
                                       onChange={handleThickness}
                                       name="thickness" className="form__input"
                                       type="number" value={thickness}
                                       min="0"/>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <label className="form__label">Угол реза</label>
                            </li>
                            <li>
                                <div className="select-container">
                                    <select className="selectAngle" value={angle} onChange={handleAngle}>
                                        {/* Опции для выбора */}
                                        <option value="0">0</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                        <option value="60">60</option>
                                    </select>
                                </div>
                            </li>
                        </ul>
                        <button className="btnAction" id="countBtn" type="submit">Рассчитать</button>
                    </div>
                    <Suspense fallback={<div>Загрузка...</div>}>
                        <NeedCutTable data={importTableData} onSetTableData={handleTableDataChange}/>
                    </Suspense>
                </form>)}
                {counting ? (
                    <div className="wrapperLoader">
                        <div className="loader">
                            <div className="inner one"></div>
                            <div className="inner two"></div>
                            <div className="inner three"></div>
                        </div>
                    </div>

                ) : (<p></p>)}
                <div className="res">
                    {loading ? (<p></p>) : (
                        <div className="res-wrapper" data-testid="res">
                            <h3> Вариант раскроя </h3>
                            <table className="resultTable">
                                <thead>
                                {renderTableHeader()}
                                </thead>
                                <tbody>
                                {renderTableData(tableData)}
                                </tbody>
                            </table>
                            <p>Подсказка: черным цветом показано использование заготовки, серым остаток</p>
                            <Canvas maps={data} thickness={thickness} angle={angle}/>
                            <div className="padd"></div>

                        </div>
                    )}
                </div>
            </div>

        </div>

    );
});
export default Basis;
