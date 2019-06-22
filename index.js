const express = require('express');
const port = process.env.PORT || 3001;
const app = express();
const posts = require('./posts.json');
const comentarios = require('./comments.json')


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

        p.comment = results;
    }

    res.json(p);
});

app.get('/comments', function (req, res) {
    res.json(comments);
});

app.get('/comment/:id', function (req, res) {
    const c =  comments.find((comment) => {
        return comment.id == req.params.id
    });
    res.json(c);
});

