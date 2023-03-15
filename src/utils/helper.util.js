const errorController = (res, statusCode, data) => {
    return res
        .status(data && Number.isInteger(statusCode) ? statusCode : 500)
        .json(data || statusCode || { result: 'error' })
}

const error = (res, e) => {
    console.log('\x1b[31m', { err: e })
    if (e instanceof ReferenceError) {
        return errorController(res, { err: 'ReferenceError' })
    } else if (e instanceof TypeError) {
        return errorController(res, { err: 'TypeError' })
    } else {
        return errorController(res, { err: e })
    }
}

export { error }
