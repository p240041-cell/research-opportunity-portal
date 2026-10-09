require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend'))); // serves the frontend

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'research_portal',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true // DATE columns come back as "YYYY-MM-DD"
});

const TEXT_FIELDS = ['title', 'description', 'research_area', 'faculty_name', 'department', 'required_skills'];
const FIELDS = [...TEXT_FIELDS, 'available_positions', 'application_deadline', 'status'];

function validate(b) {
  const errors = [];
  TEXT_FIELDS.forEach(k => {
    if (typeof b[k] !== 'string' || !b[k].trim()) errors.push(`${k} is required`);
  });
  const n = Number(b.available_positions);
  if (b.available_positions === '' || b.available_positions == null || !Number.isInteger(n) || n < 1)
    errors.push('available_positions must be a whole number >= 1');
  if (typeof b.application_deadline !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.application_deadline) ||
      isNaN(Date.parse(b.application_deadline)))
    errors.push('application_deadline must be a valid date (YYYY-MM-DD)');
  if (!['Open', 'Closed'].includes(b.status)) errors.push("status must be 'Open' or 'Closed'");
  return errors;
}

const clean = b => FIELDS.map(k => (typeof b[k] === 'string' ? b[k].trim() : b[k]));
const wrap = fn => (req, res, next) => fn(req, res).catch(next);
const validId = id => /^\d+$/.test(id);

async function findOne(id) {
  const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [id]);
  return rows[0];
}

// 1. Create
app.post('/api/opportunities', wrap(async (req, res) => {
  const body = { status: 'Open', ...req.body };
  const errors = validate(body);
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  const [r] = await pool.query(
    `INSERT INTO opportunities (${FIELDS.join(',')}) VALUES (?,?,?,?,?,?,?,?,?)`, clean(body));
  res.status(201).json(await findOne(r.insertId));
}));

// 2. Get all
app.get('/api/opportunities', wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM opportunities ORDER BY id DESC');
  res.status(200).json(rows);
}));

// 3. Get one
app.get('/api/opportunities/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'ID must be a positive number' });
  const row = await findOne(req.params.id);
  if (!row) return res.status(404).json({ error: `Opportunity ${req.params.id} not found` });
  res.status(200).json(row);
}));

// 4. Update (partial updates allowed, e.g. only { "status": "Closed" })
app.put('/api/opportunities/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'ID must be a positive number' });
  const existing = await findOne(req.params.id);
  if (!existing) return res.status(404).json({ error: `Opportunity ${req.params.id} not found` });
  const merged = { ...existing, ...req.body };
  const errors = validate(merged);
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  await pool.query(
    `UPDATE opportunities SET ${FIELDS.map(k => k + '=?').join(',')} WHERE id=?`,
    [...clean(merged), req.params.id]);
  res.status(200).json(await findOne(req.params.id));
}));

// 5. Delete
app.delete('/api/opportunities/:id', wrap(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'ID must be a positive number' });
  const [r] = await pool.query('DELETE FROM opportunities WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ error: `Opportunity ${req.params.id} not found` });
  res.status(200).json({ message: `Opportunity ${req.params.id} deleted` });
}));

// Unknown API routes
app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
