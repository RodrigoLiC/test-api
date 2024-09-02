const app = require('express')();
const sqlite3 = require('sqlite3').verbose();
const port = 8080;

app.use(require('express').json());

// Initialize SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
});

// GET /api/users
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.json(rows);
    });
});

// GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    if (!row) {
        return res.status(404).send('User not found');
    }
    res.json(row);
    });
});

// POST /api/users
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function(err) {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email });
    });
});

// PUT /api/users/:id
app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], function(err) {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
        return res.status(404).send('User not found');
    }
    res.json({ id, name, email });
    });
});

// DELETE /api/users/:id
app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
        return res.status(404).send('User not found');
    }
    res.status(204).send();
    });
});