const express = require('express')
const router = express.Router()
const RoomCodeMap = require('./models/RoomCodeMap')
const RoomUserCount = require('./models/RoomUserCount')
const authRoute = require('./routes/auth')

router.use('/auth', authRoute)
// Endpoint to handle receiving code
router.post('/receivecode', async (req, res) => {
  const { roomId } = req.body

  try {
    const roomMap = await RoomCodeMap.findOne({ roomId })
    if (roomMap) {
      res.json({ code: roomMap.code })
    } else {
      res.status(404).json({ error: 'Code not found for the specified room' })
    }
  } catch (error) {
    console.error('Error retrieving code from database:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Endpoint to handle help request
router.post('/help', (req, res) => {
  console.log('hi', req.body)
  res.status(200).json({ message: 'Form submitted' })
})

// Endpoint to handle deleting room entry
router.post('/delete-entry', async (req, res) => {
  const { roomId } = req.body
  //   console.log("hi", roomId);

  try {
    const room = await RoomUserCount.findOne({ roomId })
    if (!room) {
      return res.status(200).json({ message: 'Room not found' })
    }
    if (room.userCount !== 0) {
      return res.status(200).json({ message: 'done' })
    }

    const deletedRoomCodeMap = await RoomCodeMap.findOneAndDelete({ roomId })

    if (!deletedRoomCodeMap) {
      return res.status(404).json({ error: 'Room code map entry not found' })
    }

    return res.json({ message: 'Room code map entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting room code map entry:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
