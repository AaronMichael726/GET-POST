const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts') // provides a template
const fs = require('fs')
// const { parse } = require('path')
// methodsOverride 
const methodOverride = require('method-override')


// middleWare -- everything has to pass through app.use
app.use(expressLayouts) // tells us if there is a layout and then use the file
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('Hit there')
})

// GET route
// this 
// app.get('/dinosaurs', (req, res) => {
//     let dinos = fs.readFileSync('./dinosaurs.json')
//     dinos = JSON.parse(dinos)
//     console.log(req.query.nameFilter)

//     let nameToFilterBy = req.query.nameFilter
//     // filter uses a for each loop - takes in param which is the function that exists within the for: each loop
//     const newFilteredArray = dinos.filter((dinosaurObj) => { 
//         if (dinosaurObj.name.toLowerCase() === nameToFilterBy.toLowerCase()) {return true}
//     })

//     if (nameToFilterBy) {dinos = newFilteredArray}

//     console.log(newFilteredArray)
//     res.render('dinosaurs/index', {dinos: dinos}) // notices res.render points directly to "a" views folder
//     //  you cannot have another folder name you must create a "views" dir
// })

app.get('/dinosaurs', (req, res)=> {
    let dinos = fs.readFileSync('./dinosaurs.json')
    // take our data and put it in a more readable format
    dinos = JSON.parse(dinos)
    console.log(req.query.nameFilter)
    let nameToFilterBy = req.query.nameFilter
    // array method filter
    console.log(nameToFilterBy)
    
    // if there is no submit of the form
    // this will be undefined, and we will returnb all dinos
    if (nameToFilterBy) {
        const newFilteredArray = dinos.filter((dinosaurObj) => {
            if (dinosaurObj.name.toLowerCase() === nameToFilterBy.toLowerCase()) {
                return true
            }
        })
        dinos = newFilteredArray
    }
    // console.log(dinos)
    // in our views folder render this page
    res.render('dinosaurs/index', {dinos: dinos} )
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

// DELETE
// within HTML there are only two methods "GET" and "POST" for "PUT" "DELETE" you need to override
app.delete('/dinosaurs/:idx', (req, res) => {
    
    // create the dinosaurs array
    const dinosaurs = fs.readFileSync('./dinosaurs.json')
    const dinosaursArray = JSON.parse(dinosaurs)

    // intermediate variable for index
    let idx = Number(req.params.idx)

    //remove dinosaur using splice method
    dinosaursArray.splice(idx, 1)

    // save the new dino array in dino.json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaursArray))

    //redirect to dinosaurs/
    res.redirect('/dinosaurs') // notice this is a route and not a file
})


const PORT = process.env.port || 8000
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})