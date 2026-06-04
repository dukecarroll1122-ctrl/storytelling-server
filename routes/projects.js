import express from 'express'
import prisma from '../db.js'

const router = express.Router()

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { lastEdited: 'desc' },
    })
    res.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, type, folders, statuses, docData, labels, userId } = req.body
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: `${userId}@storytelling.app`, name: userId },
    })
    const project = await prisma.project.create({
      data: { name, type, folders, statuses, docData, labels, userId },
    })
    res.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, type, folders, statuses, docData, labels } = req.body
    const project = await prisma.project.update({
      where: { id },
      data: { name, type, folders, statuses, docData, labels, lastEdited: new Date() },
    })
    res.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.project.delete({ where: { id } })
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

router.post('/:projectId/documents', async (req, res) => {
  try {
    const { projectId } = req.params
    const { docId, content } = req.body
    const existing = await prisma.document.findFirst({
      where: { projectId, docId }
    })
    let document
    if (existing) {
      document = await prisma.document.update({
        where: { id: existing.id },
        data: { content },
      })
    } else {
      document = await prisma.document.create({
        data: { projectId, docId, content },
      })
    }
    res.json(document)
  } catch (error) {
    console.error('Error saving document:', error)
    res.status(500).json({ error: 'Failed to save document' })
  }
})

router.get('/:projectId/documents/:docId', async (req, res) => {
  try {
    const { projectId, docId } = req.params
    const document = await prisma.document.findFirst({
      where: { projectId, docId },
    })
    res.json(document || { content: '' })
  } catch (error) {
    console.error('Error fetching document:', error)
    res.status(500).json({ error: 'Failed to fetch document' })
  }
})

export default router
