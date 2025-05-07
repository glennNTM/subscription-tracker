import aj from "../config/arcjet.js"

const arcjetMiddleware = (req, res, next) => {

    (async () => {
        try {
        const decision = await aj.protect(req)

        } catch (error) {
            console.log('Arcjet Middleware Error: ${error} ')
            next()
        }
    })()
}