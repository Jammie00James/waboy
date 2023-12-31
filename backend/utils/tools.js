function generateToken() {
    const min = 100000; // Smallest 6-digit number (100000)
    const max = 999999; // Largest 6-digit number (999999)
    const ran = Math.floor(Math.random() * (max - min + 1)) + min;
    return ran.toString()
}

function isDateTime(str) {
    const dateTime = new Date(str);
    return !isNaN(dateTime.getTime());
}

module.exports = { generateToken, isDateTime }