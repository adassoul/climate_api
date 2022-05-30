const PORT = process.env.PORT || 8000 //this is for deploying on heroku
const express = require('express') //relates paths to code
const cheerio = require("cheerio") //html elements
const axios = require("axios") //http client crud operations

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

// gérer la liste des informations à afficher
newspapers.forEach(newspaper => {
    // pour chaque "newspaper" : 
    axios.get(newspaper.address) //accéder à son adresse
        .then((response)=>{ //la réponse de la requête est response
            const html = response.data //data sont les données 
            const $ = cheerio.load(html) //load html dans $ pour utiliser jQuery dans javascript avec nodejs

            $('a:contains("climate")',html).each(function(){ //chercher les <a xxxxxclimatexxx...
                const title = $(this).text() //prendre le texte de cette balise et le mettre dans titre
                const url = newspaper.base + $(this).attr("href") //construire l'url (base + xxxx) avec (href="xxxx")
                articles.push( //remplir la liste articles
                    {
                        title,
                        url,
                        source: newspaper.name //ajouter le nom du journal qui n'existait pas dans l'objet newspaper de la liste newspapers 
                    }
                )
            })
        })
})

app.get("/", (req,res)=>{ // gérer le endpoint /
    res.json("cendouz") //post un string avec la méthode json sur le res (response)
})

app.get("/news", (req,res)=>{  // gérer le endpoint /news
    //1
    res.json(articles) // post la liste articles avec res et json
})

app.get("/news/:newspaperId", (req,res)=>{ //gérer le endpoint /news/:newspaperId
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

    // 1
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