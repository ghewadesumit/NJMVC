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

  console.log(
    '************************************Server is still running***********************************'
  );
  console.log('Selected location is', selectedLocation);
  const currentAppointmentData = mvcSearch.findMVCData(appointmentType);
  const mvcURL = currentAppointmentData.url;
  const mvcLocationNumber = mvcSearch.findMVCLocationNumber(
    currentAppointmentData.location,
    selectedLocation
  );

  const mvcPromise = new Promise((resolve, reject) => {
    // setInterval(async () => {

    (async () => {
      const mvcResult = [];
      for (let i = 0; i < mvcLocationNumber.length; i++) {
        console.log('TRyiiiinnggg for location', selectedLocation[i]);
        try {
          console.log(`${mvcLocationNumber} ${mvcURL} ${requiredMonths}`);
          const currentUrl = mvcURL + mvcLocationNumber[i];

          const mvcResultTemp = await mvcSearch.mvcAppointmentSearch(
            mvcLocationNumber,
            i,
            currentUrl,
            selectedLocation,
            requiredMonths
          );

          console.log('mcvResult Temp answer is', mvcResultTemp);
          mvcResult.push(mvcResultTemp);

          console.log('result is', mvcResult);
        } catch (err) {
          console.log(err);
          reject(mvcResult);
          console.log('falseeeeee');
        }
      }
      resolve(mvcResult);
    })();
    // }, 30 * 1000);
  });

  (async () => {
    await mvcPromise
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
  })().catch((e) => console.log('Caught: ' + e));
});

module.exports = router;
