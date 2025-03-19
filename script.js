let quote = document.getElementById('quote');
let author = document.getElementById('author');
let getQuoteBtn = document.getElementById('getnewquote');
let myBody = document.getElementById('body');
let shareBtn = document.getElementById('share');
let copyBtn = document.getElementById('copybtn');
let downloadBtn = document.getElementById('downloadBtn');

const imageUrls = [
    "img/pexels-alena-koval-233944-886521.jpg",
    "img/pexels-andre-furtado-43594-1263986.jpg",
    "img/pexels-arist-creathrive-1183525-2253573.jpg",
    "img/pexels-francesco-ungaro-2325447.jpg",
    "img/pexels-freestockpro-1172207.jpg",
    "img/pexels-gochrisgoxyz-1477166.jpg",
    "img/pexels-lum3n-44775-167684.jpg",
    "img/pexels-matthardy-1533720.jpg",
    "img/pexels-minan1398-906150.jpg",
    "img/pexels-philippedonn-1133957.jpg",
    "img/pexels-pixabay-35196.jpg",
    "img/pexels-pixabay-39517.jpg",
    "img/pexels-pixabay-68507.jpg",
    "img/pexels-pixabay-147411.jpg",
    "img/pexels-pixabay-158471.jpg",
    "img/pexels-pixabay-158756.jpg",
    "img/pexels-pixabay-158780.jpg",
    "img/pexels-pixabay-163848.jpg",
    "img/pexels-pixabay-247599.jpg",
    "img/pexels-shottrotter-1115090.jpg",
    "img/pexels-torsten-kellermann-349167-955656.jpg"
];

const url = 'https://api.freeapi.app/api/v1/public/quotes/quote/random';
const options = {method: 'GET', headers: {accept: 'application/json'}};

// Global variables to store current quote and image
let currentQuote = "";
let currentAuthor = "";
let currentImage = "";

// Function to get quote and author
async function getQuoteAuthor() {
    try {
        const quoteResponse = await fetch(url, options);
        let data = await quoteResponse.json();
        currentAuthor = data.data.author;
        currentQuote = data.data.content;
        author.innerHTML = currentAuthor;
        quote.innerHTML = `"${currentQuote}"`;
    } catch(error) {
        console.log(error);
        // Fallback quote if API fails
        currentQuote = "The best way to predict the future is to create it.";
        currentAuthor = "Abraham Lincoln";
        author.innerHTML = currentAuthor;
        quote.innerHTML = `"${currentQuote}"`;
    }
}

// Function to change background with smooth transition
async function changeBg() {
    const randomImgNum = Math.floor(Math.random() * imageUrls.length);
    const imgurl = imageUrls[randomImgNum];
    currentImage = imgurl;
    console.log(imgurl);
    
    // Create new image object to preload
    const img = new Image();
    img.src = imgurl;
    
    // Wait for image to load before changing background
    img.onload = function() {
        myBody.style.backgroundImage = `url(${imgurl})`;
    };
}

// Function to disable button with cooldown
function waitBtn(button, seconds) {
    // Save original text
    const originalText = button.textContent;
    
    // Disable button
    button.disabled = true;
    button.style.opacity = "0.5";
    button.style.cursor = "not-allowed";
    
    // Start countdown
    let countdown = seconds;
    button.textContent = `Wait ${countdown}s`;
    
    const timer = setInterval(() => {
        countdown--;
        button.textContent = `Wait ${countdown}s`;
        
        if (countdown <= 0) {
            // Re-enable button
            clearInterval(timer);
            button.disabled = false;
            button.textContent = originalText;
            button.style.opacity = "1";
            button.style.cursor = "pointer";
        }
    }, 1000);
}

// Function to share on Twitter/X
function shareOnX() {
    const quoteText = quote.textContent;
    const authorText = author.textContent;
    const shareText = `${quoteText} - ${authorText}`;
    const encodedText = encodeURIComponent(shareText);
    const twitterUrl = `https://x.com/intent/post?text=${encodedText}`;
    
    window.open(twitterUrl, '_blank');
}

// Function to copy quote and author to clipboard
function copyToClipboard() {
    const quoteText = quote.textContent;
    const authorText = author.textContent;
    const textToCopy = `${quoteText} - ${authorText}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            const originalImg = copyBtn.innerHTML;
            copyBtn.innerHTML = '<img src="/img/check.svg" alt="Copied" width="100%" height="30px">';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalImg;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        });
}

// Function to download the current background image
function downloadBackgroundImage() {
    // If we have a current image
    if (currentImage) {
        // Get image filename from path
        const imageName = currentImage.split('/').pop();
        
        // Create a download link
        const a = document.createElement('a');
        a.href = currentImage;
        a.download = imageName || 'background-image.jpg';
        
        // Trigger the download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            
            // Show visual feedback
            const originalImg = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<img src="/img/check.svg" alt="Downloaded" width="100%" height="30px">';
            
            setTimeout(() => {
                downloadBtn.innerHTML = originalImg;
            }, 2000);
        }, 100);
    } else {
        console.error('No background image available to download');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    changeBg();
    getQuoteAuthor();
});

// Event listener for Get New Quote button
getQuoteBtn.addEventListener('click', () => {
    // Apply waiting
    waitBtn(getQuoteBtn, 5);
    
    // Get new quote and change background
    changeBg();
    getQuoteAuthor();
});

// Event listener for Share on X button
shareBtn.addEventListener('click', () => {
    shareOnX();
});

// Event listener for Copy button
copyBtn.addEventListener('click', () => {
    copyToClipboard();
});

// Event listener for Download button
downloadBtn.addEventListener('click', () => {
    downloadBackgroundImage();
});