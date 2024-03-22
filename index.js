const express = require ('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://georgedesire06:YeH1dRqfjuhn7rZN@cluster0.hdxcuew.mongodb.net/', {}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error);
});

const roomTypeSchema = new mongoose.Schema({
  name: String
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);

const roomSchema = new mongoose.Schema({
  name: String,
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
  },
  price: Number,
});

const Room = mongoose.model('Room', roomSchema);

app.use(express.json());

// Create RoomType
app.post('/api/v1/room-types', async (req, res) => {
  try {
    const roomType = new RoomType(req.body);
    await roomType.save();
    res.status(201).json(roomType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Get all RoomTypes
app.get('/api/v1/room-types', async (req, res) => {
  try {
    const roomTypes = await RoomType.find();
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Room 
app.post('/api/v1/rooms', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Rooms with optional filters
app.get('/api/v1/rooms', async (req, res) => {
  try {
    const { search, roomType, minPrice, maxPrice } = req.query;
    let filters = {};

    if (search) {
      filters.name = { $regex: search, $options: 'i' };
    }

    if (roomType) {
      filters.roomType = roomType;
    }

    if (minPrice && maxPrice) {
      filters.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    } else if (maxPrice) {
      filters.price = { $lte: parseInt(maxPrice) };
    } else if (minPrice) {
      filters.price = { $gte: parseInt(minPrice) };
    }

    const rooms = await Room.find(filters);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Update Room
app.patch('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findByIdAndUpdate(roomId, req.body, { new: true });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Room
app.delete('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Room by ID
app.get('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 3250;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
