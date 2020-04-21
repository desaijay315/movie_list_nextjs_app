const express = require('express');
const next = require('next');
const path = require('path');
const url = require('url');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

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

} else {
  const nextApp = next({ dir: '.', dev });
  const nextHandler = nextApp.getRequestHandler();

  nextApp.prepare()
    .then(() => {
      const server = express();

      if (!dev) {
        // Enforce SSL & HSTS in production
        server.use(function(req, res, next) {
          var proto = req.headers["x-forwarded-proto"];
          if (proto === "https") {
            res.set({
              'Strict-Transport-Security': 'max-age=31557600' // one-year
            });
            return next();
          }
          res.redirect("https://" + req.headers.host + req.url);
        });
      }
      
      // Static files
      // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
      server.use('/static', express.static(path.join(__dirname, 'static'), {
        maxAge: dev ? '0' : '365d'
      }));
    
      // Example server-side routing
      server.get('/a', (req, res) => {
        return nextApp.render(req, res, '/b', req.query)
      })

      // Example server-side routing
      server.get('/b', (req, res) => {
        return nextApp.render(req, res, '/a', req.query)
      });


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

      // Default catch-all renders Next app
      server.get('*', (req, res) => {
        // res.set({
        //   'Cache-Control': 'public, max-age=3600'
        // });
        const parsedUrl = url.parse(req.url, true);
        nextHandler(req, res, parsedUrl);
      });

      server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Listening on http://localhost:${port}`);
      });
    });
}
