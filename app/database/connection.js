const mongoose = require('mongoose');
module.exports = () => {
    this.url = "mongodb://admin:jordan@ds013569.mlab.com:13569/fcc";
    this.connect = function() {
        mongoose.connect(this.url, options, function(error) {
  // Check error in initial connection. There is no 2nd param to the callback.
});

    };
    this.disconnect = function() {
        mongoose.disconnect;
    }
}