import express from "express";
import axios from "axios";
import cheerio, { html } from "cheerio";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());

app.get("/search", async (req, res) => {
    // const response = await axios.get(`https://mangaid.click/search?query=${req.query.query}`)
    // return res.json(response.data.suggestions);
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
    // const response = await axios.get(`https://mangaid.click/manga-list?page=1&sortBy=views`);
    // const $ = cheerio.load(response.data);
    // const data = [];
    // $(".list-category").find("li").each((index,element) => {
    //     data.push({
    //         nama:$(element).find("a").text(),
    //         id:($(element).find("a").attr("href")).split("?cat=")[1],
    //     })
    // });
    // return res.json(data);
    const response = await axios.get(`https://komikcast.net/daftar-genre/`);
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
    // try{
    //     const response = await axios.get(`
    //     https://mangaid.click/filterList?page=${req.query.page || 1}&cat=${req.query.cat || ""}&alpha=&sortBy=${req.query.sortBy || "views"}&asc=${req.query.asc || false}&author=&artist=&tag=`);
    //     const $ = cheerio.load(response.data);
    //     const data = [];
    //     let gambar,judul,genre,slug;
    //     $("body").find(".col-sm-6").each((index,element) => {
    //         gambar = $(element).find("div > div > a > img").attr("src");
    //         judul = $(element).find("div > .media-body > h5 > a > strong").text();
    //         genre = $(element).find(`div > .media-body > div`).eq(2).text();
    //         slug = ($(element).find("div > div > a ").attr("href")).split("/")[4];
    //         data.push({
    //             gambar,
    //             judul,
    //             genre,
    //             slug,
    //         })
    //     });
    //     return res.json(data);
    // }catch(e){
    //     return res.sendStatus(404);
    // }
    const response = await axios.get(`https://komikcast.net/daftar-komik/page/${req.query.page || 1}/?genre=${req.query.genre || ""}&order=${req.query.order || ""}`);
    const $ = cheerio.load(response.data);
    const data = [];
    let gambar;
    $(".film-list").find(".animepost").each((index, element) => {
        gambar = $(element).find(".animposx > a > div > img").attr("src");
        data.push({
            gambar: gambar && gambar.includes("?") ? gambar.split("?")[0] : gambar,
            judul: $(element).find(".animposx > .bigors > a > div > h4").text(),
            score: $(element).find(".animposx > .bigors > .adds > .rating > i").text(),
            slug: ($(element).find(".animposx > a").attr("href")).split("/")[4],
        });
    });
    return res.json(data);
});

app.get("/manga/:slug", async (req, res) => {
    // try{
    //     const response = await axios.get(`https://mangaid.click/manga/${req.params.slug}`);
    //     const $ = cheerio.load(response.data);
    //     const chapters = [];
    //     $(".chapters").find("li").each((index,element) => {
    //         chapters.push({
    //             slug : ($(element).find("h5 > a").attr("href")).split("/")[5],
    //             nama: $(element).find("h5 > a").text(),
    //         })
    //     });
    //     const data = {
    //         gambar : $(".boxed").find("img").attr("src"),
    //         status : $(".dl-horizontal").find("dd > span").text(),
    //         nama: $("h1.widget-title").text(),
    //         author: $(".dl-horizontal").find("dd").eq(3).text(),
    //         rilis: $(".dl-horizontal").find("dd").eq(4).text(),
    //         genre: $(".dl-horizontal").find("dd").eq(5).text(),
    //         deskripsi : $(".well").find("p").text(),
    //         chapters,
    //     }
    //     return res.json(data)
    // }catch(e){
    //     return res.sendStatus(404);
    // }
    const response = await axios.get(`https://komikcast.net/komik/${req.params.slug}/`);
    const $ = cheerio.load(response.data);
    const chapters = [];
    $(".bxcl.scrolling > ul").find("li").each((index, element) => {
        chapters.push({
            slug: ($(element).find(".lchx > a").attr("href")).split("/")[3],
            nama: $(element).find(".lchx > a").text().replace(/\n/g, ""),
        })
    });
    const data = {
        gambar: $(".thumb").find("img").attr("src"),
        nama: ($("h1.entry-title").text()).split("Komik\n")[1],
        status: ($(".spe > span").eq(1).text()).split("\n")[1],
        author: ($(".spe > span").eq(3).text()).split("\n")[1],
        rilis: ($(".spe > span").eq(5).text()).split("\n")[1],
        genre: ($(".genre-info").text()).replace(/\n/g, " "),
        deskripsi: ($(".entry-content.entry-content-single").find("p").text()).replace(/\n/g, " "),
        chapters,
    }
    return res.json(data)
})

app.get("/manga/:slug/:chapter", async (req, res) => {
    // try {
    //     const response = await axios.get(`https://mangaid.click/manga/${req.params.slug}/${req.params.chapter}/1`);
    //     const $ = cheerio.load(response.data);
    //     const data = [];
    //     $("#all").find("img").each((index, element) => {
    //         data.push({
    //             gambar: $(element).attr("data-src"),
    //         });
    //     });
    //     return res.json(data);
    // } catch (e) {
    //     return res.sendStatus(404);
    // }
    const response = await axios.get(`https://komikcast.net/${req.params.chapter}/`);
    const $ = cheerio.load(response.data);
    const data = [];
    $("#anjay_ini_id_kh").find("img").each((index, element) => {
        data.push({
            gambar: $(element).attr("src"),
        });
    });
    return res.json(data);
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

app.get("/", (req, res) => res.json({ msg: "Success" }))

app.listen(5000, () => console.log("Berjalan di http://localhost:5000/"));
