import React, {useState} from "react";
import * as XLSX from "xlsx";
import {Link} from "react-router-dom";
//const { ipcRenderer } = window.require('electron');
let ipcRenderer;
try {
    const electronWindow = window.require('electron');
    ipcRenderer = electronWindow.ipcRenderer;
} catch (error) {
    // Handle the error here, e.g., log it or display a message

}

const Header = React.memo(function Header({exportTable, headers, cuttingOption, onImportData}) {
    const handleExportExcel = () => {
        console.log(headers);

        const newData = [headers, ...exportTable]

        console.log(newData);
        const worksheet = XLSX.utils.json_to_sheet(newData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        // Get current date and time
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        const timeString = currentDate.toTimeString().split(' ')[0].replace(/:/g, '');


        // Construct file name with date and time
        const fileName = `cuts_data_${dateString}_${timeString}.xlsx`;
        // Создаем файл Excel
        XLSX.writeFile(workbook, fileName);
    }

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, {type: 'binary'});
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, {header: 1});
            onImportData(data);
            console.log(data);
        };
        reader.readAsBinaryString(file)
    }

    const handleOpenMemo = () => {
        ipcRenderer.send('open-memo');
    }

    const handleExitApp = () => {
        console.log(cuttingOption);
        ipcRenderer.send('exit-app', cuttingOption);
    }

    const handleOpenHistoryCuts = () => {
        ipcRenderer.send('open-history-cuts');
    }

    return (
        <header data-testid="header">
            <div className="menu">
                <ul>
                    <li>
                        <a className="menu-caret" href="#">Меню</a>
                        <ul>
                            <li>
                                <label>
                                    <Link to="/">
                                        Линейный раскрой
                                    </Link>
                                </label>
                            </li>
                            <li>

                                <label>
                                    <Link to="/double">
                                        Двумерный раскрой
                                    </Link>
                                </label>
                            </li>
                            <li>
                                <button className="buttonActive" onClick={handleExitApp}>
                                    Выход
                                </button>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a className="menu-caret"
                           href="#">Инструменты</a>
                        <ul data-testid="inpFile">
                            <li>
                                <button className="buttonActive" data-testid="openHistory" onClick={handleOpenHistoryCuts}>
                                    История раскроя
                                </button>
                            </li>
                            <li>
                                <button className="buttonActive" onClick={handleExportExcel}>
                                    Экспорт в Excel
                                </button>
                            </li>
                            <li>
                                <label className="input-file">
                                    <input type="file"  name="file" onChange={handleImportExcel}/>
                                    <span>Импорт из Excel</span>
                                </label>
                            </li>
                            <li>
                                <button className="buttonActive">Печать</button>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a className="menu-caret"
                           href="#">Справка</a>
                        <ul>
                            <li>
                                <button className="buttonActive" onClick={handleOpenMemo}>
                                    О программе
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    );
});

export default Header;
