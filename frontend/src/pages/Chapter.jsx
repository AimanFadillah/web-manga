import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function Chapter () {
    const slug = useParams().slug;
    const chapterKe = useParams().chapter;
    const [chapter,setChapter] = useState([]);

    useEffect(() => {
        getdata()
    },[]);

    async function getdata() {
        const data = await axios.get(`http://localhost:5000/manga/${slug}/${chapterKe}`);
        setChapter(data.data);
    }

    return <div className="container mt-5">
        <div className="row justify-content-center">
            {chapter.map((image,index) => 
            <div className="col-md-10" key={index}>
                <div className="">
                    <img src={`http://localhost:5000/gambar?url=${image.gambar}`} className="img-fluid" alt={index} />
                </div>
            </div>
            )}
        </div>
    </div>

}