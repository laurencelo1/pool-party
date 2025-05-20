const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourcePath = path.join(__dirname, 'src', 'assets', 'logo.png');
const destPath = path.join(__dirname, 'public', 'logo.png');

try {
    // Read the source file
    const data = fs.readFileSync(sourcePath);

    // Write to destination
    fs.writeFileSync(destPath, data);

    console.log('✅ Successfully copied logo.png to public directory');
} catch (err) {
    console.error('Error copying logo.png:', err.message);
}
