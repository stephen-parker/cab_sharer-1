Meteor.methods({

    'geocode':function(location) {
        var geo = new GeoCoder({
            // geocoderProvider: "mapquest",
            httpAdapter: "https",
            // apiKey: 'Fmjtd%7Cluurn16b21%2C20%3Do5-9wts54'
            // apiKey: 'fakey'
            // apiKey: 'Fmjtd%7Cluu8210t2g%2Ca5%3Do5-94rx50'
        });
        var geocodeResult = geo.geocode(location);
        return geocodeResult;
    },

    createMessage: function(query, message, messageText){
        // var id = new RegExp(query);
        var id = query;
        if (Conversations.findOne({_id:id})){
            Conversations.update({_id:id}, {$push: messageText}, {upsert: true});
        } else {
            Conversations.upsert(id, {$set:message, $push: messageText});
        }
    },
    createConversation: function(conversation){
        Conversations.insert(conversation);
    },
    createConversationReference: function(conversationRef){
        ConversationReferences.insert(conversationRef)
    },
    facebookLoginWithAccessToken: function (accessToken) {
        console.log("inside function");
        check(accessToken, String);

        var serviceData = {
            accessToken: accessToken
        };

        // Confirm that your accessToken is you
        try {
            var tokenInfo = $FB('debug_token', {
                input_token: accessToken,
                access_token: Meteor.settings.facebook.appId + '|' + Meteor.settings.facebook.secret
            });
        } catch (e) {
            console.log("500");
            throw new Meteor.Error(500, 'Facebook login failed. An API error occurred.');
        }

        if (!tokenInfo.data.is_valid) {
            console.log("503");
            throw new Meteor.Error(503, 'This access token is not valid.');
        }

        if (tokenInfo.data.app_id !== Meteor.settings.facebook.appId) {
            console.log("503");
            throw new Meteor.Error(503, 'This token is not for this app.');
        }

        // Force the user id to be the access token's user id
        serviceData.id = tokenInfo.data.user_id;

        // Returns a token you can use to login
        var loginResult = Accounts.updateOrCreateUserFromExternalService('facebook', serviceData, {});

        // Login the user
        this.setUserId(loginResult.userId);

        // Return the token and the user id
        return loginResult;
    }
});

// { messageContent: { text: 'to stephen from mark', writtenBy: 'TfpqjhpK9vrcnPsnz',sentAt: '2015-04-05T13:16:48.780Z' } }