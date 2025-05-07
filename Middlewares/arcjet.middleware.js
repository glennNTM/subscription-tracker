import aj from "../config/arcjet.js"

const arcjetMiddleware = (req, res, next) => {

    (async () => {
        try {
            // Arcjet analyse la requête entrante et prend une décision (autoriser ou bloquer)
            const decision = await aj.protect(req, {requested: 1})

            // Si Arcjet décide de bloquer la requête
            if (decision.isDenied()) {
                // Si c'est à cause d'un dépassement de limite de requêtes
                if (decision.reason.isRateLimit()) 
                    return res.status(429).json({ error: 'Too Many Requests' })

                // Si c'est détecté comme un bot
                if (decision.reason.isBot()) 
                    return res.status(403).json({ error: 'Bot Detected' })

                // Si refusé pour une autre raison
                return res.status(403).json({ error: 'Access Denied' })
            }

            // Si la requête est autorisée, on continue vers le prochain middleware ou route
            next()

        } catch (error) {
            // En cas d’erreur dans le processus de protection, on l'affiche et on continue quand même
            console.log(`Arcjet Middleware Error: ${error}`)
            next()
        }
    })()
}

export default arcjetMiddleware
