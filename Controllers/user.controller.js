import User from "../Models/user.model.js"

// Logique pour récupérer la liste de tous les utilisateurs (GET)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json({ success: true, data: users })
  } catch (error) {
    next(error)
  }
}

// Logique pour récupérer les infos d'un utilisateur avec son identifiant (GET by id)
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}
