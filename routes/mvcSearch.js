const express = require('express');
const router = express.Router();
// const mvcData = require('../data/appointmentUrl.data');
const mvcSearch = require('./mvcAlgo');

// @route POST api/mvc_search
// @desc  calling the mvc search
// @access public
router.post('/', (req, res) => {
  console.log(req.body);
  const { selectedLocation, requiredMonths, appointmentType } = req.body;
  console.log('Selected location is', selectedLocation);
  const currentAppointmentData = mvcSearch.findMVCData(appointmentType);
  const mvcURL = currentAppointmentData.url;
  const mvcLocationNumber = mvcSearch.findMVCLocationNumber(
    currentAppointmentData.location,
    selectedLocation
  );

  const mvcPromise = new Promise((resolve, reject) => {
    setInterval(async () => {
      try {
        console.log(`${mvcLocationNumber}   ${mvcURL} ${requiredMonths}`);
        const mvcResult = await mvcSearch.mvcAppointmentSearch(
          mvcLocationNumber,
          mvcURL,
          selectedLocation,
          requiredMonths
        );

        console.log('result is', mvcResult);

        if (mvcResult.isFound) {
          resolve(mvcResult);
          console.log('trueeeeee');
        } else if (!mvcResult.isFound) {
          reject(mvcResult);
          console.log('falseeeeee');
        }
      } catch (err) {
        console.log(err);
        reject(mvcResult);
        console.log('falseeeeee');
      }
    }, 30 * 1000);
  });

  mvcPromise
    .then((response) => {
      console.log('response is', response);
      res.json({
        data: response,
      });
    })
    .catch((err) => {
      res.json({
        error: 'Some error occured sorry',
        data: err,
      });
    });
});

module.exports = router;
