import {BrowserRouter,Routes,Route} from "react-router-dom"
import Beranda from "./pages/Beranda"
import Detail from "./pages/Detail"
import Chapter from "./pages/Chapter"

function App() {

  return <BrowserRouter>
    <Routes>
        <Route path="/" element={<Beranda/>} />
        <Route path="/detail/:slug" element={<Detail/>} />
        <Route path="/detail/:slug/:chapter" element={<Chapter/>} />
        <Route path="*" element={<Beranda/>} />
    </Routes>
  </BrowserRouter>
}

export default App
