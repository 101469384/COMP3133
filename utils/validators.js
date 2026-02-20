function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function requireFields(obj, fields) {
    for (const f of fields) {
        if (obj[f] === undefined || obj[f] === null || obj[f] === "") {
            return `Missing required field: ${f}`;
        }
    }
    return null;
}

module.exports = { isEmail, requireFields };
