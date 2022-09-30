const printPassTimes = (error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  for (const pass of passTimes) {
    const date = new Date(pass.risetime * 1000);
    console.log(`Next pass at ${date} for ${pass.duration} seconds!`);
  }
};

module.exports = { printPassTimes };
