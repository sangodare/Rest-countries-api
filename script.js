'use strict';

const theme = document.querySelector('.theme');
const themeText = document.querySelector('.theme-text');
const themeIcon = document.querySelector('.theme-icon');
const filterCountries = document.querySelector('.filter-countries');
const regions = document.querySelector('.regions');


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

//event listeners

theme.addEventListener('click', changeTheme);
filterCountries.addEventListener('click', displayRegions);