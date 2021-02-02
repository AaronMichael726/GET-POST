const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts') // provides a template
const fs = require('fs')
// const { parse } = require('path')


// middleWare -- everything has to pass through app.use
app.use(expressLayouts) // tells us if there is a layout and then use the file
app.use(express.urlencoded({extended: false}))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('Hit there')
})

// index view 
// this 
app.get('/dinosaurs', (req, res) => {
    let dinos = fs.readFileSync('./dinosaurs.json')
    dinos = JSON.parse(dinos)
    console.log(dinos)
    res.render('dinosaurs/index', {dinos: dinos}) // notices res.render points directly to "a" views folder
    //  you cannot have another folder name you must create a "views" dir
})

//NEW View
app.get('/dinosaurs/new', (req, res) => {
    res.render('dinosaurs/new')
})

// notice index is the param 
app.get('/dinosaurs/:index', (req, res) => {
    let dinos = fs.readFileSync('./dinosaurs.json')
    dinos = JSON.parse(dinos)

    // req.params.index to grab the param value
    const dino = dinos[req.params.index]
    res.render('dinosaurs/show', {dino})
})

// POST route
app.post('/dinosaurs', (req, res) => {
    let dinos = fs.readFileSync('./dinosaurs.json')
    dinos = JSON.parse(dinos)
    
    // adds the inputs from req.body
    const newDino = {
        name: req.body.name,
        type: req.body.type
    }

    // updates the dino array.
    dinos.push(newDino)
    // path you want to write to
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinos))

    // get request to /dinosaurs
    res.redirect('/dinosaurs')
    console.log(req.body)
})


const PORT = process.env.port || 8000
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})