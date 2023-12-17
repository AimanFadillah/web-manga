import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

export default function Detail () {
    const slug = useParams().slug;
    const [manga,setManga] = useState();

    useEffect(() => {
        getdata();
    },[]);

    async function getdata() {
        try{
            const data = await axios.get(`https://mangapi.aimanfadillah.repl.co/manga/${slug}`);
            setManga(data.data);
        }catch(e){
            return mode404();
        }
    }

    return <div className="container mt-5">
        {manga ? 
        <div className="row justify-content-center">
            <div className="col-md-3 d-flex justify-content-center">
                <div className="">
                    <img src={manga.gambar} alt={manga.nama} className="shadow rounded mb-3 border" />
                </div>
            </div>
            <div className="col-md-9 mb-3">
                <div className="card">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">{manga.nama}</li>
                        <li className="list-group-item">{manga.author}</li>
                        <li className="list-group-item">{manga.status}</li>
                        <li className="list-group-item">{manga.rilis}</li>
                        <li className="list-group-item">{manga.genre}</li>
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
                            <Link to={`/manga/${slug}/${chapter.slug}`} className="fw-bold text-decoration-none">{chapter.nama}</Link>
                        </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
        : <div className="row ">
            <div className="col-md-12 d-flex justify-content-center">
                <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
            </div>
        </div>}
    </div> 

}