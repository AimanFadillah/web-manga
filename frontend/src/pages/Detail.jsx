import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function Detail () {
    const slug = useParams().slug;
    const [manga,setManga] = useState();

    useEffect(() => {
        getdata();
    },[]);

    async function getdata() {
        const data = await axios.get(`http://localhost:5000/manga/${slug}`);
        setManga(data.data);
    }

    return <div className="container mt-5">
        {manga ? 
        <div className="row ">
            <div className="col-md-12 d-flex justify-content-center">
                <img src={manga.gambar} alt={manga.nama} className="shadow rounded mb-3 border" />
            </div>
            <div className="col-md-12 mb-3">
                <div className="card">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">{manga.nama}</li>
                        <li className="list-group-item">{manga.status}</li>
                        <li className="list-group-item">{manga.author}</li>
                        <li className="list-group-item">{manga.rilis}</li>
                        <li className="list-group-item">{manga.genre}</li>
                        <li className="list-group-item">{manga.views}</li>
                        <li className="list-group-item">
                            <p>{manga.deskripsi}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-md-12 mb-3">
                <div className="card">
                    <ul className="list-group list-group-flush">
                        {manga.chapters.map((chapter,index) => 
                        <li className="list-group-item" key={index}>
                            <a href={`/detail/${slug}/${chapter.slug}`} class="fw-bold text-decoration-none">{chapter.nama}</a>
                        </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
        : " "}
    </div>

}