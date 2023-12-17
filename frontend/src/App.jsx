import {BrowserRouter,Routes,Route} from "react-router-dom"
import Beranda from "./pages/Beranda"
import Detail from "./pages/Detail"
import Chapter from "./pages/Chapter"

function App() {

  return <BrowserRouter>
    <Routes>
        <Route path="/" element={<Beranda/>} />
        <Route path="/manga/:slug" element={<Detail/>} />
        <Route path="/manga/:slug/:chapter" element={<Chapter/>} />
        <Route path="*" element={<Beranda/>} />
    </Routes>
  </BrowserRouter>
}

export default App
