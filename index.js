import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import projectRoutes from './routes/projects.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Storytelling API is running' })
})

app.use('/api/projects', projectRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})