import dayjs from 'dayjs'
import Subscription from '../Models/subscription.model.js'
// Permet d'utiliser des modules CommonJS avec import ES Modules
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// On importe la méthode 'serve' pour créer un workflow avec Upstash
const { serve } = require('@upstash/workflow/express')

// Liste des jours avant renouvellement pour envoyer un rappel
const REMINDERS = [7, 5, 2, 1]

// Fonction principale appelée automatiquement par Upstash QStash
export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload

    // On récupère l'abonnement depuis la base de données
    const subscription = await fetchSubscription(context, subscriptionId)

    // Si l'abonnement est inexistant ou inactif, on arrête
    if (!subscription || subscription.status !== 'active') {
        console.log(`Subscription not active or not found: ${subscriptionId}`)
        return
    }

    // Date de renouvellement 
    const renewalDate = dayjs(subscription.renewalDate)
    if (!renewalDate.isValid()) {
        console.log(`Invalid renewal date for subscription ${subscription.id}`)
        return
    }

    // On parcourt les rappels programmés
    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day')

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before renewal`, reminderDate)
        }

        await triggerReminder(context, `Reminder ${daysBefore} days before renewal`)
    }
})

// Récupère un abonnement avec les infos de l'utilisateur
const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email')
    })
}

// Attend jusqu'à une date précise pour envoyer un rappel
const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} at ${date.toISOString()}`)
    await context.sleepUntil(label, date.toDate())
}

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label}`)
    })
}
