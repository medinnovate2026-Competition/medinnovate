const dns = require("dns").promises;
const mysql = require("mysql2/promise");

const TRUE_VALUES = new Set(["1", "true", "yes", "require", "required"]);
const FALSE_VALUES = new Set(["0", "false", "no", "disable", "disabled"]);

const ENV_ALIASES = {
  host: ["DB_HOST", "MYSQL_HOST"],
  port: ["DB_PORT", "MYSQL_PORT"],
  user: ["DB_USER", "MYSQL_USER"],
  password: ["DB_PASSWORD", "MYSQL_PASSWORD"],
  database: ["DB_NAME", "MYSQL_DATABASE"],
  ssl: ["DB_SSL", "MYSQL_SSL"],
};

function readFirstEnv(names) {
  const usedName = names.find((name) => process.env[name] && String(process.env[name]).trim() !== "");
  return {
    name: usedName || names[0],
    value: usedName ? String(process.env[usedName]).trim() : "",
  };
}

function readDatabaseConfig() {
  const host = readFirstEnv(ENV_ALIASES.host);
  const port = readFirstEnv(ENV_ALIASES.port);
  const user = readFirstEnv(ENV_ALIASES.user);
  const password = readFirstEnv(ENV_ALIASES.password);
  const database = readFirstEnv(ENV_ALIASES.database);
  const ssl = readFirstEnv(ENV_ALIASES.ssl);

  return {
    host,
    port,
    user,
    password,
    database,
    ssl,
  };
}

function shouldUseSsl(sslValue) {
  const value = String(sslValue || "").trim().toLowerCase();
  if (!value) return true;
  if (FALSE_VALUES.has(value)) return false;
  return TRUE_VALUES.has(value);
}

function getDnsFailureGuidance(config, error) {
  if (!config.host.value) {
    return "Missing environment variable: set DB_HOST or MYSQL_HOST in Railway service Variables.";
  }

  if (error.code === "ENOTFOUND") {
    return [
      "The configured host did not resolve in DNS.",
      "If DB_HOST/MYSQL_HOST is empty in Railway, this is a Railway configuration issue.",
      "If it is set exactly as shown here, verify the Aiven service host and whether Aiven DNS is healthy.",
      "Do not include https://, mysql://, ports, paths, or extra whitespace in DB_HOST/MYSQL_HOST.",
    ].join(" ");
  }

  if (error.code === "EAI_AGAIN") {
    return "DNS lookup timed out or was temporarily unavailable. Retry the deploy and check Railway/Aiven DNS status.";
  }

  return "DNS lookup failed before the MySQL connection attempt.";
}

function getMissingDatabaseEnv(config = readDatabaseConfig()) {
  return ["host", "port", "user", "password", "database"]
    .filter((key) => !config[key].value)
    .map((key) => ENV_ALIASES[key].join(" or "));
}

function getSanitizedDatabaseConfig(config = readDatabaseConfig()) {
  return {
    DB_HOST: config.host.value || undefined,
    DB_PORT: config.port.value || undefined,
    DB_USER: config.user.value || undefined,
    DB_NAME: config.database.value || undefined,
    DB_SSL: shouldUseSsl(config.ssl.value),
  };
}

function logDatabaseStartupDiagnostics(config = readDatabaseConfig()) {
  const sanitized = getSanitizedDatabaseConfig(config);

  console.log("[database] Startup diagnostics", sanitized);
  console.log("[database] Environment variable sources", {
    host: config.host.name,
    port: config.port.name,
    user: config.user.name,
    database: config.database.name,
    ssl: config.ssl.value ? config.ssl.name : "default true",
  });
}

function validateDatabaseEnv(config = readDatabaseConfig()) {
  const missing = getMissingDatabaseEnv(config);

  if (missing.length > 0) {
    const message = [
      "Missing required database environment variables.",
      `Missing: ${missing.join(", ")}.`,
      "This is usually a Railway configuration issue. Add these variables in Railway service Variables, not only in a local .env file.",
    ].join(" ");

    const error = new Error(message);
    error.code = "DB_ENV_MISSING";
    error.missing = missing;
    throw error;
  }

  const parsedPort = Number(config.port.value);
  if (!Number.isInteger(parsedPort) || parsedPort <= 0 || parsedPort > 65535) {
    const error = new Error(`Invalid database port "${config.port.value}". Set DB_PORT or MYSQL_PORT to the Aiven port, for example 17591.`);
    error.code = "DB_PORT_INVALID";
    throw error;
  }

  const host = config.host.value;
  if (/^https?:\/\//i.test(host) || host.includes("/") || host.includes(":")) {
    const error = new Error(`Invalid database host "${host}". Use only the hostname, for example ghcdb-global-health-conclave.h.aivencloud.com.`);
    error.code = "DB_HOST_INVALID";
    throw error;
  }
}

