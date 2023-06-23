const notFoundError = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};


/// this middleware will parse errors into JSON format
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    /// wide-ranging cast error message
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Invalid resource id';
        statusCode = 404;
    }

    return res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? 'nothing to see here :)' : err.stack,
    });
};

export { notFoundError, errorHandler};