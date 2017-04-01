const express = require("express")
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const router = express.Router()
const Spooky = require('spooky')

const spooky = new Spooky({
  child: {
    transport: 'http'
  },
  casper: {
    logLevel: 'debug',
    verbose: true
  }
}, function (err) {
  if (err) {
    e = new Error('Failed to initialize SpookyJS');
    e.details = err;
    throw e;
  }
});

spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
        console.log(stack);
    }
});

spooky.on('imgurl', function(url) {
  this.download(url, 'aaa.jpg')
})

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});



router.get("/", function(req, res, next) {
  res.render("index", { title: "500PX Spider" })
})

router.post("/", function(req, res, next) {
  const url = req.body.url
  if (!url) {
    return res.send({ msg: "请输入URL" })
  }

  spooky.start(url, function() {
    this.waitFor(function check() {
      return this.evaluate(function() {
        return !!$("#content > div > div.photo-focus-region > div > div > img").attr("src")
      })
    }, function then() {
      this.emit('imgurl', this.evaluate(function () {
          return $("#content > div > div.photo-focus-region > div > div > img").attr("src")
      }))
    })
  })
  spooky.run()

  // request(url, (err, response, body) => {
  //   if (err) {
  //     return res.send({ msg: "抓取图片失败" })
  //   }
  //   if (response && response.statusCode == 200) {
  //     const $ = cheerio.load(body)
  //     const imgSrc =$("#content > div > div.photo-focus-region > div > div > img").attr("src");
  //     console.log(imgSrc);
  //     if (!imgSrc) {
  //       return res.send({ msg: "找不到图片URL" })
  //     }
  //     const imgName = imgSrc.split("/").pop()
  //     downloadFile(imgSrc, imgName, () => {
  //       return res.send({ msg: "下载完毕" })
  //     })
  //   }
  // })
})

// function downloadFile(url, fileName, callback) {
//   const stream = fs.createWriteStream(fileName)
//   request(url).pipe(stream).on("close", callback)
// }

module.exports = router
