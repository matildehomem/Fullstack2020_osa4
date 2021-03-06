const logger = require('./logger')

// Custom request logger
const requestLogger = (req, res, next) => {
    logger.info('Method: ', req.method)
    logger.info('Path: ', req.path)
    logger.info('Body: ', req.body)
    logger.info('--- END ---')
    next()
}

// Custom error logger
const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'Bad id format.' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError' || error.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Invalid token.'
        })
    }
    next(error)
}

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

const tokenExtractor = (req, res, next) => {
    req.token = getTokenFrom(req)
    next()
}

module.exports = {
    requestLogger,
    errorHandler,
    tokenExtractor
}