// UI widgets
let countryName = document.getElementById("txt-country-input");
let searchButton = document.getElementById("btn-search");

//button click events
searchButton.addEventListener('click', async () => {
    const country = countryName.value.trim();
    await getTime(country);
});

async function getTime(country) {
    const url = `https://country55.p.rapidapi.com/api/countries?country=${country}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0c06a1d5f4msh34989841bd400e4p17152ajsn7f186dad8ecc',
            'X-RapidAPI-Host': 'country55.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Parse JSON directly to object

        // Accessing specific values from the JSON object
        const countryCode = result.cca3;
        const capitalCity = result.capital[0];
        const population = result.population;
        console.log('Country Code:', countryCode);
        console.log('Capital City:', capitalCity);
        console.log('population:', population);

        //send message to webview
        window.chrome.webview.postMessage(`population:${population}`);

        const flagUrl = result.flags.png;
        console.log("link", flagUrl);

        const image = new Image(); // Create new image element
        image.crossOrigin = "Anonymous"; // Enable CORS for the image
        // image.onload = async function() {
        //     const base64String = await getBase64Image(image);
        //     console.log(base64String);
        // };
        image.src = flagUrl;
        image.alt = 'Flag Image'; 
        const container = document.getElementById('flag-container');
        container.appendChild(image);
    } catch (error) {
        console.error(error);
    }
}


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
