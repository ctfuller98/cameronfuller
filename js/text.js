// main.js
import { parse } from 'https://cdn.jsdelivr.net/npm/csv-parse/browser/esm/index.min.js';

async function fetchGoogleDocData(url) {
    /**
     * Fetches the raw text content of a Google Doc given its URL.
     *
     * @param {string} url - The URL of the Google Doc.
     * @returns {Promise<string>} The raw text content of the document.
     */
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const content = doc.body.textContent;
    return content;
}

function parseGridData(csvData) {
    /**
     * Parses grid data from the raw CSV text of the Google Doc.
     *
     * @param {string} csvData - The raw CSV content of the document.
     * @returns {Object} A dictionary with (x, y) coordinates as keys and characters as values.
     */
    const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true
    });

    const grid = {};
    for (const record of records) {
        const x = parseInt(record['x-coordinate']);
        const y = parseInt(record['y-coordinate']);
        const char = record['Character'];
        grid[`${x},${y}`] = char;
    }

    return grid;
}

function renderGrid(grid) {
    /**
     * Renders the grid as a string of characters, filling missing spaces with ' '.
     *
     * @param {Object} grid - A dictionary with (x, y) coordinates as keys and characters as values.
     * @returns {string} The rendered grid as a single string.
     */
    if (!Object.keys(grid).length) return '';

    const coords = Object.keys(grid).map(key => key.split(',').map(Number));
    const maxX = Math.max(...coords.map(coord => coord[0]));
    const maxY = Math.max(...coords.map(coord[1]));

    const rows = [];
    for (let y = 0; y <= maxY; y++) {
        const row = [];
        for (let x = 0; x <= maxX; x++) {
            row.push(grid[`${x},${y}`] || ' ');
        }
        rows.push(row.join(''));
    }

    return rows.join('\n');
}

async function printUnicodeGrid(docUrl) {
    /**
     * Fetches and prints the grid of Unicode characters from the Google Doc.
     *
     * @param {string} docUrl - The URL of the Google Doc.
     */
    const rawData = await fetchGoogleDocData(docUrl);
    const grid = parseGridData(rawData);
    console.log(renderGrid(grid));
}

// Example usage
const docUrl = 'https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub';
printUnicodeGrid(docUrl);
