import express from 'express'
import Stripe from 'stripe'

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

export default router