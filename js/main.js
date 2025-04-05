/**
 * Reconnect - Bringing Families Together
 * Main JavaScript File
 */

// Global Variables
let personsData = [];
let filteredPersons = [];
let currentPage = 1;
const itemsPerPage = 6;
let darkMode = localStorage.getItem('darkMode') === 'enabled' ? true : false;

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const resetFiltersBtn = document.getElementById('reset-filters');
const resultsGrid = document.getElementById('results-grid');
const resultsCount = document.getElementById('results-count');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageIndicator = document.getElementById('page-indicator');
const registrationForm = document.getElementById('registration-form');
const institutionLoginForm = document.getElementById('institution-login-form');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('nav');
const notification = document.getElementById('notification');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Mock Statistics for demo purposes
document.getElementById('people-count').textContent = '428';
document.getElementById('reunited-count').textContent = '159';
document.getElementById('institutions-count').textContent = '32';

// Document Ready Event
document.addEventListener('DOMContentLoaded', () => {
    // Apply dark mode if enabled
    if (darkMode) {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeToggle.setAttribute('title', 'Switch to Light Mode');
        }
    }
    
    // Load data from persons.json
    loadDataFromJson();
    
    // Initialize Event Listeners
    initEventListeners();
    
    // Initialize mobile menu toggle directly
    initMobileMenu();
});

// Initialize Event Listeners
function initEventListeners() {
    // Search Button
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Reset Filters Button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Pagination Buttons
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayResults(filteredPersons);
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredPersons.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayResults(filteredPersons);
            }
        });
    }
    
    // Registration Form
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
    
    // Institution Login Form
    if (institutionLoginForm) {
        institutionLoginForm.addEventListener('submit', handleInstitutionLogin);
    }
    
    // Dark Mode Toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Close mobile menu if open
                    if (nav && nav.classList.contains('open')) {
                        nav.classList.remove('open');
                        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                    
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle && nav) {
        // Make sure event listeners are added
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            nav.classList.toggle('open');
            this.innerHTML = nav.classList.contains('open') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            console.log('Mobile menu toggled');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('open') && !nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('open');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// Toggle Dark Mode
function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeToggle.setAttribute('title', 'Switch to Light Mode');
        }
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            darkModeToggle.setAttribute('title', 'Switch to Dark Mode');
        }
    }
    
    showNotification(darkMode ? 'Dark mode enabled' : 'Light mode enabled', 'success');
}

// Load data from persons.json
function loadDataFromJson() {
    fetch('data/persons.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.persons) {
                // Map the data from the file to our application structure
                personsData = data.persons.map(person => {
                    // Get placeholder image
                    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlMGUwZTAiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI5MCIgcj0iNDAiIGZpbGw9IiM5ZTllOWUiLz48cGF0aCBkPSJNMTEwLDIyMCBDMTEwLDE4MCAxOTAsMTgwIDE5MCwyMjAgTDIwMCwyNTAgSDEwMCBaIiBmaWxsPSIjOWU5ZTllIi8+PC9zdmc+';

                    return {
                        id: person.id,
                        name: person.name,
                        age: person.age,
                        gender: person.gender || 'not-specified',
                        category: person.category,
                        description: person.physicalDescription || '',
                        location: person.lastLocation,
                        dateReported: person.dateReported,
                        photoUrl: person.photoUrl,  // Keep the original photoUrl path
                        contactInfo: {
                            name: person.reportingEntity?.name || '',
                            email: person.reportingEntity?.email || '',
                            phone: person.reportingEntity?.phone || ''
                        },
                        additionalDetails: person.additionalDetails || ''
                    };
                });
                
                // Initialize filtered data with all data
                filteredPersons = [...personsData];
                
                // Update statistics
                if (document.getElementById('people-count')) {
                    document.getElementById('people-count').textContent = personsData.length;
                }
                
                // Display initial results if we're on the search page
                if (resultsGrid) {
                    displayResults(filteredPersons);
                }
            } else {
                console.error('Invalid data format in persons.json');
                loadFallbackData();
            }
        })
        .catch(error => {
            console.error('Error loading persons.json:', error);
            loadFallbackData();
        });
}

