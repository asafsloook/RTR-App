function onDeviceReady() {
    if (typeof PushNotification !== 'undefined') {

        const push = PushNotification.init({
            android: {
                //senderID: "148075927844",
                forceShow: true // this identifies your application
                // it must be identical to what appears in the
                // config.xml
            },
            browser: {
                //pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });


        push.on('registration', function (data) {

            alert('registration OK');
            // send the registration id to the server and save it in the DB
            // send also the userID
            localStorage.RegId = data.registrationId;

            manualLogin();

        });


        //TESTING - create channel for Android O (8.1) and above
        if (typeof PushNotification.createChannel !== 'undefined') {
            PushNotification.createChannel(
                () => {
                    alert('success createChannel');
                },
                () => {
                    alert('error createChannel');
                },
                {
                    id: 'testchannel1',
                    description: 'My first test channel',
                    importance: 3,
                    vibration: true
                }
            );
        }
        //-------------------------------------------------------------
        // triggred by a notification sent from the notification server
        //-------------------------------------------------------------
        push.on('notification', function (data) {

            if (data.additionalData.foreground == true) {
                handleForeground(data);
            }
            else if (data.additionalData.coldstart == true) {
                handleColdStart(data);
            }
            else {
                handleBackground(data);
            }
        });

        //-----------------------------------------------------------
        // triggred when there is an error in the notification server
        //-----------------------------------------------------------
        push.on('error', function (e) {
            if (typeof e.responseJSON !== 'undefined' && typeof e.responseJSON.Message !== 'undefined') {
                popupDialog('שגיאה', e.responseJSON.Message, '#loginLogo', false, null);
            }
            else {
                popupDialog('שגיאה', "אירעה תקלה במערכת.", '#loginLogo', false, null);
            }
        });
    }
    else {
        manualLogin();
    }
}