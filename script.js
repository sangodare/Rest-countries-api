'use strict';

const theme = document.querySelector('.theme');
const themeText = document.querySelector('.theme-text');
const themeIcon = document.querySelector('.theme-icon');
const filterCountries = document.querySelector('.filter-countries');
const regions = document.querySelector('.regions');
const allCountries = document.querySelector('.all-countries');
const regionCountries = document.querySelector('.region-countries');
const searchResultContainer = document.querySelector('.search-country');
const errorMessageContainer = document.querySelector('.error-msg');
const searchInput = document.querySelector('.search-box');
const countriesContainer = document.querySelector('.countries-container');
const mainContent = document.querySelector('.main-content');
const countryDetailedInfo = document.querySelector('.country-detailed-info');

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
        <li class="country cursor-pointer" data-name="${data.name.common}">
            <img class="flag" src="${data.flags.png}" alt="${data.name.common}'s flag">
            <div class="country-details">
                <h1 class="country-name">${data.name.common}</h1>
                <div>
                    <span class="font-wt-semibold">Population:</span>
                    <span>${new Intl.NumberFormat().format(data.population)}</span>
                </div>
                <div>
                    <span class="font-wt-semibold">Region:</span>
                    <span>${data.region}</span>
                </div>
                <div>
                    <span class="font-wt-semibold">Capital:</span>
                    <span>${data.capital?.length > 1 ? data.capital[0] : data.capital}</span>
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
        regions.classList.add('hidden');

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
    
};

async function details(country) {
   
    mainContent.classList.add('hidden');
    countryDetailedInfo.classList.remove('hidden');

    const countryData = await getData(`https://restcountries.com/v3.1/name/${country}`);
    const allCountriesData = await getData(`https://restcountries.com/v3.1/all`);
    let links = [];

    const borders = countryData[0].borders;

    const borderingCountries =  allCountriesData.filter(country => {
        
        borders?.forEach(border => {
            if(country.cca3.includes(border)) links.push(country.name.common);
        });
    });

    const native = Object.values(countryData[0].name.nativeName);
    const currency = Object.values(countryData[0].currencies);
    const languages = Object.values(countryData[0].languages).join(', ');
    
    const htmlLinks = links.map(link => {
        return `<a class="btn link-btn" href="#" data-name="${link}">${link}</a>`;
    }).join('');

    const markup = `
        <div>
            <button type="button" class="btn back-btn cursor-pointer">
                <svg class="icons arrow-left">
                    <use xlink:href="Icons/arrow-left-solid.svg#arrow-left"></use>
                </svg>
                <span>Back</span>
            </button>
            <div class="country-dli-flex space">
                <img class="country-dli-flag" src="${countryData[0].flags.png}" alt="${countryData[0].name.common}'s flag">
                <div class="country-dli-text">
                    <h1 class="country-name">${countryData[0].name.common}</h1>
                    <div class="country-dli-flex space">
                        <div>
                            <div class="country-detail">
                                <span class="font-wt-semibold">Native Name: </span>
                                <span>${native.length > 2 ? native[2].common : native[0].common}</span>
                            </div>
                            <diV class="country-detail">
                                <span class="font-wt-semibold">Population: </span>
                                <span>${new Intl.NumberFormat().format(countryData[0].population)}</span>
                            </div>
                            <div class="country-detail">
                                <span class="font-wt-semibold">Region: </span>
                                <span>${countryData[0].region}</span>
                            </div>
                            <div class="country-detail">
                                <span class="font-wt-semibold">Sub Region: </span>
                                <span>${countryData[0].subregion}</span>
                            </div>
                            <div class="country-detail">
                                <span class="font-wt-semibold">Capital: </span>
                                <span>${countryData[0].capital.join(', ')}</span>
                            </div>
                        </div>
                        <div class="mg-top">
                            <div class="country-detail">
                                <span class="font-wt-semibold">Top Level Domain: </span>
                                <span>${countryData[0].tld[0]}</span>
                            </div>
                            <div class="country-detail">
                                <span class="font-wt-semibold">Currencies: </span>
                                <span>${currency[0].name}</span>
                            </div>
                            <div class="country-detail">
                                <span class="font-wt-semibold">Languages: </span>
                                <span>${languages} </span>
                            </div>
                        </div>
                    </div>
                    <div class="bordering-countries">
                        <span class="font-wt-semibold bc-text">Border Countries: </span>
                        <span class="borders">${links.length != 0 ? htmlLinks : 'No bordering country'}<span>                        
                    </div>
                </div>
            </div>
        </div>
    `;

    countryDetailedInfo.innerHTML = "";
    countryDetailedInfo.insertAdjacentHTML('beforeend', markup);
    
};

function displayDetailedInfo(e) {
    if(e.target.closest('.country') == null) return;
    const parentEl = e.target.closest('.country'); 

    details(parentEl.dataset.name);
};

function displayAllOrdisplayCountry(e) {
    if(e.target.closest('.back-btn') == null && !e.target.classList.contains('link-btn')) return;

    if(e.target.closest('.back-btn')) {
        mainContent.classList.remove('hidden');
        countryDetailedInfo.classList.add('hidden');        
    };

    if(e.target.classList.contains('link-btn')) {
        details(e.target.dataset.name);
    };

};

//event listeners
theme.addEventListener('click', changeTheme);
filterCountries.addEventListener('click', displayRegions);
regions.addEventListener('click', displayRegion);
searchInput.addEventListener('input', displayCountry);
document.addEventListener('DOMContentLoaded', loadCountries);
countriesContainer.addEventListener('click', displayDetailedInfo);
searchResultContainer.addEventListener('click', displayDetailedInfo);
regionCountries.addEventListener('click', displayDetailedInfo);
countryDetailedInfo.addEventListener('click', displayAllOrdisplayCountry);