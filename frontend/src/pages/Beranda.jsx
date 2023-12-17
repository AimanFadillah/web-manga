import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

export default function Beranda () {
    const [mangas,setMangas] = useState([]);
    const [page,setPage] = useState(1);
    const [time,setTime] = useState();
    const [cat,setCat] = useState("");
    const [genres,setGenres] = useState([]);
    const [loading,setLoading] = useState(false);
    const [search,setSearch] = useState("");
    const [resultS,setResults] = useState([]);

    useEffect(() => {
        cat ? getdata(undefined,true) : getdata(); 
        getGenres();
    },[cat])

    useEffect(() => getSearch,[search])

    function getdata(pagination = page,reset = false) {
        setLoading(true);
        clearTimeout(time);
        const tm = setTimeout(async () => {
            const data = await axios.get(`http://localhost:5000/manga?page=${pagination}&cat=${cat}`);
            setMangas(reset ? data.data : [...mangas,...data.data]);
            setPage(reset ? 1 : page + 1);
            setLoading(false);
        },pagination == 1 ? 0 : 500);
        setTime(tm);
    }

    async function getGenres() {
        const response = await axios.get("http://localhost:5000/genre");
        setGenres(response.data);
    }

    async function getSearch () {
        const response = await axios.get(`http://localhost:5000/search?query=${search}`);
        setResults(response.data);
    }

    return <div className="container mt-5" >
        <div className="row mb-3">
            <div className="col-md-2 col-5">
                <select onChange={(e) => setCat(e.target.value)} className="form-select" aria-label="Default select example">
                    <option value={""} >Genre</option>
                    {genres.map((genre,index) => 
                        <option value={genre.id} key={index}>{genre.nama}</option>
                    )}
                </select>
            </div>
            <div className="col-md-1 d-flex col-3 p-0 align-items-center">
                <div className={`spinner-border me-2 text-primary ${loading ? ""  : "d-none"}`} role="status"></div>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" ><i className="bi bi-search"></i></button>
            </div>
        </div>
        <InfiniteScroll
            dataLength={mangas.length}
            next={getdata}
            hasMore={true}
            className="row"
        >
            {mangas.map((manga,index) => 
            <div key={index} className="col-md-3 col-6 mb-3">
                <div>
                    <a className="card shadow text-decoration-none" href={`/detail/${manga.slug}`}>
                        <img src={manga.gambar} height={"350"} className="card-img-top" alt="tesst" />
                        <div className="card-body">
                            <h5 className="card-title">{manga.judul}</h5>
                            <p className="card-text">{manga.genre}</p>
                        </div>
                    </a>
                </div>
            </div>
            )}      
        </InfiniteScroll>
        <div className="row ">
            <div className="col-md-12 d-flex justify-content-center mt-3">
                <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
            </div>
        </div>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header d-block d-md-none p -0">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <input type="text" onChange={(e) => setSearch(e.target.value)} className="form-control mb-3" placeholder="Cari Manga" />
                        {resultS.map((result,index) => 
                        <a href={`/detail/${result.data}`} key={index} className="mb-1 bg-primary text-white p-1 px-3 text-decoration-none d-block rounded" >
                            {result.value}
                        </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
}