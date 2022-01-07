const PORT =process.env.PORT || 8000 //this is for deploying on heroku
const express = require('express')
const cheerio = require("cheerio")
const axios = require("axios")

const app = express()

const newspapers = [
    {
        name: "thetimes",
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base:''
    },
    {
        name: "theguardian",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base:''
    },
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/climate-change",
        base:"https://www.telegraph.co.uk/"
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")',html).each(function(){
                const title = $(this).text()
                const url = newspaper.base + $(this).attr("href")
                articles.push(
                    {
                        title,
                        url,
                        source: newspaper.name
                    }
                )
            })
        })
})

app.get("/", (req,res)=>{
    res.json("cendouz")
})
app.get("/news", (req,res)=>{
    // axios.get("https://www.theguardian.com/environment/climate-crisis")
    //     .then((response)=>{
    //         const html = response.data
    //         //console.log(html)
    //         const $ = cheerio.load(html)

    //         $('a:contains("climate")', html).each(function(){
    //             const title = $(this).text()
    //             const url = $(this).attr("href")
    //             articles.push({
    //                 title,
    //                 url
    //             })
    //         })
    //         res.json(articles)
    //     }).catch((err)=>{
    //         console.log(err)
    //     })
    res.json(articles)
})

app.get("/news/:newspaperId", (req,res)=>{
    const newspaperId = req.params.newspaperId

    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId)[0]

    const newspaperAddress = newspaper.address
    const newspaperBase = newspaper.base

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $("a:contains('climate')", html).each(function(){
            const title = $(this).text()
            const url = $(this).attr("href")
            specificArticles.push(
                {
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                }
            )
        })
        res.json(specificArticles)
    }).catch(err=>console.log(err))
})

app.listen(PORT, ()=>{
    console.log(`server running on PORT ${PORT}`)
})