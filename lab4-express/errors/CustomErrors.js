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
