const asyncHandler = (requestHandler) =>
    (req, res, next) => {
        Promise.resolve(req, res, next)
            .catch((err) => next(err));
    };


export { asyncHandler };








// USING TRY AND CATCH FOR 
/*
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
*/

