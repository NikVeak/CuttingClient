// -----------------------------------------------------------------------------
const { app, BrowserWindow,dialog,Menu, ipcMain, nativeTheme} = require('electron');
const path = require("path");
const url = require("url");
const fs = require('fs');
const iconv = require('iconv-lite'); // Подключаем библиотеку для работы с кодировками
const { exec } = require('child_process');
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
let mainWindow;
let loadingWindow;
let windows = [];

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
let exeProcess;
const logFilePath = path.join(__dirname, 'server.log');
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
function killProcess(processName) {
    exec(`taskkill /F /IM ${processName}`, (err, stdout, stderr) => {
        if (err) {
            fs.appendFile('errors.log', `Ошибка убийства дочерного процесса: ${err}\n`, (err) => {
                if (err) throw err;
            });
        }
        if (stderr) {
            fs.appendFile('errors.log', `Дочерний процесс вернул ошибку: ${stderr}\n`, (err) => {
                if (err) throw err;
            });
        }
    });
}
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
function clearLogFile() {
    fs.writeFile(logFilePath, '', (err) => {
        if (err) {
            console.error('Ошибка при очистке файла логирования:', err);
        } else {
            console.log('Файл логирования успешно очищен.');
        }
    });
}
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------


function startServerService()
{
    const pathToExeFile = 'server/dist/main.exe';
    const exePath = path.join(__dirname, pathToExeFile);
    exeProcess = exec(exePath, { encoding: 'utf-8' }, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        const decodedOutput = iconv.decode(Buffer.from(stdout, 'binary'), 'utf-8'); // Декодируем вывод
        console.log(decodedOutput);
    });

    clearLogFile(); // Вызов функции для очистки файла логирования
    // Перенаправление вывода в лог-файл
    const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
    exeProcess.stdout.pipe(logStream);
    exeProcess.stderr.pipe(logStream);
}
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        title:"Приложение оптимального раскроя",
        maxHeight:1080,
        maxWidth:1920,
        show: false,
        icon: path.join(__dirname, "favicon.ico"),
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    windows.push(mainWindow);
    ///mainWindow.loadFile('build/index.html');
    /*if (process.env.NODE_ENV === 'production') {

        // Запуск логики для продакшен-среды
    } else {
        mainWindow.loadURL("http://localhost:3000")
        mainWindow.webContents.openDevTools(); //режим разработчика
        // Запуск логики для разработки
    }*/
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();


    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (loadingWindow) {
            loadingWindow.close();
        }
    });

    // Установка пользовательского меню
    Menu.setApplicationMenu(null);
    mainWindow.on('closed', () => {
        killProcess("main.exe")
        exeProcess.kill();
        mainWindow = null;
    });


    // Добавляем обработчик события close для окна
    mainWindow.on('close', (event) => {
        event.preventDefault(); // Предотвращаем закрытие окна

        // Отображаем диалоговое окно с предупреждением
        dialog.showMessageBox(mainWindow, {
            type: 'warning',
            title: 'Предупреждение',
            message: 'Вы уверены, что хотите закрыть приложение? Введенные данные не сохранятся',
            buttons: ['Да', 'Нет']
        }).then((result) => {
            if (result.response === 0) { // Если пользователь выбрал "Да"
                closeAllWindows(); // Закрываем окно
            }
        });
    });

}
// -----------------------------------------------------------------------------

// Загрузка локальных данных из приложения
// -----------------------------------------------------------------------------
function loadJSONData(){
    const filePath = path.join(__dirname,"local_data.json");
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
}

ipcMain.on('load-data', (event) => {
    try{
        const data = loadJSONData();
        event.sender.send('data-loaded', data);
    }catch(error){
        console.error(error);
        event.sender.send('data-loaded', []);
    }

});
// -----------------------------------------------------------------------------

