import {BrowserRouter,Routes,Route} from "react-router-dom"
import Beranda from "./pages/Beranda"
import Detail from "./pages/Detail"

function App() {

  return <BrowserRouter>
    <Routes>
        <Route path="/" element={<Beranda/>} />
        <Route path="/detail/:slug" element={<Detail/>} />
    </Routes>
  </BrowserRouter>
}

export default App
