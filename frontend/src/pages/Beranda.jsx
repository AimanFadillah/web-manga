import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Beranda () {
    const [mangas,setMangas] = useState([]);
    const [page,setPage] = useState(1);
    const [cat,setCat] = useState("");
    const [genres,setGenres] = useState([]);
    const [loading,setLoading] = useState(false);
    const [search,setSearch] = useState("");
    const [resultS,setResults] = useState([]);
    const [query,setQuery] = useState("update");
    const [mode,setMode] = useState("main");
    const [more,setMore] = useState(true);
    const [inputSearch,setInputSearch] = useState(window.innerWidth >= 768 ? true : false);
    const [theme,setTheme] = useState(localStorage.getItem("mode") || "light");
    const nav = useNavigate();

    useEffect(() => {
        localStorage.setItem("mode",theme);
        document.body.setAttribute("data-bs-theme",theme);
    },[theme])

    useEffect(() => { 
        document.documentElement.style.scrollBehavior = 'auto'
        window.removeEventListener("popstate",aturBack);
        window.addEventListener('popstate',aturBack);
    },[]);

    function aturBack(){
        switch(state){
            case "show":
                showToMain()
                break;

            case "chapter":
                chapterTo("show")
                break;

            case "history":
                setMode("main");
                break;
            
            case "chapter_history":
                chapterTo("history")
                setSlug();
                setManga();
                break;
            
            default :
            showToMain();
        }
    }

    function setState(nama,mode = true){
        history.pushState({state:true},"","")
        state = nama;
        mode ? setMode(nama) : undefined;
    }

    // MODE MAIN
    useEffect(() => { 
        cat || query ? getdata(undefined,true) : getdata();
        getGenres();
    },[cat,query])

    function getdata(pagination = page,reset = false) {
        reset ? setMangas([]) : "";
        setLoading(true);
        clearTimeout(time);
        time = setTimeout(async () => {
            const data = await axios.get(`https://mangapi-man.vercel.app/manga?page=${reset ? 1 : pagination}&genre=${cat}&order=${query}&title=${search}`);
            setMangas(reset ? data.data : [...mangas,...data.data]);
            setPage(reset ? 2 : page + 1);
            setLoading(false);
            data.data.length == 0 ? setMore(false) : setMore(true)
        },pagination == 1 ? 0 : 500);
    }

    async function getGenres() {
        const response = await axios.get("https://mangapi-man.vercel.app/genre");
        setGenres(response.data);
    }

    async function getSearch () {
        const response = await axios.get(`https://mangapi-man.vercel.app/search?query=${search}`);
        setResults(response.data); 
    }

    function modeShow (slug) {
        setSlug(slug)
        setState("show");
    }

    function modeChapter (slug,chapterKe) {
        setState("chapter")
        setSlug(slug)
        setChapterKe(chapterKe)
    }

    function modeChapterHistory (slug,chapterKe) {
        setState("chapter_history",false)
        setMode("chapter");
        setSlug(slug)
        setChapterKe(chapterKe)
    }

    // MODE SHOW
    const [slug,setSlug]= useState();
    const [manga,setManga] = useState();

    useEffect(() => {
        if(slug) getManga()
    },[slug]);

    async function getManga() {
        try{
            const data = await axios.get(`https://mangapi-man.vercel.app/manga/${slug}`);
            setManga(data.data);
        }catch(e){
            return mode404();
        }
    }

    function showToMain(){
        setMode("main");
        setSlug();
        setManga();
    }

    // MODE HISTORY
    const [mangasHistory,setMangasHistory] = useState(JSON.parse(localStorage.getItem("historys")) || [] );

    function removeHistory (index) {
        const newHistorys = mangasHistory;
        newHistorys.splice(index,1);
        setMangasHistory([...newHistorys]);
        localStorage.setItem("historys",JSON.stringify(newHistorys));
    }

    // MODE CHAPTER
    const [chapter,setChapter] = useState([]);
    const [chapterKe,setChapterKe] = useState();
    const [indexC,setIndexC] = useState();
    const [mangaChapter,setMangaChapter] = useState({
        chapters:[]
    });

    useEffect(() => {
        if(mode === "chapter"){
            getdataChapters()
            getChapters()
        }
    },[chapterKe]);

    async function getdataChapters() {
        const indexChapter = mangaChapter.chapters[indexC] ? mangaChapter.chapters[indexC].slug : chapterKe;
        if(indexC && indexC < 0) return false;
        document.body.style.overflow = "hidden"
        loadingPenuh(true)
        const data = await axios.get(`https://mangapi-man.vercel.app/manga/${slug}/${indexChapter}`);
        setChapter([...chapter,{gambar:`Chapter ${(indexChapter).split("chapter-")[1].replace(/-/g, '.')}`},...data.data]);
        indexC && indexC >= 0 || indexC == 0 ? setIndexC(indexC - 1) : "";
        if(mangaChapter.chapters.length != 0) setHistory(indexChapter);
        setTimeout(() => {loadingPenuh(false);document.body.style.overflow = ""},2000);
    }

    async function getChapters () {
        try{
            const response = await axios.get(`https://mangapi-man.vercel.app/manga/${slug}`);
            response.data.chapters.map((chapter,loop) =>  chapter.slug === chapterKe ? setIndexC(loop - 1) : "");
            setMangaChapter(response.data);
            setHistory(undefined,response.data);
        }catch(e){
            return mode404();
        }
    }

    async function setHistory (slugChapter = chapterKe,data = manga) {
        let historys = JSON.parse(localStorage.getItem("historys")) || [];
        const history = {
            gambar:data.gambar,
            judul:data.nama,
            genre:data.genre,
            slug:slug,
            slugChapter,
        }
        const checkData = historys.find((ht) => ht.slug == history.slug);
        if(checkData){
            const index = historys.findIndex((ht) => ht.slug == history.slug);
            historys.splice(index,1);  
        }
        if(historys.length >= 20) historys.pop()
        historys = [history,...historys];
        localStorage.setItem("historys",JSON.stringify(historys))
        setMangasHistory(historys);
    }

    function chapterTo(to){
        state = to
        setMode(to);
        setChapter([]);
        setChapterKe();
        setIndexC();
        setMangaChapter({
            chapters:[]
        })
    }

    return <div className="container mt-5" >
        {mode === "main" ? 
        <>
            <div className="row mb-3 ">
                <div className="col-md-2 col-4">
                    <select defaultValue={cat} onChange={(e) => setCat(e.target.value)} className="form-select" aria-label="Default select example">
                        <option value="" >Genre</option>
                        {genres.map((genre,index) => 
                            <option value={genre.id} key={index}>{genre.nama}</option>
                        )}
                    </select>
                </div>
                <div className="col-md-2 col-3 p-0 ">
                    <select defaultValue={query} onChange={(e) => setQuery(e.target.value)} className="form-select" aria-label="Default select example">
                        <option value=""    >All</option>
                        <option value="popular" >Popular</option>
                        <option value="update">Update</option>
                        <option value="latest" >Latest</option>
                        <option value="title" >A - Z</option>
                        <option value="titlereverse" >Z - A</option>
                    </select>
                </div>
                <div className="col-md-5 d-flex col-4 p-0 align-items-center ">
                    <button className="btn btn-primary ms-1 d-md-none d-block" onClick={() => setInputSearch(!inputSearch)} ><i className="bi bi-search"></i></button>
                    <Link className="btn btn-primary ms-1" onClick={() => setState("history")} ><i className="bi bi-clock-history"></i></Link>
                    <Link className="btn btn-primary ms-1" onClick={() => 
                        theme === "light" ? setTheme("dark") : setTheme("light")
                    }  >{theme === "light" ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sun-fill"></i>}</Link>
                </div>
                <div className={`col-md-3 ${inputSearch ? "" : "d-none"}`} id="inputSearch" >
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        getdata(undefined,true)
                    }}>
                        <div className="input-group mt-md-0 mt-2">
                            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className="form-control"  placeholder="Cari Komik" />
                            <button className="btn btn-primary" type="submit"><i className="bi bi-search"></i></button>
                        </div>
                    </form>
                </div>
            </div>
            <InfiniteScroll
                dataLength={mangas.length}
                next={getdata}
                hasMore={more}
                className="row"
                loader={
                    <div className="row my-3 mx-0">
                        <div className="col-md-12 d-flex justify-content-center mt-3">
                            <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
                        </div>
                    </div>
                }
            >
                {mangas.map((manga,index) => 
                <div key={index} className="col-md-3 col-6 mb-3">
                    <div>
                        <Link className="card shadow text-decoration-none" onClick={() => modeShow(manga.slug)} >
                            <img src={"https://mangapi-man.vercel.app/gambar?url=" + manga.gambar} height={"350"} className="card-img-top" alt={manga.judul} />
                            <div className="card-body">
                                <h5 className="card-title">{manga.judul.length > 20 ? manga.judul.substring(0,20) + "..." : manga.judul }</h5>
                                <p className="card-text text-secondary">{manga.genre}</p>
                            </div>
                        </Link>
                    </div>
                </div>
                )}      
            </InfiniteScroll>

        </> 
        : 
        mode === "show" ?
        <>
            {manga ? 
            <div className="row justify-content-center">
                <div className="col-md-3 d-flex justify-content-center">
                    <div className="">
                        <img src={"https://mangapi-man.vercel.app/gambar?url=" + manga.gambar} alt={manga.nama} className="shadow rounded mb-3 border" />
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
                                {/* <Link to={`/manga/${slug}/${chapter.slug}`} className="fw-bold text-decoration-none">{chapter.nama}</Link> */}
                                <Link onClick={() => modeChapter(slug,chapter.slug)} className="fw-bold text-decoration-none">{chapter.nama}</Link>
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
        </>
        : 
        mode === "history" ? 
        <>  
        <h1 className="text-center" ><i className="bi bi-clock-history"></i> History</h1>
        <div className="row mt-3">
            {mangasHistory.map((manga,index) => 
            <div key={index} className="col-md-3 col-6 mb-3">
                <div>
                    <div className="card shadow text-decoration-none" >
                        <img src={"https://mangapi-man.vercel.app/gambar?url=" + manga.gambar} height={"350"} onClick={() => modeChapterHistory(manga.slug,manga.slugChapter)} className="card-img-top" alt="tesst" />
                        <div className="card-body">
                            <h5 className="card-title" onClick={() => nav(`/manga/${manga.slug}/${manga.slugChapter}`)} >{manga.judul.length > 20 ? manga.judul.substring(0,20) + "..." : manga.judul}</h5>
                            <div className="d-inline badge bg-success" onClick={() => nav(`/manga/${manga.slug}/${manga.slugChapter}`)} >Chapter {(manga.slugChapter).split("chapter-")[1].replace(/-/g, '.')}</div>
                            <div className="d-inline badge bg-danger ms-1" onClick={() => removeHistory(index)} ><i className="bi bi-trash-fill"></i></div>
                        </div>
                    </div>
                </div>
            </div> 
            )}

        </div>
        </>
        :
        mode === "chapter" ?
        <>
        <InfiniteScroll 
            dataLength={chapter.length}
            hasMore={true}
            className="row justify-content-center"
            scrollThreshold="100px"
            next={getdataChapters}
            >
            {chapter.map((image,index) => 
                <div className="col-md-12 p-0 d-flex justify-content-center" key={index}>
                    {!image.gambar.includes("Chapter") ?
                    <img src={`https://mangapi-man.vercel.app/gambar?url=${image.gambar}`} className="img-fluid" alt={index} />
                    : 
                    <h1>{image.gambar}</h1>
                    }
                </div>
            )}
        </InfiniteScroll>
        </>
        : 
        <>
        </>
        }
    </div>
}
