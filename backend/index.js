import express from "express";
import axios from "axios";
import cheerio, { html } from "cheerio";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());

app.get("/manga",async (req,res) => {
    const response = await axios.get(`https://mangaid.click/manga-list?page=${req.query.page || 1}`);
    const $ = cheerio.load(response.data);
    const data = [];
    let gambar,judul,genre,slug;
    $(".content").find(".col-sm-6").each((index,element) => {
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
});

app.get("/manga/:slug",async (req,res) => {
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
        nama : $(".dl-horizontal").find("dd").eq(1).text(),
        status : $(".dl-horizontal").find("dd > span").text(),
        author: $(".dl-horizontal").find("dd").eq(2).text(),
        rilis: $(".dl-horizontal").find("dd").eq(3).text(),
        genre: $(".dl-horizontal").find("dd").eq(4).text(),
        views: $(".dl-horizontal").find("dd").eq(5).text(),
        deskripsi : $(".well").find("p").text(),
        chapters,
    }
    return res.json(data)
})

app.listen(5000,() => console.log("Berjalan di http://localhost:5000/"));
