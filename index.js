const express = require('express');
const port = process.env.PORT || 3001;
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const posts = require('./posts.json');
const comments = require('./comments.json')
const fs = require('fs');
const bodyParser = require('body-parser')


// Security with Helmet
app.use(helmet());

// enable  CORS requests
app.use(cors());

// Log HTTP requests
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(port, () => {
   console.log('listening on: ' + port);
});

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   next();
});


app.get('/', function (req, res) {
    var d = new Date();
    var n = d.toLocaleTimeString();
    res.send(n + '<br>Olá <b>mundo</b>!')
});

app.get('/posts', function (req, res) {
    res.json(posts);
});

app.get('/post/:id', function (req, res) {
    const p =  posts.find((post) => {
        return post.id == req.params.id
    });

    if (req.query.q === 'comments') {
        const results = comments.filter(
            comment => comment.post_id == req.params.id
        );

        p.comments = results;
    }
    res.json(p);
});

app.put('/updateReactions', function (req, res) {

    const p =  posts.map((post) => {
        post.reactions[req.body.reaction] = post.id == req.body.post_id ? req.body.value : post.reactions[req.body.reaction];
        return post;
    });

    let resposta = {
        success: false,
        msg: ''
    };

    try {

        fs.writeFileSync('./posts.json', JSON.stringify(p))

        resposta.success = true;
        resposta.msg = 'Reaction casted!'

    } catch (err) {

        resposta.msg = 'Error writing to file'    

    }
   
    res.json(resposta)
    
});



app.get('/comments', function (req, res) {
    res.json(comments);
});

app.post('/comments', function (req, res) {

    const new_comment_id = comments.length + 1;

    const new_comment = {
        id: new_comment_id,
        post_id: req.body.post_id,
        author: req.body.author,
        email: req.body.email,
        date: req.body.date,
        content: req.body.content
    }

    comments.push(new_comment);

    let resposta = {
        success: false,
        msg: ''
    };

    try {
        fs.writeFileSync('./comments.json', JSON.stringify(comments))
        resposta.success = true;
        resposta.msg = 'Comment added!'
    } catch (err) {
        resposta.msg = 'Error adding comment!'    
    }

    console.log(comments);
   
    res.json(resposta)
});

app.get('/comment/:id', function (req, res) {
    const c =  comments.find((comment) => {
        return comment.id == req.params.id
    });
    res.json(c);
});

