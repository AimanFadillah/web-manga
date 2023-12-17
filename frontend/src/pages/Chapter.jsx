import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component";

export default function Chapter () {
    const slug = useParams().slug;
    const [chapterKe,setChapterKe] = useState(useParams().chapter);
    const [chapter,setChapter] = useState([]);
    const [chapters,setChapters] = useState([]);
    const [indexC,setIndexC] = useState();
    const [time,setTime] = useState();

    useEffect(() => {
        getChapters()
        getdata()
    },[]);

    async function getdata() {
        clearTimeout(time);
        const indexChapter = chapters[indexC] ? chapters[indexC].slug : chapterKe;
        if(indexC && indexC <= 0) return false
        window.history.pushState("", "", `/detail/${slug}/${indexChapter}`);
        const tm = setTimeout(async () => {
            try{
                const data = await axios.get(`https://mangapi.aimanfadillah.repl.co/manga/${slug}/${indexChapter}`);
                setChapter([...chapter,{gambar:`Chapter ${indexChapter}`},...data.data]);
                indexC ? setIndexC(indexC - 1) : "";
            }catch(e){
                return mode404()
            }
        },500);
        setTime(tm)
    }

    async function getChapters () {
        const response = await axios.get(`https://mangapi.aimanfadillah.repl.co/manga/${slug}`);
        response.data.chapters.map((chapter,loop) =>  chapter.slug === chapterKe ? setIndexC(loop - 1) : "");
        setChapters(response.data.chapters);
    }

    return <div className="container">
        <InfiniteScroll 
            dataLength={chapter.length}
            hasMore={true}
            className="row justify-content-center"
            next={getdata}
            >
            {chapter.map((image,index) => 
                <div className="col-md-12 p-0 d-flex justify-content-center" key={index}>
                    {image.gambar.includes("https") ?
                    <img src={`https://mangapi.aimanfadillah.repl.co/gambar?url=${image.gambar}`} className="img-fluid" alt={index} />
                    : 
                    <h1>{image.gambar}</h1>
                    }
                </div>
            )}
        </InfiniteScroll>
        <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-center">
                <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
            </div>
        </div>
    </div>

}