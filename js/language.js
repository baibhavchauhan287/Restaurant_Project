
let currentLanguage = 'ar'; 
// Initial language is English


function toggleLanguage() {
    const flagIcon = document.getElementById('flagIcon');
    const languageLabel = document.getElementById('languageLabel');

    if (currentLanguage === 'en') {
        // Switch to Arabic
        currentLanguage = 'ar';
        flagIcon.src = '/img/saudi.JPG';
        languageLabel.textContent = 'عربي';
        document.body.style.fontFamily = 'inherit';
    } else {
        // Switch to English
        currentLanguage = 'en';
        flagIcon.src = '/img/usa.jpg';
        languageLabel.textContent = 'English';
        document.body.style.fontFamily = 'SourceSansPro-Regular';
    }

    // Update the query parameter to reflect the new language choice
    changeDirection(currentLanguage);
    updateLanguage(currentLanguage);
    updateLinksWithLang(currentLanguage);
    // localStorage.setItem('preferredLanguage', currentLanguage);
}

// json Logic

async function loadTranslations() {
    try {
        const response = await fetch('translate.json');
        if (!response.ok) {
            throw new Error('Failed to load translations'); // Handle fetch errors
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        return {}; // Return empty object if there's an error
    }
}

async function updateLanguage(language) {
    try {
        const translations = await loadTranslations();
        // Find all elements with a data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key] && translations[key][language]) {
                element.innerText = translations[key][language];
            } else {
                element.innerText = '[Translation Missing]'; // Fallback if translation is missing
            }
        });
    } catch (error) {
        console.error('Error updating language:', error); // Catch any other errors
    }
}
// Ensure the DOM is loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
        // Event listener for the language switcher
        const languageSwitcher = document.getElementById('languageSwitcher');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('change', function() {
                const selectedLanguage = this.value;
                updateLanguage(selectedLanguage);
            });

            // Default language set to English on page load
            updateLanguage('en');
        } else {
            console.error('Language switcher element not found');
        }
    });


function changeDirection(language) {
    if (language === 'ar') {
        document.body.style.direction = 'rtl';
        document.body.style.fontFamily = "'Cairo', sans-serif";
    } else {
        document.body.style.direction = 'ltr';
        document.body.style.fontFamily = "'SourceSansPro-Regular', sans-serif";
    }

    const url = new URL(window.location);
    url.searchParams.set('lang', language);
    window.history.replaceState(null, '', url);
    localStorage.setItem('preferredLanguage', language);
}

function updateLinksWithLang(language) {
    document.querySelectorAll('a.nav-item, a.dropdown-item').forEach(link => {
        const url = new URL(link.href, window.location.origin);
        url.searchParams.set('lang', language);
        link.href = url.toString();
    });
}

// Make changeDirection accessible globally
window.changeDirection = changeDirection;
window.toggleLanguage = toggleLanguage;


function loadLanguageFromStorageOrQueryParams() {
    // Check for language in localStorage first
    const storedLanguage = localStorage.getItem('preferredLanguage');
    const urlParams = new URLSearchParams(window.location.search);
    const language = storedLanguage || urlParams.get('lang') || 'en'; // Default to English

    currentLanguage = language;
    changeDirection(language);
    updateLanguage(language);
    updateLinksWithLang(language); // Update links with the current language
}

window.onload = loadLanguageFromStorageOrQueryParams;
