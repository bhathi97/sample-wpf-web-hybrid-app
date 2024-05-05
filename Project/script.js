// UI widgets
// Get references to the input field for country name and the search button
let countryName = document.getElementById("txt-country-input");
let searchButton = document.getElementById("btn-search");

// Add event listener to the search button to handle click events
searchButton.addEventListener('click', async () => {
    // Trim any whitespace from the input value and retrieve the country name
    const country = countryName.value.trim();
    // Call the function to fetch data for the entered country
    await getCountryData(country);
});

// Function to fetch data for a specific country
async function getCountryData(country) {
    // Construct the URL for the API request using the provided country name
    const url = `https://country55.p.rapidapi.com/api/countries?country=${country}`;
    // Set up options for the fetch request, including headers with API key and host
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '', // Replace with your own API key
            'X-RapidAPI-Host': '' // Replace with your own API host
        }
    };

    try {
        // Fetch data from the API using the constructed URL and options
        const response = await fetch(url, options);
        // Parse the JSON response into a JavaScript object
        const result = await response.json();

        // Extract specific data from the response object
        const countryCode = result.cca3;
        const capitalCity = result.capital[0];
        const population = result.population;

        // Log the extracted data to the console
        console.log('Country Code:', countryCode);
        console.log('Capital City:', capitalCity);
        console.log('Population:', population);

        // Send a message to the web view with population information
        window.chrome.webview.postMessage(`Population: ${population}`);

        // Retrieve the URL for the flag image from the response
        const flagUrl = result.flags.png;
        console.log("Flag Image URL:", flagUrl);

        // Create a new image element
        const image = new Image();
        // Enable CORS for the image to avoid security errors
        image.crossOrigin = "Anonymous";
        // Set the image source and alternative text
        image.src = flagUrl;
        image.alt = 'Flag Image';

        // Retrieve the container element to display the flag image
        const container = document.getElementById('flag-container');
        // Append the image to the container
        container.appendChild(image);
    } catch (error) {
        // Log any errors that occur during the process
        console.error(error);
    }
}

// Function to convert an image to a base64 encoded string
function getBase64Image(img) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Failed to convert image to blob'));
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    });
}