function createLoadingWindow(){
    startServerService();
    loadingWindow = new BrowserWindow({
        width:400,
        height: 300,
        frame: false,
        webPreferences:{
            nodeIntegration:true
        }
    });

    loadingWindow.loadFile(path.join(__dirname, 'loading.html'));

    loadingWindow.show();

    loadingWindow.once('ready-to-show', () => {

        setTimeout(() => {
            createWindow();
        }, 3000);
    });

}

app.whenReady().then(createLoadingWindow)

// -----------------------------------------------------------------------------
ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
    } else {
        nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
});
// -----------------------------------------------------------------------------


// Функция для закрытия всех окон
// -----------------------------------------------------------------------------
function closeAllWindows() {
    windows.forEach((window) => {
        window.destroy();
    });
}
// -----------------------------------------------------------------------------
const saveDataToFile = (data, fileName) => {
    console.log(data)
    const jsonData = JSON.stringify(data);
    const filePath = path.join(__dirname, fileName);
    fs.writeFile(filePath, jsonData, err => {
        if (err) {
            console.error('Error :', err);
            return;
        }
        console.log('Yes Yes YES !!! .');
    });
};

// Обработчик события выхода из приложения
// -----------------------------------------------------------------------------
ipcMain.on('exit-app', (event, data)=>{
    console.log(data);
    event.preventDefault(); // Предотвращаем закрытие окна
    exitWarningWindow(data);
});
// -----------------------------------------------------------------------------

// Окно предупреждения
// -----------------------------------------------------------------------------
ipcMain.on('uncorrect-enter', (event, data)=>{
    if (data.type === 1){
        showErrorDialog(data);
    }else if(data.type === 0){
        showWarningDialog(data);
    }
});
// -----------------------------------------------------------------------------
// Пример вызова окна с сообщением об ошибке
const showErrorDialog = (data) => {
    dialog.showMessageBox({
        type: 'error',
        title: 'Ошибка',
        message: 'Произошла ошибка!',
        detail: data.message,
        buttons: ['OK'],
        defaultId: 0,
    }).then(r => {console.log("Error")});
};

// Пример вызова окна предупреждения
const showWarningDialog = (data) => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Предупреждение',
        message: 'Предупреждение!',
        detail: data.message,
        buttons: ['OK'],
        defaultId: 0,
    }).then(r => {console.log("Warning")});
};

const exitWarningWindow = (data) =>{
    // Отображаем диалоговое окно с предупреждением
    dialog.showMessageBox(mainWindow, {
        type: 'warning',
        title: 'Предупреждение',
        message: 'Вы уверены, что хотите закрыть приложение? Данные сохранятся',
        buttons: ['Да', 'Нет']
    }).then((result) => {
        saveDataToFile(data, "local_data.json");
        if (result.response === 0) { // Если пользователь выбрал "Да"
            closeAllWindows();
        }
    });
}

// Открытие окна справки
//------------------------------------------------------------------------------
ipcMain.on('open-memo', (event) => {
    let memoWindow = new BrowserWindow({
        width:900,
        height: 600,
        webPreferences:{
            nodeIntegration:true
        }
    });
    memoWindow.loadFile(path.join(__dirname, 'memoWindow.html'));
    windows.push(memoWindow);
    memoWindow.on("closed", ()=>{
        memoWindow = null;
    });
});
//------------------------------------------------------------------------------

// Открытие окна история раскроя
//------------------------------------------------------------------------------
ipcMain.on('open-history-cuts', (event)=>{
    let historyCutsWindow = new BrowserWindow({
        width:900,
        height: 600,
        webPreferences:{
            nodeIntegration:true
        }
    });
    historyCutsWindow.loadFile(path.join(__dirname, 'historyWindow.html'));
    windows.push(historyCutsWindow);
    historyCutsWindow.on("closed", ()=>{
        historyCutsWindow = null;
    });
});
//------------------------------------------------------------------------------

// -----------------------------------------------------------------------------
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }

});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {

        createLoadingWindow();
    }

});
// -----------------------------------------------------------------------------