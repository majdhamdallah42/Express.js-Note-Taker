const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

router.get('/api/notes', async (req, res) => {
  try {
    const dbJson = await JSON.parse(fs.readFileSync("db/db.json"));
    res.json(dbJson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/api/notes', (req, res) => {
  try {
    const newNote = req.body;
    newNote.id = uuidv4();
    
    const dbJson = JSON.parse(fs.readFileSync("db/db.json"));
    dbJson.push(newNote);
    
    fs.writeFileSync("db/db.json", JSON.stringify(dbJson, null, 2));
    
    res.json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/api/notes/:id', (req, res) => {
  try {
    let data = fs.readFileSync("db/db.json", "utf8");
    const dataJSON = JSON.parse(data);
    const newNotes = dataJSON.filter((note) => note.id !== req.params.id);
    fs.writeFileSync("db/db.json", JSON.stringify(newNotes, null, 2));
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
