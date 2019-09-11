import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from 'path';

// const articlesInfo={
//     'learn-react':{
//         upvotes:0,
//         comments:[]
//     },
//     'learn-node':{
//         upvotes:0,
//         comments:[]
//     },
//     'my-thoughts-on-resumes':{
//         upvotes:0,
//         comments:[]
//     }
// }

// USE node SERVER COMMAND "npx babel-node src/server.js"
// it using localhost:8000 as base address, if you want to change it go down and change the listening port
const app = express();

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());

//TESTING AND PRACTICE
app.get('/hello',(req,res)=>res.send('Hello'));
app.get('/hello/:name',(req,res)=>res.send(`hello ${req.params.name}`))
app.post('/hello',(req,res)=>res.send(`Hello ${req.body.name}!`));
app.post('/hello',(req,res)=>res.send("Helloo "+ req.body.name+"!"));

//CHECK THESE IN POSTMAN, FORMAT FOR EACH URL IS GIVEN
// app.post('/api/articles/:name/upvote', (req, res) => { // JUST REPLACE :name WITH ANY OF THE ABOVE
//   const articleName = req.params.name;                 // learn-rect or learn-node and paste it as 
//                                                        // localhost:8000/api/articles/learn-react/upvote

//   articlesInfo[articleName].upvotes += 1;
//   res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`);
// });

// app.post('/api/articles/:name/add-comment', (req, res) => {
//   const { username, text } = req.body;//IN POST REQUEST SEND {"username":"anything","text":"any comment"}
//   const articleName = req.params.name;

//   articlesInfo[articleName].comments.push({ username, text });

//   res.status(200).send(articlesInfo[articleName]);
// res.status(200).send(`${articlesInfo[articlesName].comments[0].username}: \n\t${articlesInfo[articlesName].comments[0].text}`);
// });

app.listen(8000, () => console.log("Listening on port 8000"));


                        // MONGODB

app.get("/api/articles/:name", async (req, res) => {
    const articleName = req.params.name;

    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true
    });
    const db = client.db("my-blog");

    const articlesInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).send(articlesInfo);
    client.close();

});

app.get('/hello',(req,res)=>res.send('Hello'));
app.get('/hello/:name',(req,res)=>res.send(`hello ${req.params.name}`))
app.post('/hello',(req,res)=>res.send(`Hello ${req.body.name}!`));
// app.post('/hello',(req,res)=>res.send("Helloo "+ req.body.name+"!"));

app.post("/api/articles/:name/upvote", async (req, res) => {
  const articlesName = req.params.name;

  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true
  });
  const db = client.db("my-blog");

  const articlesInfo = await db
    .collection("articles")
    .findOne({ name: articlesName });
  await db.collection("articles").updateOne(
    { name: articlesName },
    {
      $set: {
        upvotes: articlesInfo.upvotes + 1
      }
    }
  );

  const updatearticlesInfo = await db
    .collection("articles")
    .findOne({ name: articlesName });
  res.status(200).send(updatearticlesInfo);
});

app.post("/api/articles/:name/add-comment", async (req, res) => {
  const { username, text } = req.body;
    const articleName = req.params.name;

    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true
    });
    const db = client.db("my-blog");

    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    await db.collection("articles").updateOne(
      { name: articleName },
      {
        $set: {
          comments: articleInfo.comments.concat({ username, text })
        }
      }
    );
    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(updatedArticleInfo);

    client.close();
});

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
})


