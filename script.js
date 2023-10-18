'use strict';

const theme = document.querySelector('.theme');
const themeText = document.querySelector('.theme-text');
const themeIcon = document.querySelector('.theme-icon');
const filterCountries = document.querySelector('.filter-countries');
const regions = document.querySelector('.regions');
const allCountries = document.querySelector('.all-countries');
const regionCountries = document.querySelector('.region-countries');
const searchResultContainer = document.querySelector('.search-country');
const searchInput = document.querySelector('.search-box');


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

function renderCountries(data, container) {

    const markup = `
        <li class="country">
            <img class="flag" src="${data.flags.png}" alt="${data.name.common}'s flag">
            <div class="country-details">
                <h1 class="country-name">${data.name.common}</h1>
                <div>
                    <span>Population:</span>
                    <span>${new Intl.NumberFormat().format(data.population)}</span>
                </div>
                <div>
                    <span>Region:</span>
                    <span>${data.region}</span>
                </div>
                <div>
                    <span>Capital:</span>
                    <span>${data.capital[0]}</span>
                </div>
            </div>
        </li>
    `;    
    container.insertAdjacentHTML('beforeend', markup);
}

function displayErrorMessage(errorMsg, container) {
    container.insertAdjacentText('beforeend', errorMsg);
};

async function getData(url, errorMsg = 'Please reload the page') {
    const response = await fetch(url);
    if (!response.ok) throw new Error(errorMsg);
    return await response.json();
}

async function loadCountries() {
    try {
        const data = await getData(`https://restcountries.com/v3.1/all`);
        data.map(data => renderCountries(data, allCountries));
        
    } catch(error) {
        displayErrorMessage(error.message, allCountries);
    }
    
}

async function displayRegion(e) {
    try {
        if(!e.target.classList.contains('region')) return;

        const data = await getData(`https://restcountries.com/v3.1/region/${e.target.textContent}`);

        allCountries.classList.add('hidden');
        searchResultContainer.classList.add('hidden');
        regionCountries.classList.remove('hidden');
        regionCountries.innerHTML = "";

        data.map(data => renderCountries(data, regionCountries));

    } catch(error) {
        displayErrorMessage(error.message, regionCountries);
    }
}

async function displayCountry() {
    try {
        
        allCountries.classList.add('hidden');
        regionCountries.classList.add('hidden');
        searchResultContainer.classList.remove('hidden');
        searchResultContainer.innerHTML = "";
        regions.classList.add('hidden');

        const data = await getData(`https://restcountries.com/v3.1/all`);
        
        const filterData = data.filter(data => data.name.common.toLowerCase().startsWith(`${this.value.toLowerCase()}`));
        if(filterData.length === 0) throw new Error('Country does not exist or search by using the common name of the country');
        
        filterData.map(data => renderCountries(data, searchResultContainer));

    } catch(error) {
        displayErrorMessage(error.message, searchResultContainer);
    }
    
}

//event listeners

theme.addEventListener('click', changeTheme);
filterCountries.addEventListener('click', displayRegions);
regions.addEventListener('click', displayRegion);
searchInput.addEventListener('input', displayCountry);
document.addEventListener('DOMContentLoaded', loadCountries);