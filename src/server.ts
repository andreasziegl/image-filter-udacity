import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { Router, Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get("/filteredimage", async (req, res) => {
    let url = req.query.image_url
    if (!url) {
      res.status(400).send({ message: `Please provide a query parameter image_url` });
      return
    }

    try {
      let path = await filterImageFromURL(url);
      res.on('finish', async function(){
        await deleteLocalFiles([path])
      })
      res.sendFile(path)
    } catch (e) {
      res.status(400).send({ message: `could not download an image from ${url}. error: ${e}` })
    }  
  });
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();