// Fallback data if JSON loading fails - still tries to use JSON file with a different approach
function loadFallbackData() {
    console.log("Attempting to load persons.json using alternative method...");
    
    // Try using XMLHttpRequest as an alternative
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/persons.json', true);
    xhr.responseType = 'json';
    
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.response && xhr.response.persons) {
            // Successfully loaded JSON data with alternative method
            const data = xhr.response;
            
            // Map the data from the file to our application structure (same as in loadDataFromJson)
            personsData = data.persons.map(person => {
                return {
                    id: person.id,
                    name: person.name,
                    age: person.age,
                    gender: person.gender || 'not-specified',
                    category: person.category,
                    description: person.physicalDescription || '',
                    location: person.lastLocation,
                    dateReported: person.dateReported,
                    photoUrl: person.photoUrl, // Keep the original photoUrl path
                    contactInfo: {
                        name: person.reportingEntity?.name || '',
                        email: person.reportingEntity?.email || '',
                        phone: person.reportingEntity?.phone || ''
                    },
                    additionalDetails: person.additionalDetails || ''
                };
            });
            
            // Initialize filtered data with all data
            filteredPersons = [...personsData];
            
            // Update statistics
            if (document.getElementById('people-count')) {
                document.getElementById('people-count').textContent = personsData.length;
            }
            
            // Display initial results if we're on the search page
            if (resultsGrid) {
                displayResults(filteredPersons);
            }
            
            console.log("Successfully loaded persons.json with alternative method");
        } else {
            console.error("Both fetch and XMLHttpRequest failed to load persons.json");
            useHardcodedData();
        }
    };
    
    xhr.onerror = function() {
        console.error("XMLHttpRequest also failed to load persons.json");
        useHardcodedData();
    };
    
    xhr.send();
}

// Last resort - use hardcoded data only if all JSON loading methods fail
function useHardcodedData() {
    console.warn("Using hardcoded fallback data as last resort");
    
    // This hardcoded data should match the structure in persons.json
    personsData = [
        {
            id: 1,
            name: 'Aisha Patel',
            age: 8,
            gender: 'female',
            category: 'separated',
            description: 'Black hair, brown eyes, small build. Speaks Gujarati and English. Height approximately 4\'2". Wears glasses with purple frames.',
            location: 'Mumbai, India',
            dateReported: '2023-04-12',
            photoUrl: 'img/placeholder.jpg',
            contactInfo: {
                name: 'Mumbai Child Services',
                email: 'childservices@mumbai.gov.in',
                phone: '+91 22 2345 6789'
            },
            additionalDetails: 'Aisha was separated from her family during a crowded festival in Mumbai on April 10, 2023.'
        }
    ];
    
    // Initialize filtered data with all data
    filteredPersons = [...personsData];
    
    // Display initial results if we're on the search page
    if (resultsGrid) {
        displayResults(filteredPersons);
    }
    
    showNotification('Could not load data from persons.json. Using demo data instead.', 'warning');
}

// Handle Search Form Submission
function handleSearch() {
    const locationFilter = document.getElementById('location-filter').value.toLowerCase();
    const ageMinFilter = document.getElementById('age-min').value;
    const ageMaxFilter = document.getElementById('age-max').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    // Filter the data based on search criteria
    filteredPersons = personsData.filter(person => {
        // Location filter
        if (locationFilter && !person.location.toLowerCase().includes(locationFilter)) {
            return false;
        }
        
        // Age range filter
        if (ageMinFilter && parseInt(person.age) < parseInt(ageMinFilter)) {
            return false;
        }
        if (ageMaxFilter && parseInt(person.age) > parseInt(ageMaxFilter)) {
            return false;
        }
        
        // Category filter
        if (categoryFilter && categoryFilter !== 'all' && person.category !== categoryFilter) {
            return false;
        }
        
        // Date filter
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            const personDate = new Date(person.dateReported);
            if (personDate < filterDate) {
                return false;
            }
        }
        
        return true;
    });
    
    // Reset to first page and display results
    currentPage = 1;
    displayResults(filteredPersons);
    
    // Show notification with filter results
    showNotification(`Found ${filteredPersons.length} matching results`, 'success');
}

