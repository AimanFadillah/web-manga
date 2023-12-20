import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Beranda () {
    const [mangas,setMangas] = useState([]);
    const [page,setPage] = useState(1);
    const [time,setTime] = useState();
    const [cat,setCat] = useState("");
    const [genres,setGenres] = useState([]);
    const [loading,setLoading] = useState(false);
    const [search,setSearch] = useState("");
    const [resultS,setResults] = useState([]);
    const [query,setQuery] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        cat || query ? getdata(undefined,true) : getdata(); 
        getGenres();
        getSearch();
    },[cat,query])

    useEffect(() => getSearch,[search])

    function getdata(pagination = page,reset = false) {
        setLoading(true);
        clearTimeout(time);
        const tm = setTimeout(async () => {
            const data = await axios.get(`http://localhost:5000/manga?page=${reset ? 1 : pagination}&genre=${cat}&order=${query}`);
            setMangas(reset ? data.data : [...mangas,...data.data]);
            setPage(reset ? 2 : page + 1);
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
            <div className="col-md-2 col-4">
                <select onChange={(e) => setCat(e.target.value)} className="form-select" aria-label="Default select example">
                    <option value="" >Genre</option>
                    {genres.map((genre,index) => 
                        <option value={genre.id} key={index}>{genre.nama}</option>
                    )}
                </select>
            </div>
            <div className="col-md-2 col-3 p-0 me-2">
                <select onChange={(e) => setQuery(e.target.value)} className="form-select" aria-label="Default select example">
                    <option value="" >All</option>
                    <option value="popular" >Popular</option>
                    <option value="update" >Update</option>
                    <option value="latest" >Latest</option>
                    <option value="title" >A - Z</option>
                    <option value="titlereverse" >Z - A</option>
                </select>
            </div>
            <div className="col-md-2 d-flex col-4 p-0 align-items-center">
                <div className={`spinner-border me-2 text-primary ${loading ? ""  : "d-none"}`} role="status"></div>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" ><i className="bi bi-search"></i></button>
                <Link className="btn btn-primary ms-1" to={"/history"} ><i className="bi bi-clock-history"></i></Link>
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
                    <Link className="card shadow text-decoration-none" to={`/manga/${manga.slug}`}>
                        <img src={manga.gambar} height={"350"} className="card-img-top" alt={manga.judul} />
                        <div className="card-body">
                            <h5 className="card-title">{manga.judul.length > 20 ? manga.judul.substring(0,20) + "..." : manga.judul }</h5>
                            <p className="card-text text-secondary">{manga.genre}</p>
                        </div>
                    </Link>
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
                        <Link onClick={() => nav(`/manga/${result.data}`)} key={index} data-bs-dismiss="modal" data-bs-target="#my-modal" aria-label="Close"  className="mb-1 bg-primary text-white p-1 px-3 text-decoration-none d-block rounded" >
                            {result.value}
                        </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
}