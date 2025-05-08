import Subscription from "../Models/subscription.model.js"
import { Client } from '@upstash/workflow'
const qstash = new Client({ token: process.env.QSTASH_TOKEN });

export const createSubscription = async (req, res, next) => {
  try {
    // Création de l'abonnement
    const subscription = await Subscription.create({ ...req.body, user: req.user._id });

    // Lancement du workflow via QStash
    const response = await qstash.publishJSON({
      url: process.env.WORKFLOW_URL, // l'URL de ton workflow Upstash
      body: { subscriptionId: subscription._id },
    });

    // Retourne l'abonnement + l'ID du workflow lancé
    res.status(201).json({
      success: true,
      data: subscription,
      workflowRunId: response.messageId // parfois nommé messageId, à confirmer avec la doc Upstash
    });
  } catch (error) {
    next(error);
  }
};


export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Vérification de l’identité
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.statusCode = 401;
            throw error;
        }

        // Récupération des abonnements de l'utilisateur
        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}

