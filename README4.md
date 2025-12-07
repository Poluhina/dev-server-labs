# Лабораторная работа №4. Обработка ошибок, валидация и логгирование
# Цель работы
Целью данной лабораторной работы является изучение методов обработки ошибок, валидации данных и логгирования в приложениях на Node.JS с использованием Express.

# Условие
# Шаг 1. Обработка ошибок

В папке errors, в файле CustomErrors.js классы ошибок.
```
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Ресурс не найден') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Ошибка валидации', errors = []) {
    super(message, 400);
    this.errors = errors; 
  }
}

module.exports = { AppError, NotFoundError, ValidationError };

```

App.js создан обработчик ошибок
```
app.use((err, req, res, next) => {
  console.error(err); 
  if (err instanceof AppError) {
    const response = { status: 'error', message: err.message };
    if (err.errors) response.errors = err.errors;
    return res.status(err.statusCode).json(response);
  }
  res.status(500).json({ status: 'error', message: 'Внутренняя ошибка сервера' });
});
```
# Шаг 2. Валидация данных
1) Использовала библиотеку express-validator для маршрута /users
2) Создан POST-маршрут /users с проверкой полей
```
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
```
# Шаг 3. Логгирование
Подключила библиотеку morgan для логирования HTTP-запросов
```
const morgan = require('morgan');
app.use(morgan('dev'));
```
Ошибки выводятся через console.error в глобальном обработчике ошибок.
# Контрольные вопросы
1) Какие преимущества централизованной обработки ошибок в Express?

Преимущества: повышение стабильности сервера, то есть ошибки корректо обрабатываются даже если они произошли в асинхронном коде. Упрощение кода маршрута, то есть не нужно писать обработку ошибок в каждом маршруте.

2) Какие категории логов вы решили вести в системе и чем обусловлен ваш выбор?

Логи HTTP-запросов, ведутся с помощью morgan. Логируется метод запроса, URL, статус ответа и время обработки. Это позволякт отсвлеживать активность пользователей и проверять корректность работы серверных маршрутов.

Использование morgan  и console.error позволяет видеть и успешные запросы, и ошибки в процессе работы сервера.

3) Какие существуют подходы к валидации данных в Express и какие из них вы использовали?

К существующим подходам относится, ручная проверка данных, то есть проверка полей через if и выброс ошибок.

В работе использовала, express-validator для маршрута /users.
