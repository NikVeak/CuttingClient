import './App.css';
import {lazy, Suspense} from "react";
let ipcRenderer;
try {
    const electronWindow = window.require('electron');
    ipcRenderer = electronWindow.ipcRenderer;
} catch (error) {

}

const Basis = lazy(()=> import('./component/Basis'));
function App() {
  return (
    <div className="App">
            <Suspense fallback={<div>Загрузка...</div>}>
                <Basis/>
            </Suspense>
    </div>
  );
}

export default App;
