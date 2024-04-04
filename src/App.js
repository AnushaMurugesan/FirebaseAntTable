// import logo from './logo.svg';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import AntFirebase from './components/AntFirebase';
import AntFirebase1 from './components/Antfirebase1';
import AntFirebase2 from "./components/Antfirebase2";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<AntFirebase1 />}></Route>
          <Route path="/userlist" element={<AntFirebase2 />}></Route>
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
