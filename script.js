'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = ` 
  <article class="country ${className} ">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;  // we can use thi in finally block
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;  // we can use thi in finally block
};

///////////////////////////////////////
const getcountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();
  console.log(request.responseText);

  request.addEventListener('load', function () {
    //   console.log(this.responseText); // here this kyword refers to the request
    const [data] = JSON.parse(this.responseText);
    const html = ` 
  <article class="country">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>`;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

// getcountryData('portugal');
// getcountryData('usa');

const getcountryAndNeighbour = function (country) {
  //ajax call country1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();
  console.log(request.responseText);

  request.addEventListener('load', function () {
    // first function
    //   console.log(this.responseText); // here this kyword refers to the request
    const [data] = JSON.parse(this.responseText);
    //render country 1
    renderCountry(data);

    //get neighbour country 2
    const neighbour = data.borders?.[0];

    //ajax call country 2

    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      // second function : - this is callback hell a callback fn within a callback fn
      console.log(this.responseText);
      const data2 = JSON.parse(this.responseText);
      renderCountry(data2, 'neighbour');
    });
  });
};
//getcountryAndNeighbour('portugal');

// const request = fetch(`https://restcountries.com/v2/name/${country}`);

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json(); //response.json returns a new promise
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

const getJson = function (url, errorMessage = '') {
  fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMessage}(${response.status})`);

    return response.json(); //response.json returns a new promise
  });
};
const getCountryData = function (country) {
  getJson(`https://restcountries.com/v2/name/${country}`, 'country not found')
    .then(data => {
      // console.log(data);
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      if (!neighbour) throw new Error('No Neighbour found');
      return getJson(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'country not found'
      );
    })

    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} +++`);
      renderError(`something went wrong ${err.message}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('portugal');
});

getCountryData('bcvbcb');
