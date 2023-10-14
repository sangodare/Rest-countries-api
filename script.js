'use strict';

const theme = document.querySelector('.theme');
const themeText = document.querySelector('.theme-text');
const themeIcon = document.querySelector('.theme-icon');
const filterCountries = document.querySelector('.filter-countries');
const regions = document.querySelector('.regions');
const countriesContainer = document.querySelector('.countries-container');


//functions
function changeTheme() {
    if(document.documentElement.classList.contains('light-mode')) {
        document.documentElement.className = 'dark-mode';
        document.querySelector('.theme-icon-link').setAttribute('xlink:href', 'Icons/moon-regular.svg#moon-reg');
        themeIcon.style.fill = 'white';
        themeText.textContent = 'Light mode';

    } else {
        document.documentElement.className = 'light-mode';
        document.querySelector('.theme-icon-link').setAttribute('xlink:href', 'Icons/moon-solid.svg#moon-solid');
        themeIcon.style.fill ='black';
        themeText.textContent = 'Dark mode';
    }    
}

function displayRegions() {
    regions.classList.toggle('hidden');
}

function renderCountries(data) {

    const markup = `
        <li class="country">
            <img class="flag" src="${data[0].flags.png}" alt="${data[0].name.common}'s flag">
            <div class="country-details">
                <h1 class="country-name">${data[0].name.common}</h1>
                <div>
                    <span>Population:</span>
                    <span>${new Intl.NumberFormat().format(data[0].population)}</span>
                </div>
                <div>
                    <span>Region:</span>
                    <span>${data[0].region}</span>
                </div>
                <div>
                    <span>Capital:</span>
                    <span>${data[0].capital}</span>
                </div>
            </div>
        </li>
    `;    
    countriesContainer.insertAdjacentHTML('beforeend', markup);
}

async function getCountryData(country, errorMsg = 'Reload the page') {
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!response.ok) throw new Error(errorMsg);
    return await response.json();

}

async function loadCountries() {
    try {
        const data = await Promise.all([
            getCountryData('germany'),
            getCountryData('united states of america'),
            getCountryData('brazil'),
            getCountryData('iceland'),
            getCountryData('afghanistan'),
            getCountryData('Australia'),
            getCountryData('albania'),
            getCountryData('algeria')
        ]);
        data.map(countryData => renderCountries(countryData));
        console.log(data);
        data.map(data => console.log(data[0].flags.png));

    } catch(err) {
        console.log(err);
    }
    
}

//event listeners

theme.addEventListener('click', changeTheme);
filterCountries.addEventListener('click', displayRegions);
document.addEventListener('DOMContentLoaded', loadCountries);