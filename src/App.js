import './App.css';
import {lazy, Suspense} from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DoubleBasis from "./component/DoubleBasis";

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
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Basis/>}>

                </Route>
                <Route path="/double"
                       element={<DoubleBasis/>}>
                </Route>
            </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
