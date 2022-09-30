const request = require("request");

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  const server = "https://api.ipify.org?format=json";
  request(server, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const IP = JSON.parse(body).ip;
    callback(error, IP);
  });
};

const fetchCoordsByIp = function (IP, callback) {
  request(`http://ipwho.is/${IP}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    const parsedBody = JSON.parse(body);
    const geoCoordinates = {
      latitude: parsedBody.latitude,
      longitude: parsedBody.longitude,
    };

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(message, null);
      return;
    }

    callback(null, geoCoordinates);
  });
};

const fetchISSFlyOverTimes = function (coords, callback) {
  const server = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(server, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    const parsedISSBody = JSON.parse(body).response;

    if (response.statusCode !== 200) {
      callback(
        Error(
          `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`
        ),
        null
      );
      return;
    }

    callback(null, parsedISSBody);
  });
};

const nextISSTimesForMyLocation = function (nextISSTimesForMyLocationCallback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    // console.log("It worked! Returned IP:", ip);

    fetchCoordsByIp(ip, (error, geoCoordinates) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }

      // console.log("It worked! Returned coordinates: ", geoCoordinates);
      fetchISSFlyOverTimes(geoCoordinates, (error, passTimes) => {
        if (error) {
          console.log("It didn't work!!!", error);
          return;
        }

        // console.log("It worked!!!!!", passTimes);

        nextISSTimesForMyLocationCallback(error, passTimes);
      });
    });
  });
};

module.exports = {
  nextISSTimesForMyLocation,
};
