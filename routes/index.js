const express = require("express")
const request = require('request')
const cheerio = require('cheerio')
const superagent = require('superagent');
const fs = require('fs');
const router = express.Router()

router.get("/", function(req, res, next) {
  res.render("index", { title: "500PX Spider" })
})

router.post("/", function(req, res, next) {
  const url = req.body.url
  if (!url) {
    return res.send({ msg: "请输入URL" })
  }

  request(url, (err, response, body) => {
    if (err) {
      return res.send({ msg: "抓取图片失败" })
    }
    if (response && response.statusCode == 200) {
      const $ = cheerio.load(body)
      const imgSrc =$("#content > div > div.photo-focus-region > div > div > img").attr("src");
      console.log(imgSrc);
      if (!imgSrc) {
        return res.send({ msg: "找不到图片URL" })
      }
      const imgName = imgSrc.split("/").pop()
      downloadFile(imgSrc, imgName, () => {
        return res.send({ msg: "下载完毕" })
      })
    }
  })
})

function downloadFile(url, fileName, callback) {
  const stream = fs.createWriteStream(fileName)
  request(url).pipe(stream).on("close", callback)
}

module.exports = router
