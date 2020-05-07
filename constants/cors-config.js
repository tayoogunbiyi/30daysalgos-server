const corsWhitelist = [
  "localhost:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://www.30daysofalgos.tech",
  "https://www.30daysofalgos.tech",
];

const corsConfig = {
  origin(origin, callback) {
    // origin == undefined is for clients such as postman with no origin
    if (origin === undefined || corsWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = {
  corsConfig,
};
