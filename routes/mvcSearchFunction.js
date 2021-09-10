const cheerio = require('cheerio');
const axios = require('axios');
const open = require('open');

// const mvcUrl =
// const mvcLocation =
// const mvcLocationNumber =
// const requiredMonths =

const mvcAppointmentSearch = () => {
  for (let i = 0; i < mvcLocationNumber.length; i++) {
    const currentUrl = mvcUrl + mvcLocationNumber[i];
    // console.log(mvcLocationNumber[i]);
    callUrl(currentUrl, i);
  }
};

const callUrl = async (url, locationNumberIndex) => {
  try {
    const response = await axios.get(url);
    //console.log('call url', response.data);
    getData(response.data, locationNumberIndex);
  } catch (err) {
    console.log(err);
  }
};

const getData = (html, locationNumberIndex) => {
  let data = [];
  let $ = cheerio.load(html);

  // console.log('datais ', $);
  $.prototype.exists = function (selector) {
    return this.find(selector).length > 0;
  };

  const checkerLength = $('div').exists('.alert-danger');

  // console.log(checkerLength);
  if (checkerLength) {
    console.log(
      `No appointment available in ${mvcLocation[locationNumberIndex]}`
    );
  } else {
    const dateString = $('.control-label').text();
    const availableMonth = dateString.trim().split(' ')[7];
    const exactDateAvailability = dateString.slice(24, -1);
    console.log('dage string is', dateString);
    console.log(availableMonth);
    if (requiredMonths.includes(availableMonth)) {
      console.log('Hurray there is an appointment available');
      const message = `Appointment available for the location ${mvcLocation[locationNumberIndex]} on ${exactDateAvailability}`;
      open(`${mvcUrl + mvcLocationNumber[locationNumberIndex]}`);
      console.log(message);
    } else {
      console.log('required Month is not available still searching');
    }
  }
};

setInterval(() => {
  try {
    mvcAppointmentSearch();
  } catch (err) {
    console.log(err);
  }
}, 30 * 1000);
