import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import projectRoutes from './routes/projects.js'
import paymentRoutes from './routes/payments.js'
import aiRoutes from './routes/ai.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())

app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next()
  } else {
    express.json()(req, res, next)
  }
})

app.get('/', (req, res) => {
  res.json({ message: 'Storytelling API is running' })
})

app.use('/api/projects', projectRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/ai', aiRoutes)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})