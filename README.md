# Reconnect - Bringing Families Together

A compassionate web platform dedicated to reuniting missing persons, orphaned children, homeless individuals, and those separated from their families with their loved ones.

## Features

- User-friendly interface for displaying information about missing persons, orphaned children, and homeless individuals
- Searchable database with filters for location, age, category, and date
- Registration form for adding new individuals to the system
- Dark mode for better accessibility and user comfort
- Responsive design that works on both desktop and mobile devices



## Running the Application

### Client-side Only (Basic Demo)

Simply open `index.html` in your web browser to run the client-side application.

### Full Functionality with Server

For full functionality, including saving data to the persons.json file and storing images in the img folder, you need to run the server:

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 12 or higher)
2. Install required packages by running:
   ```
   npm install express fs path body-parser cors
   ```
3. Start the server:
   ```
   node server.js
   ```
4. The server will start on http://localhost:3000
5. Open http://localhost:3000 in your browser to use the application with full functionality

When running with the server:
- Person registrations will be saved to `data/persons.json`
- Uploaded images will be stored in the `img` folder
- All data will persist between sessions

## File Structure

- `index.html` - Main HTML file
- `css/styles.css` - Main stylesheet
- `js/main.js` - Main JavaScript file
- `data/persons.json` - JSON data for persons
- `data/institutions.json` - JSON data for institutions
- `img/` - Directory for images
- `server.js` - Server for handling file operations

## Dark Mode

Toggle between light and dark mode using the moon/sun icon in the header.

## Development

This project uses:
- HTML5
- CSS3 with CSS Variables for theming
- Vanilla JavaScript
- FontAwesome for icons
- Google Fonts for typography
- Express.js for the server (optional)

## License

This project is for humanitarian purposes and is freely available for use by relevant organizations.

## Customization and Extension

To customize the platform:

1. Modify `css/styles.css` to change the appearance
2. Edit `js/main.js` to alter functionality
3. Update `index.html` to change content and structure

## Production Considerations

For a production deployment:

1. Implement proper backend with database storage
2. Set up user authentication and authorization
3. Implement image upload and storage
4. Add form validation and security measures
5. Consider internationalization for multiple languages
6. Implement analytics to track usage and success rates

## Contact

For questions or support, please contact:
- Email: support@reconnect.org
- Phone: +1 (555) 123-4567

## Acknowledgments

- Font Awesome for the icon library
- Google Fonts for the Montserrat font family
- All organizations working to reunite families worldwide

---

**Note**: This is a demonstration project. In a real implementation, additional security measures, backend functionality, and legal considerations would need to be addressed.

# Reconnect - Family Reunification Platform 🤝

A compassionate web platform designed to help reunite families by facilitating the search for missing persons.

![Project Preview](https://raw.githubusercontent.com/ShadowStudio-no1/Reconnect-/refs/heads/main/img/previe.png)

## 🚀 Features

- Interactive web interface for managing missing persons data
- Real-time data updates
- Image upload functionality
- RESTful API endpoints
- Responsive design for all devices
- Data persistence using JSON storage

## 💻 Tech Stack

### **Frontend**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Responsive Design](https://img.shields.io/badge/Responsive%20Design-000000?logo=responsive&logoColor=white&label=Responsive+Design)

### **Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)

### **Dependencies**

![express](https://img.shields.io/badge/express-%5E4.18.2-blue)
![body-parser](https://img.shields.io/badge/body--parser-^1.20.1-yellow)
![cors](https://img.shields.io/badge/cors-^2.8.5-lightgrey)
![fs](https://img.shields.io/badge/fs-Built--in-green)
![path](https://img.shields.io/badge/path-Built--in-orange)

---

### Backend
- Node.js
- Express.js (v4.18.2)
- RESTful API Architecture

### Dependencies
- `express`: Web application framework
- `body-parser`: Request body parsing
- `cors`: Cross-Origin Resource Sharing
- `fs`: File system operations
- `path`: File path operations

## 📁 Project Structure

```
reconnect/
├── css/                  # Stylesheet files
├── data/                 # JSON data storage
├── img/                  # Image assets and uploads
├── js/                   # JavaScript files
├── node_modules/         # Dependencies
├── index.html           # Main web interface
├── server.js            # Backend server
├── package.json         # Project configuration
└── README.md            # Documentation
```

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd reconnect
   ```

2. **Install Node.js**
   - Download and install from [https://nodejs.org/](https://nodejs.org/)
   - Minimum required version: 12.x

3. **Install dependencies**
   ```bash
   npm install
   ```

## 🚀 Running the Application

1. **Start the server**
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```

2. **Access the application**
   - Open your browser and navigate to: `http://localhost:3000`
   - The server will automatically create required directories (data/ and img/)

## 🔌 API Endpoints

### GET `/api/status`
- Check server status and directory permissions
- Returns server time and directory information

### POST `/api/update-persons-json`
- Update persons data
- Accepts JSON payload with persons array

### POST `/api/upload-image`
- Upload person images
- Accepts base64 encoded image data

## 🌐 Deployment

### Prerequisites
- Node.js environment
- npm (Node Package Manager)
- Sufficient storage for images and data

### Deployment Steps
1. Set up your production environment
2. Clone the repository
3. Install dependencies: `npm install`
4. Configure environment variables if needed
5. Start the server: `npm start`

### Deployment Platforms
- Heroku
- DigitalOcean
- AWS
- Any Node.js compatible hosting

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
