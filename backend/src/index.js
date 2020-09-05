const express = require('express')
const cors = require('cors')
const { uuid, isUuid } = require('uuidv4')

const app = express()

app.use(cors())
app.use(express.json())

const projects = []

function logRequests(request, response, next) {

    const { method, url } = request

    const logLabel = `[${method.toUpperCase()}] ${url}`
    
    console.log('logLabel: ', logLabel)

    return next()

}

function validateProjectId(req, res, next) {
    const { id } =  req.params

    if ( !isUuid(id) )
        return res.status(400).json({ error: 'Invalid project ID' })

    return next()

}

app.get('/projects', (req, res) => {

    const { title } = req.query

    const results = title
        ? projects.filter( project => project.title.toLowerCase().includes( title.toLowerCase() ) )
        : projects

    res.json( results )
})

app.post('/projects', (req, res) => {

    const { title, owner } = req.body
    
    const project = { id: uuid(), title, owner }

    projects.push( project )

    res.json( project )
})

app.put('/projects/:id', validateProjectId, (req, res) => {

    const { id } = req.params
    const { title, owner } = req.body
    const projectIndex = projects.findIndex( project => project.id === id )

    if ( projectIndex === -1 )
        res.status(400).json({ error: 'Project not found.' })
    
    projects[projectIndex] = { id, title, owner }

    res.json( projects[projectIndex] )
})

app.delete('/projects/:id', validateProjectId, (req, res) => {

    const { id } = req.params
    const projectIndex = projects.findIndex( project => project.id === id )

    if ( projectIndex === -1 )
        res.status(400).json({ error: 'Project not found.' })
    
    projects.splice( projectIndex, 1 )

    res.status(204).send()
})

app.listen(3333, () => {
    console.log('Backend started')
})
