/**
 * Simple server for the Reconnect application
 * This script allows updating the persons.json file from client-side requests
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Process command line arguments to get the project root
const args = process.argv.slice(2);
let customProjectRoot = null;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--root' && i + 1 < args.length) {
        customProjectRoot = args[i + 1];
        break;
    }
}

const app = express();
const PORT = 3000;

// Get the project root directory
// If --root is provided, use that, otherwise use current working directory
const projectRoot = customProjectRoot ? path.resolve(customProjectRoot) : process.cwd();
console.log('Using project root directory:', projectRoot);

// Log available files and directories in the project root
try {
    const files = fs.readdirSync(projectRoot);
    console.log('Files and directories in project root:');
    files.forEach(file => {
        const filePath = path.join(projectRoot, file);
        const isDir = fs.statSync(filePath).isDirectory();
        console.log(`- ${file} ${isDir ? '(directory)' : '(file)'}`);
    });
} catch (error) {
    console.error('Error reading project directory:', error);
}

// Configure middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(projectRoot)); // Serve files from the project root

// Simple diagnostic endpoint
app.get('/api/status', (req, res) => {
    const dataDir = path.join(projectRoot, 'data');
    const imgDir = path.join(projectRoot, 'img');
    
    const status = {
        status: 'ok',
        serverTime: new Date().toISOString(),
        projectRoot,
        directories: {
            data: {
                path: dataDir,
                exists: fs.existsSync(dataDir),
                writable: isDirectoryWritable(dataDir)
            },
            img: {
                path: imgDir,
                exists: fs.existsSync(imgDir),
                writable: isDirectoryWritable(imgDir)
            }
        }
    };
    
    return res.json(status);
});

// Function to check if a directory is writable
function isDirectoryWritable(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            return false;
        }
        
        // Try to write a test file
        const testFile = path.join(dirPath, '.write-test');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        return true;
    } catch (error) {
        console.error(`Directory ${dirPath} is not writable:`, error);
        return false;
    }
}

// API endpoint to update persons.json file
app.post('/api/update-persons-json', (req, res) => {
    try {
        const data = req.body;
        // Use a relative path within the project
        const filePath = path.join(projectRoot, 'data', 'persons.json');
        
        // Make sure the data is valid
        if (!data || !data.persons || !Array.isArray(data.persons)) {
            return res.status(400).json({ success: false, message: 'Invalid data format' });
        }
        
        // Make sure the data directory exists
        const dataDir = path.join(projectRoot, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log(`Created directory: ${dataDir}`);
        }
        
        // Check if the directory is writable
        if (!isDirectoryWritable(dataDir)) {
            return res.status(500).json({ 
                success: false, 
                message: 'Data directory is not writable',
                path: dataDir
            });
        }
        
        // Write the data to the file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        
        console.log(`File updated: ${filePath}`);
        return res.json({ 
            success: true, 
            message: 'persons.json updated successfully',
            path: filePath
        });
    } catch (error) {
        console.error('Error updating file:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to update file', 
            error: error.message,
            stack: error.stack
        });
    }
});

// API endpoint to handle image uploads
app.post('/api/upload-image', (req, res) => {
    try {
        const { filename, imageData } = req.body;
        
        if (!filename || !imageData) {
            return res.status(400).json({ success: false, message: 'Missing filename or image data' });
        }
        
        // Extract base64 data
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Create directory if it doesn't exist - use relative path within the project
        const imgDir = path.join(projectRoot, 'img');
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
            console.log(`Created directory: ${imgDir}`);
        }
        
        // Check if the directory is writable
        if (!isDirectoryWritable(imgDir)) {
            return res.status(500).json({ 
                success: false, 
                message: 'Image directory is not writable',
                path: imgDir
            });
        }
        
        // Write the file
        const filePath = path.join(imgDir, filename);
        fs.writeFileSync(filePath, buffer);
        
        console.log(`Image saved: ${filePath}`);
        return res.json({ 
            success: true, 
            message: 'Image uploaded successfully', 
            path: `img/${filename}`,
            fullPath: filePath
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to upload image', 
            error: error.message,
            stack: error.stack
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API endpoints available:`);
    console.log(`- GET /api/status`);
    console.log(`- POST /api/update-persons-json`);
    console.log(`- POST /api/upload-image`);
    console.log(`Project root: ${projectRoot}`);
    
    // Log important directories
    const dataDir = path.join(projectRoot, 'data');
    const imgDir = path.join(projectRoot, 'img');
    
    console.log(`Data directory: ${dataDir} (${fs.existsSync(dataDir) ? 'exists' : 'does not exist'})`);
    console.log(`Image directory: ${imgDir} (${fs.existsSync(imgDir) ? 'exists' : 'does not exist'})`);
    
    // Create directories if they don't exist
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log(`Created data directory: ${dataDir}`);
    }
    
    if (!fs.existsSync(imgDir)) {
        fs.mkdirSync(imgDir, { recursive: true });
        console.log(`Created image directory: ${imgDir}`);
    }
    
    // Check if directories are writable
    console.log(`Data directory writable: ${isDirectoryWritable(dataDir)}`);
    console.log(`Image directory writable: ${isDirectoryWritable(imgDir)}`);
});

/**
 * Instructions for use:
 * 
 * 1. Install Node.js if not already installed (https://nodejs.org/)
 * 2. Install required packages with the command:
 *    npm install express fs path body-parser cors
 * 3. Run this server with:
 *    node server.js
 *    
 *    To specify a custom project root directory, use:
 *    node server.js --root /path/to/project
 *    
 * 4. The server will handle API requests from the client application
 *    and save files to the project directories (data/ and img/)
 */ 