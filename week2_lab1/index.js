const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// these are the file paths
const inputFile = path.join(__dirname, "input_countries.csv");
const canadaFile = path.join(__dirname, "canada.txt");
const usaFile = path.join(__dirname, "usa.txt");

// delete files canada+usa
function deleteFileIfExists(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted existing file: ${path.basename(filePath)}`);
    }
}

deleteFileIfExists(canadaFile);
deleteFileIfExists(usaFile);

// create write streams (append mode)
const canadaStream = fs.createWriteStream(canadaFile, { flags: "a" });
const usaStream = fs.createWriteStream(usaFile, { flags: "a" });

// the headers
const headerLine = "country,year,population\n";
canadaStream.write(headerLine);
usaStream.write(headerLine);

console.log("Reading CSV file...");

fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (row) => {
        const country = (row.country || "").trim().toLowerCase();

        // write matching data row
        if (country === "canada") {
            canadaStream.write(`${row.country},${row.year},${row.population}\n`);
        } else if (country === "united states") {
            usaStream.write(`${row.country},${row.year},${row.population}\n`);
        }
    })
    .on("end", () => {
        console.log("CSV file successfully processed.");

        // close
        canadaStream.end();
        usaStream.end();

        console.log("Created files:");
        console.log("- canada.txt");
        console.log("- usa.txt");
    })
    .on("error", (err) => {
        console.error("Error while reading CSV:", err);
    });
