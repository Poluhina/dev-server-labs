const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../errors/CustomErrors');
const catchAsync = require('../utils/catchAsync');

router.post('/',
  [
    body('name').notEmpty().withMessage('Имя обязательно'),
    body('email').isEmail().withMessage('Неправильный email'),
    body('age').optional().isInt({ min: 1 }).withMessage('Возраст должен быть положительным')
  ],
  catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Ошибка валидации', errors.array().map(e => ({ field: e.param, message: e.msg })));
    }
    res.status(201).json({ status: 'success', data: req.body });
  })
);

module.exports = router;