// Reset Search Filters
function resetFilters() {
    document.getElementById('location-filter').value = '';
    document.getElementById('age-min').value = '';
    document.getElementById('age-max').value = '';
    document.getElementById('category-filter').value = 'all';
    document.getElementById('date-filter').value = '';
    
    // Reset filtered data to all data
    filteredPersons = [...personsData];
    currentPage = 1;
    displayResults(filteredPersons);
    
    showNotification('Filters have been reset', 'success');
}

// Display Results on the Search Page
function displayResults(data) {
    if (!resultsGrid) return;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    
    // Update the results count
    resultsCount.textContent = `${data.length} results found`;
    
    // Update pagination buttons and indicator
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    pageIndicator.textContent = totalPages > 0 
        ? `Page ${currentPage} of ${totalPages}` 
        : 'Page 1 of 1';
    
    // Clear existing results
    resultsGrid.innerHTML = '';
    
    // Display results or "no results" message
    if (paginatedData.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search-minus"></i>
                <p>No matching results found. Try adjusting your search filters.</p>
            </div>
        `;
    } else {
        // Create person cards for each result
        paginatedData.forEach(person => {
            const personCard = createPersonCard(person);
            resultsGrid.appendChild(personCard);
        });
    }
}

// Create a Person Card Element
function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'person-card';
    
    // Map category to display name
    const categoryDisplayNames = {
        'missing': 'Missing Person',
        'orphaned': 'Orphaned Child',
        'homeless': 'Homeless',
        'separated': 'Separated'
    };
    
    // Format date for display
    const reportDate = new Date(person.dateReported);
    const formattedDate = reportDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Simple data URI for a placeholder silhouette image (gray background with person shape)
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlMGUwZTAiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI5MCIgcj0iNDAiIGZpbGw9IiM5ZTllOWUiLz48cGF0aCBkPSJNMTEwLDIyMCBDMTEwLDE4MCAxOTAsMTgwIDE5MCwyMjAgTDIwMCwyNTAgSDEwMCBaIiBmaWxsPSIjOWU5ZTllIi8+PC9zdmc+';
    
    // Determine the image source
    let imgSrc;
    
    // If photoUrl starts with 'data:', it's already a data URI
    if (person.photoUrl && person.photoUrl.startsWith('data:')) {
        imgSrc = person.photoUrl;
    } 
    // If it's a path to an image, check if we have it in localStorage (for demo purposes)
    else if (person.photoUrl && person.photoUrl.startsWith('img/')) {
        const filename = person.photoUrl.replace('img/', '');
        const storedImage = localStorage.getItem(`image_${filename}`);
        
        if (storedImage) {
            // For demo, use the stored data URI since we don't actually save files to the server
            imgSrc = storedImage;
        } else {
            // In a real app, this would be a server path
            imgSrc = person.photoUrl;
        }
    }
    // Use placeholder as last resort
    else {
        imgSrc = placeholderImage;
    }
    
    card.innerHTML = `
        <div class="person-card-header">
            <img src="${imgSrc}" 
                 alt="${person.name}" 
                 onerror="this.src='${placeholderImage}'">
            <span class="person-category">${categoryDisplayNames[person.category]}</span>
        </div>
        <div class="person-card-body">
            <h3>${person.name}</h3>
            <p><strong>Age:</strong> ${person.age}</p>
            <p><strong>Location:</strong> ${person.location}</p>
            <p>${person.description.substring(0, 100)}${person.description.length > 100 ? '...' : ''}</p>
        </div>
        <div class="person-card-footer">
            <span class="person-date">Reported: ${formattedDate}</span>
            <a href="#" class="contact-btn" onclick="contactPerson(${person.id}); return false;">Contact</a>
        </div>
    `;
    
    return card;
}

// Function to handle image uploads
function handleImageUpload(event) {
    const file = event.target.files[0];
    const preview = document.querySelector('.photo-preview');
    const previewWrapper = document.querySelector('.photo-preview-wrapper');
    
    if (!file) {
        previewWrapper.style.display = 'none';
        return;
    }
    
    // Generate a unique filename for the image
    const uniqueFilename = generateUniqueImageName(file.name);
    
    // Store the filename in the input element's data attribute for later use
    event.target.dataset.filename = uniqueFilename;
    
    // Create a URL for the preview
    const reader = new FileReader();
    reader.onload = function(e) {
        // Show preview
        preview.src = e.target.result;
        preview.style.display = 'block';
        previewWrapper.style.display = 'block';
        
        // Store image data in localStorage for local display
        localStorage.setItem(`image_${uniqueFilename}`, e.target.result);
        
        // Upload image to server to save in img folder
        uploadImageToServer(uniqueFilename, e.target.result);
    };
    reader.readAsDataURL(file);
}

// Function to upload image to server
function uploadImageToServer(filename, imageData) {
    // Upload the image to the server's img folder
    fetch('http://localhost:3000/api/upload-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, imageData })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log('Image uploaded successfully to server:', result.path);
            // Store the server path in localStorage for reference
            if (result.path) {
                localStorage.setItem(`imagePath_${filename}`, result.path);
            }
            // No notification needed for successful image upload - it's part of the form process
        } else {
            console.error('Failed to upload image:', result.message);
            // We don't show notification for this since it's part of a larger form process
        }
    })
    .catch(error => {
        console.error('Error uploading image to server:', error);
        // No need to interrupt the user's form submission process here
    });
}

// Function to generate a unique filename
function generateUniqueImageName(originalFilename) {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    const extension = originalFilename.split('.').pop();
    return `image_${timestamp}_${random}.${extension}`;
}

// Handle Person Registration Form Submission
function handleRegistration(event) {
    event.preventDefault();
    
    // Get form values
    const form = event.target;
    const name = form.querySelector('#name').value;
    const age = form.querySelector('#age').value;
    const gender = form.querySelector('#gender').value;
    const category = form.querySelector('#category').value;
    const description = form.querySelector('#description').value;
    const location = form.querySelector('#location').value;
    const contactName = form.querySelector('#contact-name').value;
    const contactPhone = form.querySelector('#contact-phone').value;
    const contactEmail = form.querySelector('#contact-email').value;
    const additionalDetails = form.querySelector('#additional-details') ? 
                            form.querySelector('#additional-details').value : '';
    
    // Get the unique filename from the image upload input
    const photoInput = form.querySelector('#photo');
    let photoUrl = 'img/placeholder.jpg'; // Default to placeholder if no image
    
    if (photoInput.files.length > 0 && photoInput.dataset.filename) {
        // Use the path to the image we've uploaded to the server
        const uniqueFilename = photoInput.dataset.filename;
        photoUrl = `img/${uniqueFilename}`;
        
        // The image should have been uploaded to the server by the handleImageUpload function
        // We just need to set the correct path in the JSON data
        
        // Check to be safe (this would normally have a better UI for errors)
        if (!localStorage.getItem(`image_${uniqueFilename}`)) {
            console.warn('Image data not found in localStorage');
        }
    }
    
    // Show a "processing" notification to indicate work is happening
    showNotification('Processing your submission...', 'info');
    
    // Create a new person object
    const newPerson = {
        id: generateUniqueId(),
        name,
        age,
        gender,
        category,
        description,
        location,
        dateReported: new Date().toISOString().split('T')[0],
        contactInfo: {
            name: contactName,
            phone: contactPhone,
            email: contactEmail
        },
        photoUrl,
        additionalDetails
    };
    
    // Add the new person to our data
    addNewPerson(newPerson);
    
    // Reset the form
    form.reset();
    
    // Hide the preview
    const previewWrapper = document.querySelector('.photo-preview-wrapper');
    previewWrapper.style.display = 'none';
    
    // Refresh the display
    displayPersons(1); // Go to first page to show the new entry
    
    return false;
}

// Handle Institution Login Form Submission
function handleInstitutionLogin(e) {
    e.preventDefault();
    
    // In a real application, this would authenticate the institution
    // credentials against a server
    
    // Simulate failed login for demo purposes
    showNotification('Login feature is not available in this demo version.', 'warning');
}

// Contact a Person (demo functionality)
function contactPerson(id) {
    const person = personsData.find(p => p.id === id);
    
    if (person) {
        const message = `Contact Information for ${person.name}:\n\n` +
                       `Contact: ${person.contactInfo.name}\n` +
                       `Email: ${person.contactInfo.email}\n` +
                       `Phone: ${person.contactInfo.phone}\n\n` +
                       `This feature would normally open a contact form or provide contact details.`;
        
        alert(message);
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    if (!notification) return;
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');
    
    // Automatically hide the notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Save Person Data to JSON (in a real app, this would be a server API call)
function savePersonDataToJson() {
    // Convert personsData to the format expected by persons.json
    const formattedData = {
        persons: personsData.map(person => {
            let photoUrl = 'placeholder';
            
            // If the photoUrl is a data URL, we'd need to save the file on a server
            // For demo, we'll just mark it as a placeholder in the JSON
            if (person.photoUrl && person.photoUrl.startsWith('data:')) {
                photoUrl = 'img/placeholder.jpg';
            } else if (person.photoUrl && !person.photoUrl.startsWith('data:')) {
                photoUrl = person.photoUrl;
            }
            
            return {
                id: person.id,
                name: person.name,
                age: parseInt(person.age),
                gender: person.gender || 'not-specified',
                category: person.category,
                physicalDescription: person.description,
                lastLocation: person.location,
                dateReported: person.dateReported,
                photoUrl: photoUrl,
                additionalDetails: person.additionalDetails || '',
                reportingEntity: {
                    name: person.contactInfo.name,
                    type: 'individual',
                    contactPerson: person.contactInfo.name,
                    email: person.contactInfo.email,
                    phone: person.contactInfo.phone,
                    address: ''
                },
                status: 'active'
            };
        })
    };
    
    // Store the formatted data in localStorage for persistence between page reloads
    localStorage.setItem('personsJsonData', JSON.stringify(formattedData, null, 2));
    
    // Save to the actual file using our server API
    fetch('http://localhost:3000/api/update-persons-json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showNotification('Person data saved to persons.json successfully!', 'success');
            console.log('File updated successfully:', result);
        } else {
            showNotification('Error: ' + result.message, 'error');
            console.error('Error saving file:', result);
            
            // Fallback to clipboard copy if server save fails
            offerClipboardCopy(formattedData);
        }
    })
    .catch(error => {
        console.error('Error saving to server:', error);
        showNotification('Error saving to server. See console for details.', 'error');
        
        // Fallback to clipboard copy if server is not available
        offerClipboardCopy(formattedData);
    });
}

// Offer to copy JSON data to clipboard as a fallback
function offerClipboardCopy(formattedData) {
    const jsonString = JSON.stringify(formattedData, null, 2);
    
    const message = 
        "Could not save to the file automatically. Server might not be running.\n\n" +
        "Please follow these steps to manually update the file:\n\n" +
        "1. Open 'E:\\Temp\\data\\persons.json' in a text editor\n" +
        "2. Replace the contents with the data shown in the browser console\n" +
        "3. Save the file\n\n" +
        "Would you like to copy the JSON data to your clipboard?";
    
    if (confirm(message)) {
        navigator.clipboard.writeText(jsonString)
            .then(() => {
                alert("JSON data copied to clipboard! You can paste it into 'E:\\Temp\\data\\persons.json'");
            })
            .catch(err => {
                console.error('Failed to copy to clipboard:', err);
                alert("Could not copy to clipboard. Please copy the data from the console (press F12).");
            });
    }
}

// Function to generate a unique ID
function generateUniqueId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Add a new person to the data array and update storage
function addNewPerson(person) {
    // Add to our array
    personsData.push(person);
    filteredPersons = [...personsData];
    
    // Update localStorage to keep in-memory data in sync
    localStorage.setItem('personsData', JSON.stringify(personsData));
    
    // In a real application, we'd make an API call to store the data
    console.log('New person added:', person);
    
    // Save in JSON format (this will offer a download)
    savePersonDataToJson();
    
    // Update the UI
    updatePagination();
    
    // Show success message
    showNotification('Person registered successfully!', 'success');
}

// Display paginated person list
function displayPersons(page) {
    // This function is used for displaying persons on the main page
    // while displayResults is used for search results
    if (!resultsGrid) return;
    
    currentPage = page;
    displayResults(filteredPersons);
}

// Update pagination based on current filtered data
function updatePagination() {
    if (!pageIndicator) return;
    
    const totalPages = Math.ceil(filteredPersons.length / itemsPerPage);
    
    // Update pagination controls
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageIndicator.textContent = totalPages > 0 
        ? `Page ${currentPage} of ${totalPages}` 
        : 'Page 1 of 1';
} 