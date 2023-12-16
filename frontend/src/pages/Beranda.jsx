import { useEffect, useState } from "react"
import axios from "axios";

export default function Beranda () {
    const [mangas,setMangas] = useState([]);

    useEffect(() => {
        getdata();
    },[])

    async function getdata() {
        const data = await axios.get("http://localhost:5000/manga?page=1");
        setMangas(data.data);
    }

    return <div className="container mt-5" >
        <div className="row">
            {mangas.map((manga,index) => 
            <div key={index} className="col-md-3 mb-3">
                <div>
                    <div className="card">
                        <img src={manga.gambar} height={"350"} className="card-img-top" alt="tesst" />
                        <div className="card-body">
                            <h5 className="card-title">{manga.judul}</h5>
                            <p className="card-text">{manga.genre}</p>
                            <a href={`/detail/${manga.slug}`} className="btn btn-primary">Baca</a>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    </div>
}