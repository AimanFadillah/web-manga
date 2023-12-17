import express from "express";
import axios from "axios";
import cheerio, { html } from "cheerio";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());

app.get("/search",async (req,res) => {
    const response = await axios.get(`https://mangaid.click/search?query=${req.query.query}`)
    return res.json(response.data.suggestions);
})  

app.get("/genre",async (req,res) => {
    const response = await axios.get(`https://mangaid.click/manga-list?page=1&sortBy=views`);
    const $ = cheerio.load(response.data);
    const data = [];
    $(".list-category").find("li").each((index,element) => {
        data.push({
            nama:$(element).find("a").text(),
            id:($(element).find("a").attr("href")).split("?cat=")[1],
        })
    });
    return res.json(data);
})

app.get("/manga",async (req,res) => {
    try{
        const response = await axios.get(`
        https://mangaid.click/filterList?page=${req.query.page || 1}&cat=${req.query.cat || ""}&alpha=&sortBy=${req.query.sortBy || "views"}&asc=${req.query.asc || false}&author=&artist=&tag=`);
        const $ = cheerio.load(response.data);
        const data = [];
        let gambar,judul,genre,slug;
        $("body").find(".col-sm-6").each((index,element) => {
            gambar = $(element).find("div > div > a > img").attr("src");
            judul = $(element).find("div > .media-body > h5 > a > strong").text();
            genre = $(element).find(`div > .media-body > div`).eq(2).text();
            slug = ($(element).find("div > div > a ").attr("href")).split("/")[4];
            data.push({
                gambar,
                judul,
                genre,
                slug,
            })
        });
        return res.json(data);
    }catch(e){
        return res.sendStatus(404);
    }
});

app.get("/manga/:slug",async (req,res) => {
    try{
        const response = await axios.get(`https://mangaid.click/manga/${req.params.slug}`);
        const $ = cheerio.load(response.data);
        const chapters = [];
        $(".chapters").find("li").each((index,element) => {
            chapters.push({
                slug : ($(element).find("h5 > a").attr("href")).split("/")[5],
                nama: $(element).find("h5 > a").text(),
            })
        });
        const data = {
            gambar : $(".boxed").find("img").attr("src"),
            status : $(".dl-horizontal").find("dd > span").text(),
            nama: $(".dl-horizontal").find("dd").eq(2).text(),
            author: $(".dl-horizontal").find("dd").eq(3).text(),
            rilis: $(".dl-horizontal").find("dd").eq(4).text(),
            genre: $(".dl-horizontal").find("dd").eq(5).text(),
            deskripsi : $(".well").find("p").text(),
            chapters,
        }
        return res.json(data)
    }catch(e){
        return res.sendStatus(404);
    }
})

app.get("/manga/:slug/:chapter",async (req,res) => {
    try{
        const response = await axios.get(`https://mangaid.click/manga/${req.params.slug}/${req.params.chapter}/1`);
        const $ = cheerio.load(response.data);
        const data = [];
        $("#all").find("img").each((index,element) => {
            data.push({
                gambar : $(element).attr("data-src"),
            });
        });
        return res.json(data);
    }catch(e){
        return res.sendStatus(404);
    }
});

app.get("/gambar",async (req,res) => {
    try{ 
        const response = await axios.get(req.query.url,{ responseType: 'arraybuffer' });
        res.header('Content-Type', 'image/jpeg');
        return res.send(response.data);
    }catch(e){
        return res.send(404);
    }
})

app.get("/",(req,res) => res.json({msg:"Success"}))
 
app.listen(5000,() => console.log("Berjalan di http://localhost:5000/"));
