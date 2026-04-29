const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db'); // Adjust path to your MySQL connection module
const authenticateToken = require('../middleware/auth');

// POST /admin/login
router.post('/login', (req, res) => {
  const { adminId, password } = req.body;

  // Validate single master credential against environment variables
  if (adminId === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// GET /admin/teams
router.get('/teams', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id AS team_id, 
        t.team_name,
        p.id AS participant_id, 
        p.name, 
        p.email, 
        p.college, 
        p.country
      FROM teams t
      LEFT JOIN participants p ON t.id = p.team_id
      ORDER BY t.id ASC, p.id ASC
    `);

    // Group query results into nested structure by team
    const teamsMap = {};
    rows.forEach(row => {
      if (!teamsMap[row.team_id]) {
        teamsMap[row.team_id] = { team_name: row.team_name, members: [] };
      }
      // Include participants if they exist
      if (row.participant_id) {
        teamsMap[row.team_id].members.push({
          name: row.name,
          email: row.email,
          college: row.college,
          country: row.country
        });
      }
    });

    res.json(Object.values(teamsMap));
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

module.exports = router;