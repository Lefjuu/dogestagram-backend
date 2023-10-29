// const errorController = (res, statusCode, data) => {
//     return res
//         .status(data && Number.isInteger(statusCode) ? statusCode : 500)
//         .json(data || statusCode || { result: 'error' });
// };
// exports.error = (res, e) => {
//     console.log('\x1b[31m', { err: e });
//     if (e instanceof ReferenceError) {
//         return errorController(res, { err: 'ReferenceError' });
//     }
//     if (e instanceof TypeError) {
//         return errorController(res, { err: 'TypeError' });
//     }
//     return errorController(res, { err: e });
// };

exports.makeId = length => {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};
