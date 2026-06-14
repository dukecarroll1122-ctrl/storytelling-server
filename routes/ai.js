import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/assist', async (req, res) => {
  try {
    const { prompt, context } = req.body

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a creative writing assistant helping a novelist. Here is the current text they're working on:\n\n${context}\n\nThe writer is asking: ${prompt}\n\nProvide helpful, concise brainstorming or suggestions. Do not write full passages unless asked.`,
        },
      ],
    })

    const text = message.content[0].text
    res.json({ response: text })
  } catch (error) {
    console.error('AI assist error:', error)
    res.status(500).json({ error: 'Failed to get AI response' })
  }
})

export default router