async function resolveDatabaseHostname(config = readDatabaseConfig()) {
  try {
    const addresses = await dns.lookup(config.host.value, { all: true });
    console.log("[database] DNS resolution success", {
      host: config.host.value,
      addresses: addresses.map((address) => `${address.address}/${address.family}`),
    });
    return addresses;
  } catch (error) {
    const missingHost = !config.host.value;
    const classification = missingHost
      ? "Missing environment variable"
      : error.code === "ENOTFOUND"
        ? "Invalid host, Railway DNS issue, or Aiven DNS issue"
        : "DNS resolution failure";

    console.error("[database] DNS resolution failure", {
      classification,
      host: config.host.value || undefined,
      code: error.code,
      message: error.message,
      guidance: getDnsFailureGuidance(config, error),
    });

    const wrapped = new Error(
      missingHost
        ? "Database host is missing. Set DB_HOST or MYSQL_HOST in Railway."
        : `Database host "${config.host.value}" could not be resolved. Verify the Aiven hostname, Railway environment variables, and Aiven DNS status.`,
    );
    wrapped.code = error.code || "DB_DNS_FAILURE";
    wrapped.cause = error;
    throw wrapped;
  }
}

function classifyConnectionError(error) {
  const message = String(error.message || "");

  if (["ENOTFOUND", "EAI_AGAIN"].includes(error.code)) {
    return "DNS resolution failure";
  }
  if (["ER_ACCESS_DENIED_ERROR", "ER_DBACCESS_DENIED_ERROR"].includes(error.code)) {
    return "Authentication failure";
  }
  if (["HANDSHAKE_SSL_ERROR", "ERR_SSL_TLSV1_ALERT_UNKNOWN_CA", "ERR_SSL_WRONG_VERSION_NUMBER"].includes(error.code) || /ssl|tls|certificate/i.test(message)) {
    return "SSL failure";
  }
  if (["ETIMEDOUT", "PROTOCOL_SEQUENCE_TIMEOUT"].includes(error.code) || /timeout/i.test(message)) {
    return "Connection timeout";
  }
  if (["ECONNREFUSED", "ECONNRESET"].includes(error.code)) {
    return "Network connection failure";
  }

  return "Database connection failure";
}

function createPoolFromConfig(config = readDatabaseConfig()) {
  const sslEnabled = shouldUseSsl(config.ssl.value);

  return mysql.createPool({
    host: config.host.value,
    port: Number(config.port.value),
    user: config.user.value,
    password: config.password.value,
    database: config.database.value,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || process.env.MYSQL_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS || process.env.MYSQL_CONNECT_TIMEOUT_MS || 15000),
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
  });
}

const databaseConfig = readDatabaseConfig();
const pool = createPoolFromConfig(databaseConfig);

async function verifyDatabaseConnection() {
  logDatabaseStartupDiagnostics(databaseConfig);
  validateDatabaseEnv(databaseConfig);
  await resolveDatabaseHostname(databaseConfig);

  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query("SELECT 1 AS ok");
      console.log("[database] MySQL connection success", {
        host: databaseConfig.host.value,
        port: databaseConfig.port.value,
        database: databaseConfig.database.value,
        ssl: shouldUseSsl(databaseConfig.ssl.value),
        result: rows[0],
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("[database] MySQL connection failure", {
      classification: classifyConnectionError(error),
      host: databaseConfig.host.value,
      port: databaseConfig.port.value,
      user: databaseConfig.user.value,
      database: databaseConfig.database.value,
      ssl: shouldUseSsl(databaseConfig.ssl.value),
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      message: error.message,
    });
    throw error;
  }
}

module.exports = pool;
module.exports.getMissingDatabaseEnv = getMissingDatabaseEnv;
module.exports.getSanitizedDatabaseConfig = getSanitizedDatabaseConfig;
module.exports.logDatabaseStartupDiagnostics = logDatabaseStartupDiagnostics;
module.exports.resolveDatabaseHostname = resolveDatabaseHostname;
module.exports.validateDatabaseEnv = validateDatabaseEnv;
module.exports.verifyDatabaseConnection = verifyDatabaseConnection;
