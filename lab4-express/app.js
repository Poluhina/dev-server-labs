const express = require('express');
const morgan = require('morgan');
const { NotFoundError, ValidationError, AppError } = require('./errors/CustomErrors');
const catchAsync = require('./utils/catchAsync');

const app = express();
app.use(express.json()); 
app.use(morgan('dev')); 

app.get('/', (req, res) => {
  res.send('Сервер работает! Перейди на /test или /users');
});

app.get('/test', catchAsync(async (req, res, next) => {
  throw new NotFoundError('Тестовая ошибка');
}));

const { body, validationResult } = require('express-validator');

app.post('/users',
  [
    body('name').notEmpty().withMessage('Имя обязательно'),
    body('email').isEmail().withMessage('Неверный email'),
    body('age').optional().isInt({ min: 1 }).withMessage('Возраст должен быть положительным')
  ],
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(
        'Ошибка валидации',
        errors.array().map(e => ({ field: e.param, message: e.msg }))
      );
    }
    res.status(201).json({ status: 'success', data: req.body });
  })
);

app.use((err, req, res, next) => {
  console.error(err); 
  if (err instanceof AppError) {
    const response = { status: 'error', message: err.message };
    if (err.errors) response.errors = err.errors;
    return res.status(err.statusCode).json(response);
  }
  res.status(500).json({ status: 'error', message: 'Внутренняя ошибка сервера' });
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
