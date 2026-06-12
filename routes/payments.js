import express from 'express'
import Stripe from 'stripe'
import prisma from '../db.js'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const PRO_PRICE_ID = 'price_1ThD0SH9mWew0GxBOa7LprSU'
const OUTRIGHT_PRICE_ID = 'price_1ThD2yH9mWew0GxBlX6WmBsk'

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { plan, userId } = req.body

    const priceId = plan === 'pro' ? PRO_PRICE_ID : OUTRIGHT_PRICE_ID
    const mode = plan === 'pro' ? 'subscription' : 'payment'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode,
      success_url: 'http://localhost:5173?payment=success',
      cancel_url: 'http://localhost:5173?payment=cancelled',
      metadata: { userId },
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata.userId
    const mode = session.mode

    const plan = mode === 'subscription' ? 'pro' : 'outright'

    try {
        await prisma.user.upsert({
  where: { id: userId },
  update: {
    plan: plan,
    stripeCustomerId: session.customer,
    subscriptionId: session.subscription || null,
  },
  create: {
    id: userId,
    email: `${userId}@storytelling.app`,
    name: userId,
    plan: plan,
    stripeCustomerId: session.customer,
    subscriptionId: session.subscription || null,
  },
})
  
      console.log(`User ${userId} upgraded to ${plan}`)
    } catch (err) {
      console.error('Error updating user plan:', err)
    }
  }

  res.json({ received: true })
})

export default router