const db = require("../config/database");

function serializeMember(row) {
  return {
    id: row.id,
    section: row.section,
    name: row.name,
    role: row.role || "",
    phone: row.phone || "",
    email: row.email || "",
    photo_url: row.photo_url || "",
    display_order: Number(row.display_order || 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function readPayload(body) {
  const displayOrder = Number(body.display_order ?? body.order ?? 0);

  return {
    section: String(body.section || "").trim(),
    name: String(body.name || "").trim(),
    role: String(body.role || "").trim(),
    phone: String(body.phone || "").trim(),
    email: String(body.email || "").trim(),
    photo_url: String(body.photo_url || body.photo || "").trim(),
    display_order: Number.isFinite(displayOrder) ? displayOrder : 0,
  };
}

function validateMember(member) {
  if (!member.section) return "Section is required.";
  if (!member.name) return "Name is required.";
  return "";
}

async function listMembers(_req, res) {
  const [rows] = await db.query(
    "SELECT * FROM organising_committee ORDER BY section ASC, display_order ASC, id ASC",
  );
  return res.json({ items: rows.map(serializeMember) });
}

async function createMember(req, res) {
  const member = readPayload(req.body);
  const validationMessage = validateMember(member);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  const [result] = await db.query(
    `INSERT INTO organising_committee (section, name, role, phone, email, photo_url, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      member.section,
      member.name,
      member.role,
      member.phone,
      member.email,
      member.photo_url,
      member.display_order,
    ],
  );
  const [rows] = await db.query("SELECT * FROM organising_committee WHERE id = ?", [result.insertId]);

  return res.status(201).json({ item: serializeMember(rows[0]) });
}

async function updateMember(req, res) {
  const member = readPayload(req.body);
  const validationMessage = validateMember(member);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  const [result] = await db.query(
    `UPDATE organising_committee
     SET section = ?, name = ?, role = ?, phone = ?, email = ?, photo_url = ?, display_order = ?
     WHERE id = ?`,
    [
      member.section,
      member.name,
      member.role,
      member.phone,
      member.email,
      member.photo_url,
      member.display_order,
      req.params.id,
    ],
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Committee member not found." });
  }

  const [rows] = await db.query("SELECT * FROM organising_committee WHERE id = ?", [req.params.id]);
  return res.json({ item: serializeMember(rows[0]) });
}

async function deleteMember(req, res) {
  const [result] = await db.query("DELETE FROM organising_committee WHERE id = ?", [req.params.id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Committee member not found." });
  }

  return res.json({ success: true });
}

module.exports = {
  createMember,
  deleteMember,
  listMembers,
  updateMember,
};
