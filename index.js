const express = require('express');
const port = process.env.PORT || 3001;
const app = express();
const posts = require('./posts.json');
const comentarios = require('./comentarios.json')


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
    // console.log(req);
    res.send(n + '<br>Olá <b>mundo</b>!<br>DO GITHUB')
});

app.get('/posts', function (req, res) {
    res.json(posts);
});

app.get('/post/:id', function (req, res) {
    const p =  posts.find((post) => {
        return post.id == req.params.id
    });
    /*

    if (req.query.q === 'comentarios') {
        const resultados = comentarios.filter(
            comentario => comentario.post_id == req.params.id
        );

        p.comentario = resultados;
    }
*/
    res.json(p);
});

app.get('/comentarios', function (req, res) {
    res.json(comentarios);
});

app.get('/comentario/:id', function (req, res) {
    const c =  comentarios.find((comentario) => {
        return comentario.id == req.params.id
    });
    res.json(c);
});

