import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const port = 5000;

app.get("/",async (req,res) => {
    const response = await axios.get(`https://komikindo.tv/komik-terbaru/`);
    const $ = cheerio.load(response.data);
    const data = [];
    let gambar,judul,ch,id;
    $(".listupd").find(".animepost").each((index,element) => {
        gambar = $(element).find(".animposx > a > div > img").attr("src");
        judul = $(element).find(".animposx > div > a > div").text();
        ch = $(element).find(".animposx > div > div > div > a").text();
        id = ($(element).find(".animposx > a").attr("href")).match(/\/([^\/]+)\/?$/)[1];
        data.push({
            gambar,
            judul,
            id,
            ch,
        });
    })
    console.log(data);
    return res.json(data);
});

app.listen(5000,() => console.log("Jalan"));
