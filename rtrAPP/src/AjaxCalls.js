//-----------------------------------------------------------------------
// Call an ajax function on the server
//-----------------------------------------------------------------------
function GetRides(request, GetRidesSuccessCB, GetRidesErrorCB) {

    //serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/GetRidePatView',
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: GetRidesSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: GetRidesErrorCB
        //async: false
    }) // end of ajax call
}

function GetMyRides(request, GetMyRidesSuccessCB, GetMyRidesErrorCB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/getMyRides',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: GetMyRidesSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: GetMyRidesErrorCB
        //async: false
    }) // end of ajax call
}


function signDriver(request, signDriverSuccessCB, signDriverErrorCB) {
    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/AssignRideToRidePat',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: signDriverSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: signDriverErrorCB
    }) // end of ajax call
}

function CombineRideRidePatAjax(request, signDriverSuccessCB, signDriverErrorCB) {
    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/CombineRideRidePat',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: signDriverSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: signDriverErrorCB
    }) // end of ajax call
}


function deleteRide(request, deleteRideSuccessCB, deleteRideErrorCB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/LeaveRidePat',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: deleteRideSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: deleteRideErrorCB
    }) // end of ajax call
}


function deleteAllRide(request, deleteRideSuccessCB, deleteRideErrorCB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/DeleteDriver',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: deleteRideSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: deleteRideErrorCB
    }) // end of ajax call
}


function checkUser(request, checkUserSuccessCB, checkUserErrorCB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/CheckUser',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: checkUserSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: checkUserErrorCB
    }) // end of ajax call
}


function setVolunteerPrefs(request, setVolunteerPrefsSCB, setVolunteerPrefsECB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/setVolunteerPrefs',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: setVolunteerPrefsSCB,                // data.d id the Variable data contains the data we get from serverside
        error: setVolunteerPrefsECB
    }) // end of ajax call
}


function getVolunteers(request, getVolunteersSCB, getVolunteersECB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/getVolunteers',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: getVolunteersSCB,                // data.d id the Variable data contains the data we get from serverside
        error: getVolunteersECB
    }) // end of ajax call
}

function getPatients(request, getPatientsSCB, getPatientsECB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/getPatients',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: getPatientsSCB,                // data.d id the Variable data contains the data we get from serverside
        error: getPatientsECB
    }) // end of ajax call
}


function confirmPush(request, confirmPushSCB, confirmPushECB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/confirmPush',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: confirmPushSCB,                // data.d id the Variable data contains the data we get from serverside
        error: confirmPushECB
    }) // end of ajax call
}

function setStatus(request, setStatusSCB, setStatusECB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/setRideStatus',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: setStatusSCB,                // data.d id the Variable data contains the data we get from serverside
        error: setStatusECB
    }) // end of ajax call
}

function backupToPrimary(request, backupToPrimarySCB, backupToPrimaryECB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/backupToPrimary',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: backupToPrimarySCB,                // data.d id the Variable data contains the data we get from serverside
        error: backupToPrimaryECB
    }) // end of ajax call
}


function isPrimaryStillCanceledAJAX(request, isPrimaryStillCanceledSCB, isPrimaryStillCanceledECB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/isPrimaryStillCanceled',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: isPrimaryStillCanceledSCB,                // data.d id the Variable data contains the data we get from serverside
        error: isPrimaryStillCanceledECB
    }) // end of ajax call
}

function getLocations(getLocationsSCB, getLocationsECB) {
    
    $.ajax({ // ajax call starts
        url: domain + '/WebService.asmx/getLocations',   // server side web service method
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: getLocationsSCB,                // data.d id the Variable data contains the data we get from serverside
        error: getLocationsECB
    }) // end of ajax call
} 

function sendMail(request, sendMailSCB, sendMailECB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: domain + '/emailWS.asmx/sendEmail',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: sendMailSCB,                // data.d id the Variable data contains the data we get from serverside
        error: sendMailECB
    }) // end of ajax call
} 