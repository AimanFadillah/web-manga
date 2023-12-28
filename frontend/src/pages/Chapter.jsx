import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component";

export default function Chapter () {
    const slug = useParams().slug;
    const [chapter,setChapter] = useState([]);
    const [chapterKe,setChapterKe] = useState(useParams().chapter);
    const [indexC,setIndexC] = useState();
    const [time,setTime] = useState();
    const [manga,setManga] = useState({
        chapters:[]
    });

    useEffect(() => {
        getChapters()
        getdata()
    },[]);

    async function getdata() {
        const indexChapter = manga.chapters[indexC] ? manga.chapters[indexC].slug : chapterKe;
        if(indexC && indexC < 0) return false;
        try{
            document.body.style.overflow = "hidden"
            loading(true)
            const data = await axios.get(`https://mangapi.aimanfadillah.repl.co/manga/${slug}/${indexChapter}`);
            setChapter([...chapter,{gambar:`Chapter ${(indexChapter).split("-").slice(-1)[0]}`},...data.data]);
            indexC && indexC >= 0 || indexC == 0 ? setIndexC(indexC - 1) : "";
            if(manga.chapters.length != 0) setHistory(indexChapter);
            setTimeout(() => {loading(false);document.body.style.overflow = ""},1000);
        }catch(e){
            return mode404()
        }
    }

    async function getChapters () {
        const response = await axios.get(`https://mangapi.aimanfadillah.repl.co/manga/${slug}`);
        response.data.chapters.map((chapter,loop) =>  chapter.slug === chapterKe ? setIndexC(loop - 1) : "");
        setManga(response.data);
        setHistory(undefined,response.data);
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
            historys = [history,...historys];
            localStorage.setItem("historys",JSON.stringify(historys))
        }else{
            if(historys.length >= 20) historys.pop()
            historys = [history,...historys];
            localStorage.setItem("historys",JSON.stringify(historys)) 
        }
    }

    return <div className="container">
        <InfiniteScroll 
            dataLength={chapter.length}
            hasMore={true}
            className="row justify-content-center"
            scrollThreshold="100px"
            next={getdata}
            >
            {chapter.map((image,index) => 
                <div className="col-md-12 p-0 d-flex justify-content-center" key={index}>
                    {!image.gambar.includes("Chapter") ?
                    <img src={`https://mangapi.aimanfadillah.repl.co/gambar?url=${image.gambar}`} className="img-fluid" alt={index} />
                    : 
                    <h1>{image.gambar}</h1>
                    }
                </div>
            )}
        </InfiniteScroll>
    </div>

}