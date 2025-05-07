import jwt from 'jsonwebtoken'
import User from "../Models/user.model.js"
import { JWT_SECRET } from "../config/env.js"

// Middleware d'autorisation pour protéger certaines routes
const authorize = async (req, res, next) => {
  try {
    let token

    // ✅ Vérifie si un token est présent dans l'en-tête Authorization (sous forme "Bearer <token>")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Récupère le token en le découpant à partir de l'en-tête
      token = req.headers.authorization.split(' ')[1]
    }

    // ❌ Si aucun token, on renvoie une erreur 401 (non autorisé)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // ✅ Vérifie et décode le token JWT
    const decoded = jwt.verify(token, JWT_SECRET)

    // ✅ Recherche de l'utilisateur correspondant à l'ID dans le token
    const user = await User.findById(decoded.userId)

    // ❌ Si l'utilisateur n'existe pas, accès refusé
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // ✅ On attache l'utilisateur trouvé à la requête pour l'utiliser dans les routes protégées
    req.user = user

    // ✅ On passe au middleware ou à la route suivante
    next()

  } catch (error) {
    // ❌ Si une erreur survient (ex: token invalide ou expiré), on renvoie une erreur 401
    res.status(401).json({ message: 'Unauthorized', error: error.message })
  }
}

export default authorize