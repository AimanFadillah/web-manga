import express from "express";
import axios from "axios";
import cheerio, { html } from "cheerio";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors()); 

app.get("/search", async (req, res) => {
    const response = await axios.get(`https://komikcast.net/daftar-komik/?title=${req.query.query}`)
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
    const response = await axios.get(`https://komikcast.lol/daftar-komik`);
    const $ = cheerio.load(response.data);
    const data = [];
    $("ul.komiklist_dropdown-menu.c4.genrez").find("li").each((index, element) => {
        data.push({
            nama: $(element).find("label").text().replace(/\s+/g, ' '),
            id: ($(element).find("input").attr("value")),
        });
    });
    return res.json(data);
})

app.get("/manga", async (req, res) => {
    try{
        const response = await axios.get(`https://komikcast.lol/daftar-komik/page/${req.query.page || 1}/?genre=${req.query.genre || ""}&orderby=${req.query.order || ""}`);
        const $ = cheerio.load(response.data);
        const data = [];
        let gambar;
        $(".list-update_items-wrapper").find("div.list-update_item").each((index, element) => {
            data.push({
                gambar : $(element).find(".list-update_item-image > img").attr("src"),
                judul : $(element).find("h3.title").text(),
                score: $(element).find(".numscore").text(),
                slug: ($(element).find(".data-tooltip").attr("href")).split("/")[4],
            });
        });
        return res.json(data);
    }catch(e){
        return res.sendStatus(404);
    }
});

app.get("/manga/:slug", async (req, res) => {
    try{
        const response = await axios.get(`https://komikcast.lol/komik/${req.params.slug}/`);
        const $ = cheerio.load(response.data);
        const chapters = [];
        const genre = [];
        $("ul#chapter-wrapper").find("li").each((index, element) => {
            chapters.push({
                slug: ($(element).find("a.chapter-link-item").attr("href")).split("/")[4],
                nama: ($(element).find("a.chapter-link-item").text()).trim().replace(/\s+/g, ' '),
            })
        }); 
        $(".komik_info-content-genre").find("a").each((index,element) => genre.push($(element).text()));
        const data = { 
            gambar: $(".komik_info-content-thumbnail > img").attr("src"),
            nama: ($(".komik_info-content-body > h1").text()).split("Bahasa Indonesia")[0].trim(),
            status: ($(".komik_info-content-meta > span").eq(2).text()).split("\n")[1].trim(),
            author: ($(".komik_info-content-meta > span").eq(1).text()).split("\n")[1].trim(),
            rilis: ($(".komik_info-content-meta > span").eq(0).text()).split("\n")[1].trim(),
            genre:genre.join(" "),
            deskripsi: $(".komik_info-description").find("p").text(),
            chapters,
        }
        return res.json(data)
    }catch(e){
        return res.sendStatus(404);
    }
})

app.get("/manga/:slug/:chapter", async (req, res) => {
    try{
        const response = await axios.get(`https://komikcast.lol/chapter/${req.params.chapter}/`);
        // const response = await axios.get(`https://komikcast.net/${req.params.chapter}/`);
        const $ = cheerio.load(response.data);
        const data = [];
        $(".main-reading-area").find("img").each((index, element) => {
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
        const response = await axios.get(req.query.url, { responseType: 'arraybuffer' });
        res.header('Content-Type', 'image/jpeg');
        return res.send(response.data);
    } catch (e) {
        return res.send(404);
    }
})

app.get("/test", async (req, res) => {
        const response = await axios.get("https://svr4.imgkc1.my.id/wp-content/img/K/Kuang_Shen/027/001.jpg", { responseType: 'arraybuffer' });
        res.header('Content-Type', 'image/jpeg');
        return res.send(response.data);
})

app.get("/", (req, res) => res.json({ msg: "Success" }))

app.listen(5000, () => console.log("Berjalan di http://localhost:5000/"));
