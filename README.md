# Лабораторная работа №1. Введение в Express.js. Создание простого приложения "ToDo List"
# Цель работы
Понять базовую связку Express + MVC: контроллеры, роуты, представления.

Научиться обрабатывать формы (GET/POST), передавать данные в шаблоны и делать redirect после успешной отправки.

Реализовать минимальное приложение без БД с хранением данных в памяти процесса.

# Условие
Разработать приложение "ToDo List" с возможностью:


Просмотра списка задач.

Создания новой задачи.

Переключения статуса задачи (выполнена/не выполнена).

Удаления задачи.

# Шаги выполнения 

# 1) Инициализация проекта

1) создала новую директорию и прешла в нее с помощью следующих команд:

```
   mkdir todo-app
   cd todo-app
2) далее инициализировала новый проект Node.js с помощью команды:
```
 npm init -y

 3) затем установила необходимые зависимости

 4) создала структуру проекта

```
todo-app/
  - app.js
  - package.json
  public/
   - styles.css
  views/
   - index.ejs
   - new.ejs
   - about.ejs
   - 404.ejs
  partials/
   - header.ejs
   - footer.ejs
```

6) настроила окружение для разработки

# 2) Настройки Express
1) создала файл app.js и подключила Express
```
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
```

2) настройка маршрутов

CET / - отображание списка задач

GET /new - форма создания новой задачи

POST /new - обработка формы и добавление задачи

POST /:id/toggle - переключение статуса задачи

POST /:id/delete  - удаление задачи

GET /about - страница "О нас" 

404 - обработка несуществующих страниц

```
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
```
# Контрольные вопросы

1)Чем отличаются HTML-маршруты от REST API?

HTML-маршруты возвращают готовые HTML-страницы, которые отображаются в браузере. 

REST API возвращает данные в формате JSON, без HTML.


2)Что такое res.render и res.json? В каких случаях что использовать?

res.render рендерит шаблон с данными и возвращает HTML. это используется для вею-страниц.

res.json отправляет данные в формате JSON. Используется для API.


3)Что такое middleware в Express и для чего используется express.urlencoded?

middleware - это функции, которые обрабатывают запросы перед тем, как они попадут в основной маршрут.

express.urlencoded - это встроенный middleware Express, который нужен для работы с данными из HTML-форм.




 
