// var getGeocode = function(address){
//   var geo = new GeoCoder({
//     geocoderProvider: "mapquest",
//     httpAdapter: "https",
//     apiKey: 'Fmjtd%7Cluurn16b21%2C20%3Do5-9wts54'
//     });
//   var geocodeResult = geo.geocode(address);
//   console.log(geocodeResult);
//   return geocodeResult;
// };

// getGeocode("Cyberport, Hong Kong");

$FB = function () {
    if (Meteor.isClient) {
        throw new Meteor.Error(500, "Cannot run on client.");
    }

    var args = Array.prototype.slice.call(arguments);
    if (args.length === 0) {
        return;
    }
    var path = args[0];
    var i = 1;
    // Concatenate strings together in args
    while (_.isString(args[i])) {
        path = path + "/" + args[i];
        i++;
    }

    if (_.isUndefined(path)) {
        throw new Meteor.Error(500, 'No Facebook API path provided.');
    }
    var FB = Meteor.npmRequire('fb');

    var fbResponse = Meteor.sync(function (done) {
        FB.napi.apply(FB, [path].concat(args.splice(i)).concat([done]));
    });

    if (fbResponse.error !== null) {
        console.error(fbResponse.error.stack);
        throw new Meteor.Error(500, "Facebook API error.", {error: fbResponse.error, request: args});
    }

    return fbResponse.result;
};



ServiceConfiguration.configurations.remove({
    service: "facebook"
});

// PRODUCTION
// ServiceConfiguration.configurations.insert({
//     service: "facebook",
//     appId: "854947564544953",
//     secret: "68fa355766aa072af2fa6ee5c014a001"
// });

// // // DEV/TEST
ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: "901570066549369",
    secret: "762e72c3d411ad4b7acfb927eddc6a31"
});

Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?width=9999";
        user.profile = options.profile;
    }
    return user;
});