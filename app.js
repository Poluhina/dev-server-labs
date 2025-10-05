const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

let todos = [];

app.get('/', (req, res) => {
    res.render('index', { todos});
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', (req, res) => {
    const { task } = req.body;
    if (task) {
        todos.push({ id: Date.now(), text: task, done: false});
    }
    res.redirect('/');
});

app.post('/:id/toggle', (req, res) => {
    const id = Number(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
    res.redirect('/');
});

app.post('/:id/delete', (req, res) => {
    const id = Number(req.params.id);
    todos = todos.filter(t => t.id !== id);
    res.redirect('/');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});