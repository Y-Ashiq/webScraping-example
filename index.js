import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { Parser } from "@json2csv/plainjs";
import fs from "fs";

const app = express();
const port = 3000;

const saved_data = [];
const url =
  "https://books.toscrape.com/catalogue/category/books/mystery_3/index.html";

const getHTML = async () => {
  try {
    const parser = new Parser();
    const resData = await axios.get(url);

    const $ = cheerio.load(resData.data);

    const books = $("article");

    books.each(function () {
      let title = $(this).find("h3 a").text();
      let price = $(this).find("p.price_color").text();

      saved_data.push({ title, price });
    });
    const csv = parser.parse(saved_data);
    fs.writeFileSync("./books.csv", csv);
  } catch (error) {
    console.error(error);
  }
};
getHTML();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
