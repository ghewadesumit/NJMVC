const cheerio = require('cheerio');
const axios = require('axios');
const open = require('open');
const mvcData = require('../data/appointmentUrl.data');

/* Finding the Data for the current appointment selected*/

const findMVCData = (appointmentType) =>
  mvcData.find((item) => item.type == appointmentType);

/* Finding the Location number of selected locations*/

const findMVCLocationNumber = (mvcLocation, selectedLocation) => {
  let locationMap = new Map();
  mvcLocation.forEach((item) => {
    locationMap.set(item.locationName, item.locationNumber);
  });
  return selectedLocation.map((item) => locationMap.get(item));
};

/** Starting point of the search application */
const mvcAppointmentSearch = async (
  mvcLocationNumber,
  mvcIndex,
  mvcURL,
  mvcLocation,
  requiredMonths
) => {
  // const currentUrl = mvcURL + mvcLocationNumber[i];
  // console.log(mvcLocationNumber[i]);
  try {
    const callUrlResult = await callUrl(
      mvcURL,
      mvcIndex,
      mvcLocationNumber,
      mvcLocation,
      requiredMonths
    );
    console.log('data of appointment Search is', callUrlResult);
    return callUrlResult;
  } catch (err) {
    console.log('error for appointment search is ', err);
  }
};

/** Call the MVC URL here */
const callUrl = async (
  mvcURL,
  locationNumberIndex,
  mvcLocationNumber,
  mvcLocation,
  requiredMonths
) => {
  try {
    const response = await axios.get(mvcURL);
    const getDataResult = getData(
      response.data,
      mvcURL,
      locationNumberIndex,
      mvcLocationNumber,
      mvcLocation,
      requiredMonths
    );
    console.log('Get data result', getDataResult);
    return getDataResult;
  } catch (err) {
    console.log(err);
  }
};

/** */

const getData = (
  html,
  mvcURL,
  locationNumberIndex,
  mvcLocationNumber,
  mvcLocation,
  requiredMonths
) => {
  let $ = cheerio.load(html);

  // console.log($);

  $.prototype.exists = function (selector) {
    return this.find(selector).length > 0;
  };

  const checkerLength = $('div').exists('.alert-danger');
  // console.log('checkerLength is', checkerLength);
  if (checkerLength) {
    console.log(
      `No appointment available in ${mvcLocation[locationNumberIndex]}`
    );
  } else {
    const dateStringOne = $('div[class=control-label]').text();
    const dateString = $('.control-label').text();
    const availableMonth = dateString.trim().split(' ')[7];
    const exactDateAvailability = dateString.slice(24, -1);
    // console.log(
    //   'Date string is of cheerio',
    //   dateString,
    //   'sadasd asdasd',
    //   dateStringOne
    // );
    console.log('Available month is', availableMonth);
    if (requiredMonths.includes(availableMonth)) {
      console.log('Hurray there is an appointment available');
      const message = `Appointment available for the location ${mvcLocation[locationNumberIndex]} on ${exactDateAvailability}`;
      //open(`${mvcURL}`);
      return {
        location: mvcLocation[locationNumberIndex],
        url: mvcURL,
        isFound: true,
      };
    } else {
      console.log('required Month is not available still searching');
      return {
        location: mvcLocation[locationNumberIndex],
        msg: 'Still searching',
        isFound: false,
      };
    }
  }
};

// const mvcSearchIntervalCounter = () => {};

module.exports = { mvcAppointmentSearch, findMVCData, findMVCLocationNumber };
