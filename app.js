
import express from 'express' 
import { PORT } from './config/env.js' 
import userRouter from './Routes/user.routes.js' 
import authRouter from './Routes/auth.routes.js' 
import subcriptionRouter from './Routes/subcription.routes.js' 
import connectToDatabase from './database/mongodb.js' 
import errorMiddleware from './Middlewares/error.middleware.js' 
import arcjetMiddleware from './Middlewares/arcjet.middleware.js' 
import cookieParser from 'cookie-parser' 

// Initialisation de l'application Express
const app = express()

// --------------------------------------------
// Middlewares globaux (à placer AVANT les routes)
// --------------------------------------------

// ✅ Middleware pour parser les requêtes JSON (req.body)
app.use(express.json())

// ✅ Middleware pour parser les données des formulaires
app.use(express.urlencoded({ extended: false }))

// ✅ Middleware pour lire les cookies dans les requêtes entrantes
app.use(cookieParser())

// Middleware pour utiliser Arcjet
app.use(arcjetMiddleware)

// --------------------------------------------
// Enregistrement des routes principales (API)
// --------------------------------------------

// Routes pour les utilisateurs (CRUD utilisateurs)
app.use('/api/v1/users', userRouter)

// Routes pour l'authentification (signin, signout, signup)
app.use('/api/v1/auth', authRouter)

// Routes pour les abonnements
app.use('/api/v1/subcriptions', subcriptionRouter)

// --------------------------------------------
// Route d'accueil simple
// --------------------------------------------
app.get('/', (req, res) => {
  res.send('Welcome on my express Server') 
})

// --------------------------------------------
// Middleware pour gérer les erreurs personnalisées
// (doit être enregistré APRÈS les routes)
// --------------------------------------------
app.use(errorMiddleware)

// --------------------------------------------
// Lancement du serveur Express
// --------------------------------------------
app.listen(PORT, async () => {
  console.log(`✅ Le serveur tourne sur: http://localhost:${PORT}`)

  // Connexion à la base de données MongoDB (asynchrone)
  await connectToDatabase()
})

// Export de l'application Express 
export default app
