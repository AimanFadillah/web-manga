import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors()); 

const configAxios = axios.create({
    headers:{
        "User-Agent" : "PostmanRuntime/7.38.0"
    },
    baseURL:"https://komikcast1.com"
})

app.get("/search", async (req, res) => {
    const response = await configAxios.get(`/?s=${req.query.query}`)
    const $ = cheerio.load(response.data);
    const data = [];
    $(".film-list").find(".animepost").each((index, element) => {
        data.push({
            value: $(element).find(".animposx > .bigors > a > div > h4").text(),
            data: ($(element).find(".animposx > a").attr("href")).split("/")[4],
        });
    });
    return res.json(data);
})

app.get("/genre", async (req, res) => {
    const response = await configAxios.get(`/daftar-genre/`);
    const $ = cheerio.load(response.data);
    const data = [];
    $(".genrelist").find("li").each((index, element) => {
        data.push({
            nama: $(element).find("a").text(),
            id: ($(element).find("a").attr("href")).split("/")[4],
        });
    });
    return res.json(data);
})

app.get("/manga", async (req, res) => {
    try{
        const response = await configAxios.get(`/daftar-komik/page/${req.query.page || 1}/?genre=${req.query.genre || ""}&order=${req.query.order || ""}&title=${req.query.title || ""}`);
        const $ = cheerio.load(response.data);
        const data = [];
        let gambar;
        $(".arch-list").find(".post-item").each((index, element) => {
            gambar = $(element).find(".post-item-box > a > div > img").attr("src");
            data.push({
                gambar: gambar && gambar.includes("?") ? gambar.split("?")[0] : gambar,
                judul: $(element).find(".post-item-box > a > .post-item-ttl-s > .post-item-title > h4").text(),
                score: $(element).find(".post-item-box > a > .post-item-ttl-s > .post-item-additio > .rating > i").text(),
                slug: ($(element).find(".post-item-box > a").attr("href")).split("/")[4],
            });
        });
        return res.json(data);
    }catch(e){
        console.log(e)
        return res.json(e)
    }
});

app.get("/manga/:slug", async (req, res) => {
    try{
        const response = await configAxios.get(`/komik/${req.params.slug}/`);
        const $ = cheerio.load(response.data);
        const chapters = [];
        const genres = []
        $(".box-list-chapter > ul").find("li").each((index, element) => {
            chapters.push({
                slug: ($(element).find(".list-chapter-chapter > a").attr("href")).split("/")[3],
                nama: $(element).find(".list-chapter-chapter > a").text().replace(/\n/g, ""),
            })
        });
        $(".genre-info-manga > a").each((index,element) => {
            genres.push($(element).text());
        })

        const data = {
            gambar: $(".thumb").find("img").attr("src"),
            nama: ($("h1.entry-title").text()).split("Komik\n")[1],
            status: ($(".col-info-manga-box > span").eq(1).text()).split("\n")[1],
            author: ($(".col-info-manga-box > span").eq(3).text()).split("\n")[1],
            rilis: ($(".col-info-manga-box > span").eq(5).text()).split("\n")[1],
            genre: genres.join(","),
            deskripsi: ($(".entry-content.entry-content-single").find("p").text()).replace(/\n/g, " "),
            chapters,
        }
        return res.json(data)
    }catch(e){
        return res.sendStatus(404);
    }
})

app.get("/manga/:slug/:chapter", async (req, res) => {
    try{
        const response = await configAxios.get(`/${req.params.chapter}/`);
        const $ = cheerio.load(response.data);
        const data = [];
        $("#anjay_ini_id_kh").find("img").each((index, element) => {
            data.push({
                gambar: $(element).attr("src"),
            });
        });
        return res.json(data);
    }catch (e){
        return res.sendStatus(404);
    }
});

app.get("/gambar", async (req, res) => {
    try {
        const response = await configAxios.get(req.query.url, { responseType: 'arraybuffer' });
        res.header('Content-Type', 'image/jpeg');
        return res.send(response.data);
    } catch (e) {
        return res.send(404);
    }
})

app.get("/", (req, res) => res.json({ msg: "Success" }))

app.listen(5000, () => console.log("Berjalan di http://localhost:5000/"));
