import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import projectRoutes from './routes/projects.js'
import paymentRoutes from './routes/payments.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Storytelling API is running' })
})

app.use('/api/projects', projectRoutes)
app.use('/api/payments', paymentRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})