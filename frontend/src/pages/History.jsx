import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function History () {
    const [mangas,setMangas] = useState(JSON.parse(localStorage.getItem("historys")) || [] )
    const nav = useNavigate();

    function removeHistory (index) {
        const newHistorys = mangas;
        newHistorys.splice(index,1);
        setMangas([...newHistorys]);
        localStorage.setItem("historys",JSON.stringify(newHistorys));
    }

    return <div className="container mt-4">
        <h1 className="text-center" ><i className="bi bi-clock-history"></i> History</h1>
        <div className="row mt-3">
            {mangas.map((manga,index) => 
            <div key={index} className="col-md-3 col-6 mb-3">
                <div>
                    <div className="card shadow text-decoration-none" >
                        <img src={manga.gambar} height={"350"} onClick={() => nav(`/manga/${manga.slug}/${manga.slugChapter}`)} className="card-img-top" alt="tesst" />
                        <div className="card-body">
                            <h5 className="card-title" onClick={() => nav(`/manga/${manga.slug}/${manga.slugChapter}`)} >{manga.judul.length > 20 ? manga.judul.substring(0,20) + "..." : manga.judul}</h5>
                            <div className="d-inline badge bg-success" onClick={() => nav(`/manga/${manga.slug}/${manga.slugChapter}`)} >Chapter {(manga.slugChapter).split("-").slice(-1)[0]}</div>
                            <div className="d-inline badge bg-danger ms-1" onClick={() => removeHistory(index)} ><i className="bi bi-trash-fill"></i></div>
                        </div>
                    </div>
                </div>
            </div> 
            )}

        </div>
    </div>
}