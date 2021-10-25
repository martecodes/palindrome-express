const MongoClient = require('mongodb').MongoClient
const figlet = require('figlet')
const express = require ('express');
const bodyParser= require('body-parser')
const app = express();

var db, collection;

const url = "mongodb+srv://palindrome:leonnoel@cluster0.nrd65.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "palindrome";

app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
      if(error) {
          throw error;
      }
      db = client.db(dbName);
      collection = db.collection('words')
      console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//--------------------POST (create)

app.post('/words', (req, res) => {

  let palindrome = 'not a palindrome'
  let wordArray = req.body.word
  let backwardsArray = new Array()
  for(i = wordArray.length-1; i > -1; i--){
      backwardsArray.push(wordArray[i])
  }
  backwardsArray = backwardsArray.join('')

  backwardsArray == wordArray ? palindrome = 'a palindrome' : palindrome = 'not a palindrome'

  db.collection('words').insertOne({word: wordArray, backwards: backwardsArray, result: palindrome, question: 0}, 
  (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

//--------------------GET (read)

app.get('/', (req, res) => {
  db.collection('words').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {words: result})
  })
})

//--------------------PUT (change)

app.put('/questions', (req, res) => {
  db.collection('words')
  .findOneAndUpdate({
    word: req.body.word, 
    backwards: req.body.backwards, 
    result: req.body.result}, {
    $inc: {
      question: 1,
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


//--------------------DELETE (delete)

app.delete('/words', (req, res) => {
  console.log(req.body)
  db.collection('words').findOneAndDelete({
    word: req.body.word, 
    backwards: req.body.backwards, 
    result: req.body.result}, 
    (err, result) => {
    if (err) return res.send(500, err)
    console.log('deleted from database')
    res.send('Message deleted!')
  })
})