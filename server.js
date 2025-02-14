const next = require('next')
const express = require('express');
const bodyParser = require('body-parser')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


const dev = process.env.NODE_ENV !== 'production'
const compression = require('compression');

// const moviesData = require('./data.json')


const filePath = './data.json'
const fs = require('fs')
const path = require('path')
const moviesData = require(filePath)

// Multi-process to utilize all CPU cores.
if (!dev && cluster.isMaster) {
  console.log(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

}else{
  const app = next({ dev })
  const handle = app.getRequestHandler()
  

app.prepare().then(() => {

  const server = express();
  server.use(compression());
  server.use(bodyParser.json())

  server.get('/api/v1/movies', (req, res) => {
    return res.json(moviesData)
  })

  server.post('/api/v1/movies', (req, res) => {
    const movie = req.body;
    moviesData.push(movie);
    const pathToFile = path.join(__dirname, filePath)
    const stringifiedData = JSON.stringify(moviesData, null, 2)

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err)
      }

      return res.json('Movie has been succesfuly added!')
    })
  })

  
  server.get('/api/v1/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = moviesData.find(m => m.id === id)

    return res.json(movie)
  })
  

  server.delete('/api/v1/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = moviesData.findIndex(m => m.id === id)
    moviesData.splice(movieIndex, 1)

    const pathToFile = path.join(__dirname, filePath)
    const stringifiedData = JSON.stringify(moviesData, null, 2)

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err)
      }

      return res.json('Movie has been succesfuly added!')
    })
  })

server.patch('/api/v1/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = req.body
  const movieIndex = moviesData.findIndex(m => m.id === id)

  moviesData[movieIndex] = movie

  const pathToFile = path.join(__dirname, filePath)
  const stringifiedData = JSON.stringify(moviesData, null, 2)

  fs.writeFile(pathToFile, stringifiedData, (err) => {
    if (err) {
      return res.status(422).send(err)
    }

    return res.json(movie)
  })
})

  server.get('*', (req, res) => {
    return handle(req, res)
  })


  const PORT = process.env.PORT || 3000;

  server.use(handle).listen(PORT, (err) => {
    if (err) throw err
    console.log('> Ready on port ' + PORT)
  })
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
}
