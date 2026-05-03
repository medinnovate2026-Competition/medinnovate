import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://medinnovate2026-competition.github.io",
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= DB ================= */
const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

 db.getConnection((err, connection) => {
  if (err) {
    console.error("DB Connection Error:", err);
    // ❗ DO NOT crash app
    return;
  }
  console.log("MySQL Connected ✅");
  connection.release();
 });

/* ================= AUTH ================= */
app.post("/api/admin/login", (req, res) => {
  const { adminId, password } = req.body;

  if (
    adminId === process.env.ADMIN_ID &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

/* ================= MIDDLEWARE ================= */
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/* ================= GET TEAMS ================= */
app.get("/api/admin/teams", verify, (req, res) => {
  console.log("Fetching all teams...");
  const sql = `
    SELECT t.id as team_id, t.team_name, t.payment_method, t.payment_status, t.transaction_ref,
           p.name, p.email, p.college, p.country
    FROM teams t
    LEFT JOIN participants p ON t.id = p.team_id
    ORDER BY t.id
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("SQL Error fetching teams:", err);
      return res.status(500).json({ error: "Database error fetching teams" });
    }

    const grouped = {};

    rows.forEach((row) => {
      if (!grouped[row.team_id]) {
        grouped[row.team_id] = {
          id: row.team_id,
          team_name: row.team_name,
          payment_method: row.payment_method,
          payment_status: row.payment_status,
          transaction_ref: row.transaction_ref, // ✅ fixed: was row.utr
          members: [],
        };
      }

      if (row.name) {
        grouped[row.team_id].members.push({
          name: row.name,
          email: row.email,
          college: row.college,
          country: row.country,
        });
      }
    });

    res.json(Object.values(grouped));
  });
});

/* ================= REGISTER ================= */
app.post("/api/register-upi", (req, res) => {
  const { team_name, members, utr } = req.body;

  if (!team_name || !utr || !members || members.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const validMembers = members.filter((m) => m.name && m.email);
  if (validMembers.length === 0) {
    return res.status(400).json({ error: "At least one member with name and email is required" });
  }

  console.log("Registering team:", { team_name, utr, memberCount: validMembers.length });

  db.query(
    "INSERT INTO teams (team_name, payment_method, payment_status, transaction_ref) VALUES (?, ?, ?, ?)",
    [team_name, "upi", "pending", utr], // ✅ fixed: column was wrongly named utr
    (err, result) => {
      if (err) {
        console.error("SQL Error inserting team:", err);
        return res.status(500).json({ error: "Failed to insert team" });
      }

      const teamId = result.insertId;
      console.log(`Team created with ID: ${teamId}`);

      const values = validMembers.map((m) => [
        teamId,
        m.name,
        m.email,
        m.college || null,
        m.country || null,
      ]);

      db.query(
        "INSERT INTO participants (team_id, name, email, college, country) VALUES ?",
        [values],
        (err) => {
          if (err) {
            console.error("SQL Error inserting participants:", err);
            // Roll back the team too
            db.query("DELETE FROM teams WHERE id = ?", [teamId]);
            return res.status(500).json({
              error: err.code === "ER_DUP_ENTRY"
                ? "One or more email addresses are already registered."
                : "Failed to insert participants",
            });
          }
          console.log("Participants added successfully!");
          res.json({ message: "Registered successfully" });
        }
      );
    }
  );
});

/* ================= VERIFY TEAM ================= */
app.put("/api/admin/verify/:id", verify, (req, res) => {
  const teamId = req.params.id;
  db.query(
    "UPDATE teams SET payment_status = 'verified' WHERE id = ? OR team_name = ?",
    [teamId, teamId],
    (err) => {
      if (err) {
        console.error("SQL Error verifying team:", err);
        return res.status(500).json({ error: "Database error verifying team" });
      }
      res.json({ message: "Team verified successfully" });
    }
  );
});

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

setInterval(() => {
  db.query("SELECT 1", (err) => {
    if (err) {
      console.error("Keep-alive failed:", err.message);
    } else {
      console.log("DB keep-alive ping");
    }
  });
}, 4 * 60 * 1000); // every 4 minutes

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});