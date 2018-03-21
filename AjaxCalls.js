//-----------------------------------------------------------------------
// Call an ajax function on the server
//-----------------------------------------------------------------------
function GetRides(request, GetRidesSuccessCB, GetRidesErrorCB) {

     //serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: 'WebService.asmx/GetRidePat',
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: GetRidesSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: GetRidesErrorCB
    }) // end of ajax call
}

function GetMyRides(request, GetMyRidesSuccessCB, GetMyRidesErrorCB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: 'ajaxWebService.asmx/GetMyRides',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: GetMyRidesSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: GetMyRidesErrorCB
    }) // end of ajax call
}


function signDriver(request, signDriverSuccessCB, signDriverErrorCB) {

    // serialize the object to JSON string
    var dataString = JSON.stringify(request);

    $.ajax({ // ajax call starts
        url: 'WebService.asmx/SignDriver',   // server side web service method
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
        url: 'ajaxWebService.asmx/deleteRide',   // server side web service method
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
        url: 'WebService.asmx/CheckUser',   // server side web service method
        data: dataString,                          // the parameters sent to the server
        type: 'POST',                              // can be also GET
        dataType: 'json',                          // expecting JSON datatype from the server
        contentType: 'application/json; charset = utf-8', // sent to the server
        success: checkUserSuccessCB,                // data.d id the Variable data contains the data we get from serverside
        error: checkUserErrorCB
    }) // end of ajax call
}