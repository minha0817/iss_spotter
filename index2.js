const { nextISSTimesForMyLocation } = require("./iss_promised");
const { printPassTimes } = require("./index");

nextISSTimesForMyLocation() //
  .then((passTimes) => {
    printPassTimes(null, passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
