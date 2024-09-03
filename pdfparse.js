const fs = require('fs').promises; // Use Promises API for fs

async function pdfParse(path) {
    try {
        const data = await fs.readFile(path, 'utf8');
        const rows = data.split(/\r\n|\r|\n/); // Split by any newline characters
        
        const parsedData = rows.map(row => {
            const result = [];
            let insideQuotes = false;
            let value = '';

            for (let char of row) {
                if (char === '"' && !insideQuotes) {
                    insideQuotes = true;
                } else if (char === '"' && insideQuotes) {
                    insideQuotes = false;
                } else if (char === ',' && !insideQuotes) {
                    result.push(value.trim());
                    value = '';
                } else {
                    value += char;
                }
            }
            
            // Push the last value of the row
            result.push(value);
            return result;
        });

        return parsedData;
    } catch (err) {
        throw new Error('Error reading or parsing the file: ' + err.message);
    }
}

module.exports = pdfParse;