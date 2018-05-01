
//get week function
Date.prototype.getWeek = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    d.setUTCDate(d.getUTCDate() - d.getUTCDay());
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};


//global variables for ride management
rides = null;
myRides = null;
suitedArr = null;


//call the ajax function to import the rides list
function getRidesList() {

    var id = parseInt(localStorage.userId);

    var request = {
        volunteerId: id
    }
    GetRides(request, GetRidesSuccessCB, GetRidesErrorCB);
}


//success call back function for get rides
function GetRidesSuccessCB(results) {

    var results = $.parseJSON(results.d);

    results = ridesToClientStructure(results);

    rides = results;

    if (typeof goSuggest !== 'undefined') {
        getMyRidesList();
    }
}


//from server structure to client structure (fields)
function ridesToClientStructure(before) {

    var results = before;

    for (var i = 0; i < results.length; i++) {

        results[i].Id = results[i].RidePatNum;
        results[i].DateTime = parseInt(results[i].Date.replace('/Date(', ''));
        results[i].StartPoint = results[i].Origin.Name;
        results[i].EndPoint = results[i].Destination.Name;

        if (results[i].Shift == "אחר צהריים") {
            results[i].Shift = "אחהצ";
        }

        results[i].Person = results[i].Pat.DisplayName;

        results[i].Melave = [];
        for (var j = 0; j < results[i].Pat.EscortedList.length; j++) {
            results[i].Melave.push(results[i].Pat.EscortedList[j].DisplayName);
        }
    }
    return results;
}

//error call back function for get rides
function GetRidesErrorCB(e) {
    alert("I caught the exception : failed in GetRidesErrorCB \n The exception message is : " + e.responseText);
}


//success call back function for get my rides
function GetMyRidesSuccessCB(results) {

    var results = $.parseJSON(results.d);

    results = myRidesToClientStructure(results);

    myRides = results;

    if (typeof myRidesPrint !== 'undefined') {
        printMyRides(myRides);
        myRidesPrint = undefined;
    }

    if (typeof goSuggest !== 'undefined') {
        suggestSuitedRides();
        goSuggest = undefined;
    }
}

//from server structure to client structure (fields)
function myRidesToClientStructure(before) {

    var results = before;

    var after = [];

    //RIDES
    for (var i = 0; i < results.length; i++) {

        //RIDEPATS

        for (var j = 0; j < results[i].RidePats.length; j++) {

            ridePat = results[i].RidePats[j];

            ridePat.rideId = results[i].Id;

            ridePat.Status = results[i].Status;

            ridePat.Id = ridePat.RidePatNum;
            ridePat.DateTime = parseInt(ridePat.Date.replace('/Date(', ''));
            ridePat.StartPoint = ridePat.Origin.Name;
            ridePat.EndPoint = ridePat.Destination.Name;

            if (ridePat.Shift == "אחר צהריים") {
                ridePat.Shift = "אחהצ";
            }

            ridePat.Person = ridePat.Pat.DisplayName;

            ridePat.Melave = [];
            for (var m = 0; m < ridePat.Pat.EscortedList.length; m++) {
                ridePat.Melave.push(ridePat.Pat.EscortedList[m].DisplayName);
            }

            after.push(ridePat);
        }
    }
    return after;
}

//error call back function for get my rides
function GetMyRidesErrorCB(e) {
    alert("I caught the exception : failed in GetRidesErrorCB \n The exception message is : " + e.responseText);
}

//print my rides
function printMyRides(myRides) {
    $("#myRidesPH").empty();

    //sort result by datetime
    myRides.sort(function (a, b) {
        return a.DateTime.toString().localeCompare(b.DateTime.toString());
    });

    str = "";
    for (var i = 0; i < myRides.length; i++) {

        if (filterMyRides(myRides[i])) {
            str += myRideListItem(myRides, i);
        }
    }

    //var counterStr = '<p style="margin:0px;">מספר הנסיעות: ' + myRides.length + '</p>';

    $("#myRidesPH").html(str);
    $("#myRidesPH").listview("refresh");

    if ($('#myRidesPH li').length == 0) {
        $("#myRidesPH").html('<p style="text-align:center;padding:10%">אין נסיעות מתוכננות עבורך</p>');
        $("#myRidesPH").listview("refresh");
    }
    //$("#myRidesCounterPH").html(counterStr);
}

//print my ride
function myRideListItem(myRides, i) {

    var myDate = new Date(myRides[i].DateTime);
    var day = numToDayHebrew(myDate.getDay());

    var str = '<li data-theme="a">';

    if ($('#doneTAB').prop("class").indexOf("ui-btn-active") != -1) {
        str += '<a id="popINFO' + i + '" href="#infoPastRide"';
    }
    else {
        str += '<a id="popDEL' + i + '" href="#deleteMePage"';
    }


    str += ' class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-info ui-btn-icon-left ';

    if (myRides[i].Status == "Primary") {
        str += 'primary"';
    }
    else {
        str += 'backup"';
    }


    str += '  onClick="delInfo(' + myRides[i].Id + ')">'
        + '<p style="float:right;width:30%;">יום ' + day
        + ' &nbsp; ' + myDate.getDate() + "/" + (myDate.getMonth() + 1)
        + '<br>' + myDate.toTimeString().replace(/.*?(\d{2}:\d{2}).*/, "$1")
        + '</p>'
        + '<p style="float:right;margin-right:10%;">';

    if (myRides[i].Status == "Primary") {
        str += '<b>הסעה</b><br>';
    }
    else {
        str += '<b>גיבוי</b><br>';
    }

    str += myRides[i].StartPoint + '  <i class="fa fa-arrow-left"></i>  '
        + myRides[i].EndPoint
        + '<br>'
        + myRides[i].Person;

    if (myRides[i].Melave.length > 0) {
        str += " +" + (myRides[i].Melave.length)
    }

    str += '</p>' + "</a>" + "</li> ";


    return str;
}


//filter past/plan rides from myRides list
function filterMyRides(myRide) {

    var pastRide = true;

    var rideDateMillisec = myRide.DateTime;
    var nowMillisec = Date.now();

    //doneTAB is checked, meaning we are in the past rides section
    if (rideDateMillisec <= nowMillisec && $('#doneTAB').prop("class").indexOf("ui-btn-active") != -1) {

    }
    //planTAB is checked, meaning we are in the planned rides section
    else if (rideDateMillisec > nowMillisec && $('#planTAB').prop("class").indexOf("ui-btn-active") != -1) { }
    else { pastRide = false; }
    return pastRide;
}

//filter past rides from sigm me page
function isPastRide(ride) {
    var pastRide = true;

    var rideDateMillisec = ride.DateTime;
    var nowMillisec = Date.now();

    if (rideDateMillisec >= nowMillisec) {

    }
    else {
        pastRide = false;
    }
    return pastRide;
}

//publicize the current ride id checked in my rides (for later delete or edit)
function delInfo(rideID) {
    if (rideID != undefined) {
        idDeleteChoose = rideID;
    }
}

//delete ride with the request from the function above
function deleteMyRide() {

    var myRide = getMyRideObjById(idDeleteChoose);

    request = {
        ridePatId: idDeleteChoose,
        rideId: myRide.rideId,
        driverId: parseInt(localStorage.userId)
    }
    deleteRide(request, deleteRideSuccessCB, deleteRideErrorCB);

}

function deleteAllFromMyRide() {
    request = {
        ridePatId: idDeleteChoose,
        driverId: parseInt(localStorage.userId)
    }
    deleteAllRide(request, deleteAllRideSuccessCB, deleteAllRideErrorCB);
}


function deleteAllRideSuccessCB() {
    //for refreshing my rides after the delete
    myRidesPrint = true;
    getMyRidesList();

    getRidesList();

    $.mobile.changePage("#myRides", { transition: "fade", changeHash: true });
    return;
}

function deleteAllRideErrorCB() {
    alert("I caught the exception : failed in deleteAllRideErrorCB \n The exception message is : " + e.responseText);

}


//success call back function for delete ride
function deleteRideSuccessCB() {

    //for refreshing my rides after the delete
    myRidesPrint = true;
    getMyRidesList();

    getRidesList();

    $.mobile.changePage("#myRides", { transition: "fade", changeHash: true });
    return;
}

//error call back function for delete ride
function deleteRideErrorCB(e) {
    alert("I caught the exception : failed in deleteRideErrorCB \n The exception message is : " + e.responseText);
}


//function for filtering the rides by the drop down lists
function filterRides(rides) {

    var filteredRides = [];

    for (var i = 0; i < rides.length; i++) {

        var rideDate = new Date(rides[i].DateTime);

        //for filtering past rides
        if (!isPastRide(rides[i])) {

        }
        else if ($('#shiftDDL').val() != "משמרת" && $('#shiftDDL').val() != rides[i].Shift) {

        }
        else if ($('#dayDDL').val() != "יום" && $('#dayDDL').val() != numToDayHebrew(rideDate.getDay())) {

        }
        else if ($('#dateDDL').val() != "תאריך" && $('#dateDDL').val() != rideDate.toLocaleDateString()) {

        }
        else if ($('#areaDDL').val() != "איזור" && $('#areaDDL').val() != rides[i].Area) {

        }
        else if ($('#startDDL').val() != "מוצא" && $('#startDDL').val() != rides[i].StartPoint) {

        }
        else if ($('#endDDL').val() != "יעד" && $('#endDDL').val() != rides[i].EndPoint) {

        }
        else if (!checkMySeats(rides[i])) {

        }
        else if (checkMyRoutes(rides[i])) {

        }
        else {
            filteredRides.push(rides[i]);
        }
    }

    return filteredRides;
}


//for filtering rides with prefered volunteer routes
function checkMyRoutes(ride) {

    routesArr = $.parseJSON(localStorage.routes);

    for (var i = 0; i < routesArr.length; i++) {
        if (routesArr[i] == ride.StartPoint) {
            return false;
        }
        if (routesArr[i] == ride.EndPoint) {
            return false;
        }
    }
    return true;
}


//for filtering rides with more seats than the volunteer has
function checkMySeats(ride) {

    var maxSeats = checkAvailabilty(ride);

    var rideNeeds = ride.Melave.length + 1;

    return maxSeats >= rideNeeds;
}



//check for multiple rides in the same day for the listview item header
function doRideHeader(results, i) {

    var startPointStr = "&nbsp;&nbsp;";
    var ridesInDayCounter = 1;
    for (var s = 0; s < results.length; s++) {
        if ((new Date(results[i].DateTime)).toLocaleDateString() == (new Date(results[s].DateTime)).toLocaleDateString()) {

            if (startPointStr.indexOf(results[s].StartPoint) == -1) {
                startPointStr += results[s].StartPoint + '(1) , ';
            }
            else {
                startPointStr = startPointStr.replace(results[s].StartPoint + '(' + (ridesInDayCounter) + ')', results[s].StartPoint + '(' + (++ridesInDayCounter) + ')');
            }
        }
        else {
            ridesInDayCounter = 1;
        }
    }
    //-2 delete the ', ' last string
    startPointStr = startPointStr.substring(0, startPointStr.length - 2);

    //add ... if the string to long for the listview item
    if (startPointStr.length > 40) {
        startPointStr = startPointStr.substring(0, 35) + '...';
    }

    return startPointStr;
}

//decide if week spacer: <hr>, is required
function weekSpace(results, i) {
    str = "";
    if (i < results.length - 1 && i != 0) {

        var dateThis = new Date(results[i].DateTime);
        var dateBefore = new Date(results[i - 1].DateTime);

        if (dateThis.getWeek() > dateBefore.getWeek()) {
            str += '<hr class="weekSeperator">';
        }
    }
    return str;
}

//create starting string for listview item
function ListItemStart(myDate, startPointStr) {

    var day = numToDayHebrew(myDate.getDay());

    str = '<li data-role="collapsible" data-theme="b"><hr style="margin:0;">'
        + ' <h2 class="rideListHeader">יום   ' + day + '  &nbsp;  '
        + myDate.getDate() + "/" + (myDate.getMonth() + 1)
        + '  ' + startPointStr + '</h2>';

    return str;
}

//create the ride content inside the listview item
function ListItemRide(results, i) {

    str = "";

    str = RideEquipment(str, i);

    str = rideStr(str, results, i);

    //ride without driver (demand)
    if (results[i].Status == 'ממתינה לשיבוץ') {

        str += '<hr style="margin:0;">';
    }
    else {

        if (i!=0 && results[i].RideNum == results[i - 1].RideNum) {
            str = str.replace('<a style="', '<a style="display:none;');
            str += '<hr style="margin:0;border:0">';
        }
        else if (results[i].RideNum == results[i + 1].RideNum) {

            str += '<hr style="margin:0;border:0">';
        }
        else {

            str += '<hr style="margin:0;">';
        }
    }


    return str;
}



function rideStr(str, results, i) {
    str += '<p style="padding: 4%;float: right;margin-right: 5%;text-align: right;border-radius:15px;"';

    if (results[i].Status == "שובץ נהג") {
        str += ' class="backup" >'
            + '<b>גיבוי</b><br>';
    }
    else {
        str += ' class="primary" >'
            + '<b>הסעה</b><br>';
    }

    str += results[i].StartPoint + ' <i class="fa fa-arrow-left"></i> ' //&#11164; &#129144;
        + '' + results[i].EndPoint

        + '<br/>' + results[i].Person;

    if (results[i].Melave.length > 0) {
        str += " +" + (results[i].Melave.length)
    }
    str += '</p>';

    str += '<a style="float:left;border:none;margin: 8% 3%;" id="pop' + i + '" href="#signMePage"'
        + 'class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all"'
        + '  onClick="info(' + results[i].Id + ')">' + "</a>";

    return str;
}



function RideEquipment(str, i) {
    //for testing user equipment print
    str += '<p style="width:20%;float:right;">';
    if (i % 3 == 0) {
        str += '<img class="ridesIcons" src="Images/wheelchair.png" />';

    }
    if (i % 2 == 0) {
        str += '<img class="ridesIcons" src="Images/babyseat.png" />';
    }
    str += '</p>';
    return str;
}


//sort by startPoints and then by datetime desecnding
function sortFunc(a, b) {
    var aStartP = a.StartPoint;
    var bStartP = b.StartPoint;

    var aDate = a.DateTime;
    var bDate = b.DateTime;

    if (aDate == bDate) {
        return (aStartP < bStartP) ? -1 : (aStartP > bStartP) ? 1 : 0;
    }
    else {
        return (aDate < bDate) ? -1 : 1;
    }
}


function filterByTextInput(results) {

    var filteredRides = [];
    var input = $('#signMe .ui-filterable input').val();

    for (var i = 0; i < results.length; i++) {

        if (results[i].StartPoint.indexOf(input) != -1 || results[i].EndPoint.indexOf(input) != -1 || results[i].Person.indexOf(input) != -1) {
            filteredRides.push(results[i]);
        }
    }

    return filteredRides;

}


//print the rides
function printRides(results) {
    $("#ridesPH").empty();
    var str = "";
    ridesCounter = 0;
    
    results.sort(sortFunc);

    //filter rides
    var results = filterRides(results);

    //filter by input
    if ($('#signMe .ui-filterable input').val() != "") {
        results = filterByTextInput(results);
    }


    for (var i = 0; i < results.length; i++) {

        //heading for rides in the same day
        var startPointStr = doRideHeader(results, i);


        var myDate = new Date(results[i].DateTime);

        if (i == 0) {
            lastDate = results[i].DateTime;
        }
        else {
            lastDate = results[i - 1].DateTime;
        }

        var checkDate = new Date(lastDate);


        if (checkDate.toLocaleDateString() != myDate.toLocaleDateString() || i == 0) {
            if (i != 0) {
                str += "</li>";

                //space between rides in different weeks  <hr>
                str += weekSpace(results, i);

            }

            //create the begining of the list item control
            str += ListItemStart(myDate, startPointStr);

        }

        //create the content of one ride
        str += ListItemRide(results, i);

        ridesCounter++;
        

    }

    if (ridesCounter == 0) {
        var counterStr = '<p>לא נמצאו נסיעות  <a href="#preferences" style="background-color:#202020" data-role="button" data-inline="true" data-theme="b" class="ui-button ui-button-inline ui-widget ui-button-a ui-link ui-btn ui-btn-b ui-btn-icon-left ui-btn-inline ui-shadow ui-corner-all ui-icon-arrow-l" role="button">ההעדפות שלי</a></p>';
    }
    else {

    }

    $("#ridesPH").html(str);
    $("#ridesPH").listview("refresh");
    $("#ridesPH li").collapsible();
    $("#counterPH").html(counterStr);

}

//generate myRide string for listview item
function getRideStr(rideOBJ) {

    var myDate = new Date(rideOBJ.DateTime);

    var day = numToDayHebrew(myDate.getDay());

    var str = '<p>';

    if (rideOBJ.Status == "Primary" || rideOBJ.Status == "ממתינה לשיבוץ") {
        str += '<b>הסעה</b><br><br>';
    }
    else {
        str += '<b>גיבוי</b><br><br>';
    }

    str += 'יום ' + day
        + ', ' + myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear()
        + ', ' + myDate.toTimeString().replace(/.*?(\d{2}:\d{2}).*/, "$1") + '</p>'
        + '<p>מ' + rideOBJ.StartPoint + ' '
        + 'ל' + rideOBJ.EndPoint + ', '
        + '<br/>' + rideOBJ.Person + '</p>';
    if (rideOBJ.Melave.length > 0) {
        str += '<p>מלווים: ';

        for (var i = 0; i < rideOBJ.Melave.length; i++) {
            str += rideOBJ.Melave[i] + "<br/>";
        }

        str += '</p>';
    }

    return str;
}

//get the ride info string for the sign me "popup"
function info(inputID) {

    idChoose = inputID;

    for (var i = 0; i < rides.length; i++) {
        if (rides[i].Id == idChoose) {
            var str = getRideStr(rides[i]);
        }
    }

    $("#phPop").html(str);

}

function signDriverSuccessCB(rideId) {

    localStorage.lastRideId = $.parseJSON(rideId.d);

    suggestStart();

}

function suggestStart() {
    goSuggest = true;
    getRidesList();
}

//error call back function for get rides
function signDriverErrorCB(e) {
    alert("I caught the exception : failed in signDriverErrorCB \n The exception message is : " + e.responseText);
}

//function for converting num of day to hebrew day
function numToDayHebrew(i) {
    var day = "";
    switch (i) {
        case 0:
            day = "א";
            break;
        case 1:
            day = "ב";
            break;
        case 2:
            day = "ג";
            break;
        case 3:
            day = "ד";
            break;
        case 4:
            day = "ה";
            break;
        case 5:
            day = "ו";
            break;
        case 6:
            day = "ש";
    }
    return day;
}

//fill the date ddl dynamicly (30 days forward)
$(document).on('pagebeforeshow', '#signMe', function () {
    var str = "<option>תאריך</option>";
    for (var i = 0; i < 30; i++) {

        var nowDate = new Date();
        var myDate = new Date(nowDate.setDate(nowDate.getDate() + i));

        str += "<option>" + myDate.toLocaleDateString() + "</option>"; //myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear()
    }

    $('#dateDDL').html(str);
    $("#dateDDL").selectmenu("refresh");

});


//handle the filter events
$(document).on('pagebeforeshow', '#signMe', function () {
    $('#signMe fieldset select').change(function () {

        printRides(rides);
    });
});

//check for suited rides with the ride that chosen
function checkRides() {

    suitedArr = [];

    var results = rides;
    var id = lastRide.Id;
    var ride = lastRide;
    var availableSeats = checkAvailabilty(ride);

    if (ride.Status != 'ממתינה לשיבוץ') {
        return suitedArr[0];
    }

    for (var i = 0; i < results.length; i++) {

        var rideDate = new Date(results[i].DateTime);
        var chooseRideDate = new Date(ride.DateTime);

        if (rideDate.toDateString() != chooseRideDate.toDateString()) {
            continue;
        }
        if (results[i].Id == id) {
            continue;
        }
        if (ride.Shift != results[i].Shift) {
            continue;
        }
        if (ride.StartPoint != results[i].StartPoint) {
            continue;
        }
        if (ride.EndPoint != results[i].EndPoint) {
            continue;
        }
        if (availableSeats < (results[i].Melave.length + 1)) {
            continue;
        }
        if (results[i].Status != 'ממתינה לשיבוץ') {
            continue;
        }

        suitedArr.push(results[i]);
    }


    suitedArr.sort(function (a, b) {
        return b.Melave.length.toString().localeCompare(a.Melave.length.toString());
    });

    return suitedArr[0];
}


//on sign me to ride click ok
$(document).on('pagebeforeshow', '#signMePage', function () {

    $("#okBTN").on("click", function () {

        lastRide = getRideById(idChoose);

        maxSeats = checkAvailabilty(lastRide);

        mySeats = parseInt(localStorage.availableSeats);

        if (maxSeats == mySeats || lastRide.Status != 'ממתינה לשיבוץ') {
            signDriverToRide(idChoose);
        }
        else {
            CombineRideRidePat(idChoose, localStorage.myRideTemp);
        }

        //handle case that rise is already taken


    });
});


//check how many seats are available in a specific day and shift
function checkAvailabilty(lastRide) {

    var ride = lastRide;
    var sum = 0;

    for (var i = 0; i < myRides.length; i++) {

        var rideDate = (new Date(ride.DateTime)).toLocaleDateString();
        var myRideDate = (new Date(myRides[i].DateTime)).toLocaleDateString();

        if (ride.Shift == myRides[i].Shift && rideDate == myRideDate) {
            sum += (myRides[i].Melave.length + 1);
            localStorage.myRideTemp = myRides[i].rideId;
        }
    }

    var mySeats = parseInt(localStorage.availableSeats);
    return mySeats - sum;
}


//get the ride that the volenteer sign to, by id
function getRideById(id) {
    for (var i = 0; i < rides.length; i++) {
        if (rides[i].Id == id) {
            ride = rides[i];
            return ride;
        }
    }
    return null;
}


//suggest suited rides
function suggestSuitedRides() {

    suggestedRide = checkRides();

    if (suggestedRide != null) {

        var str = createSuggestPage(suggestedRide);

        if (window.location.href.toString().indexOf('suggest') == -1) {

            //first time in suggest page
            $.mobile.changePage("#suggest", { transition: "fade", changeHash: true });
            $("#phSuggest").html(str);
            return;
        }
        else {

            //from suggest page to another suggest 
            $("#suggest h1,#suggest a,#suggest div").hide();

            $("#phSuggest").html(str);

            $("#suggest h1,#suggest a,#suggest div").fadeIn(350);
        }

    }
    else {
        //var str = createConfirmationPage(lastRide);
        $.mobile.changePage("#signConfirmation", { transition: "fade", changeHash: true });
        //$("#phConfirmation").html(str);
        return;
    }
}



//get ridt obj by real id (id in db)
function getRideStatusById(id) {

    var status = "";
    for (var i = 0; i < rides.length; i++) {
        if (rides[i].Id == id) {
            status = rides[i].Status;
        }
    }

    if (status == "ממתינה לשיבוץ") {
        //sign as primary driver
        return true;
    }
    else {
        //sign as secondary driver
        return false;
    }
}

//create suggest page
function createSuggestPage(ride) {

    var str = '<p><b>נוסעים נוספים יכולים להצטרף לנסיעה</b></p>';

    var myDate = new Date(ride.DateTime);
    var day = numToDayHebrew(myDate.getDay());

    str += '<p>ביום ' + day
        + ', ' + myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear()
        + ', בשעה ' + myDate.toTimeString().replace(/.*?(\d{2}:\d{2}).*/, "$1") + '</p>'
        + '<p>מ' + ride.StartPoint + ' ' + 'ל' + ride.EndPoint + '.</p>'

        //+ "<p> מושבים ברכבך (לא כולל נהג): " + maxSeats
        //+ '<a data-icon="edit" id="updateSeatsBTN" href="#" style="background-color:#202020" data-role="button" data-inline="true" data-theme="b" class="ui-button ui-button-inline ui-widget ui-button-a ui-link ui-btn ui-btn-b ui-icon-edit ui-btn-icon-left ui-btn-inline ui-shadow ui-corner-all" role="button">עדכן</a>'
        //+ '</p>'

        + '<p>האם אתה מעוניין לצרף לנסיעה את ' + suggestedRide.Person
        + ' +' + suggestedRide.Melave.length
        + "?</p>";


    return str;
}

//create suggest page
function createConfirmationPage(ride) {

    var str = "";

    var myDate = new Date(ride.DateTime);
    var day = numToDayHebrew(myDate.getDay());

    str += '<p>ביום ' + day
        + ', ' + myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear()
        + ', בשעה ' + myDate.toTimeString().replace(/.*?(\d{2}:\d{2}).*/, "$1") + '</p>'
        + '<p>מ' + ride.StartPoint + ' ' + 'ל' + ride.EndPoint
        + '<br>' + ride.Person + " ו-" + ride.Melave.length + " מלווים";
    + '</p>'
    //+ createMelaveStr(ride);

    return str;
}


//create melave string for suggest page
function createMelaveStr(ride) {
    var str = "";
    if (ride.Melave.length == 0) {
        str += "?";
    }
    else if (ride.Melave.length == 1) {
        str += " ו" + ride.Melave[0] + "?";
    }
    else {
        for (var i = 0; i < ride.Melave.length; i++) {


            if (i == ride.Melave.length - 1) {
                str += " ו" + ride.Melave[i] + "?";
            }
            else {
                str += ", " + ride.Melave[i] + " ";
            }
        }
    }
    return str;
}

//after signing to ride and we suggest a suited ride, volenteer click ok
$(document).on('pagebeforeshow', '#suggest', function () {


    $("#suggestOkBTN").on("click", function () {

        CombineRideRidePat(suggestedRide.Id, parseInt(localStorage.lastRideId));

    });


});

function signDriverToRide(id) {

    var request = {
        ridePatId: id,
        userId: parseInt(localStorage.userId)
    };

    signDriver(request, signDriverSuccessCB, signDriverErrorCB);

}

function CombineRideRidePat(id, rideid) {

    localStorage.lastRidePat = id;

    var request = {
        rideId: parseInt(rideid),
        RidePatId: id
    };

    CombineRideRidePatAjax(request, CombineRideRidePatAjaxSuccessCB, CombineRideRidePatAjaxErrorCB);

}

function CombineRideRidePatAjaxSuccessCB(res) {
    //res = -1 ridepat already signed to another ride
    //res >= 0 rows updated

    lastRide = getRideById(parseInt(localStorage.lastRidePat));

    maxSeats = checkAvailabilty(lastRide);

    suggestStart();
}

function getMyRidesList() {

    var id = parseInt(localStorage.userId);

    var request = {
        volunteerId: id
    }

    GetMyRides(request, GetMyRidesSuccessCB, GetMyRidesErrorCB);
}


function CombineRideRidePatAjaxErrorCB() {
    //error handle
}

//clear filter button
$(document).on('pagebeforeshow', '#signMe', function () {
    $(document).on('click', '#clearFilter', function () {

        $("#dayDDL").prop('selectedIndex', 0);
        $("#dayDDL").selectmenu("refresh");
        $("#endDDL").prop('selectedIndex', 0);
        $("#endDDL").selectmenu("refresh");
        $("#startDDL").prop('selectedIndex', 0);
        $("#startDDL").selectmenu("refresh");
        $("#areaDDL").prop('selectedIndex', 0);
        $("#areaDDL").selectmenu("refresh");
        $("#shiftDDL").prop('selectedIndex', 0);
        $("#shiftDDL").selectmenu("refresh");
        $("#dateDDL").prop('selectedIndex', 0);
        $("#dateDDL").selectmenu("refresh");

        printRides(rides);
    });
});


//tabs control
//////////////

//click on morningTAB or afternoonTAB
$(document).on('pagebeforeshow', '#signMe', function () {
    $(document).on('click', '#morningTAB', function () {
        $("#shiftDDL").prop('selectedIndex', 1);
        $("#shiftDDL").selectmenu("refresh");

        printRides(rides);
    });

    $(document).on('click', '#afternoonTAB', function () {
        $("#shiftDDL").prop('selectedIndex', 2);
        $("#shiftDDL").selectmenu("refresh");

        printRides(rides);
    });
});

//click on doneTAB or planTAB
$(document).on('pagebeforeshow', '#myRides', function () {

    if ($('#doneTAB').prop("class").indexOf("ui-btn-active") != -1 || $('#planTAB').prop("class").indexOf("ui-btn-active") != -1) {
        printMyRides(myRides);
    }
    else {
        $('#planTAB').addClass("ui-btn-active");
        printMyRides(myRides);
    }

    $(document).on('click', '#doneTAB,#planTAB', function () {
        printMyRides(myRides);
    });
});

//activate doneTAB after closing infoPastRide
$(document).on('pagebeforeshow', '#infoPastRide', function () {


    var myRide = getMyRideObjById(idDeleteChoose);

    $('#phPopInfo').html(getRideStr(myRide));


    $("#closeInfoBTN").on('click', function () {
        $('#doneTAB').addClass('ui-btn-active');
        printMyRides(myRides);
    });
});

//activate planTAB after closing deleteMePage
$(document).on('pagebeforeshow', '#deleteMePage', function () {


    var myRide = getMyRideObjById(idDeleteChoose);

    $('#phPopDelete').html(getRideStr(myRide));

});

$(document).ready(function () {
    $("#deleteokBTN").on('click', function () {

        if (myRideHasMultipulePats(idDeleteChoose)) {
            $.mobile.changePage("#deleteOptions", { transition: "fade", changeHash: true });
            return;
        }
        else {
            $.mobile.changePage("#deleteConfirm", { transition: "fade", changeHash: true });
            return;
        }
    });
});

function myRideHasMultipulePats(ridePatId) {
    var thisRide = getMyRideObjById(ridePatId);
    var rideId = thisRide.rideId;

    for (var i = 0; i < myRides.length; i++) {
        if (myRides[i].Id != ridePatId && myRides[i].rideId == rideId) {
            return true;
        }
    }
    return false;
}


function getMyRideObjById(id) {
    for (var i = 0; i < myRides.length; i++) {
        if (myRides[i].Id == id) {
            return myRides[i];
        }
    }
}


//create menu - side panel
$(document).one('pagebeforecreate', function () {
    var panel = '<div data-role="panel" id="mypanel"  data-position="right" data-display="reveal" data-theme="b" class="ui-panel ui-panel-position-right ui-panel-display-reveal ui-body-b ui-panel-animate">'
        + '<div class="ui-panel-inner">'
        + '<ul data-role="listview">'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="signMeTab" href="#signMe" data-theme="b">שבץ אותי</a></li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="myRidesTab" href="#myRides" data-theme="b">הנסיעות שלי</a> </li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="preferencesTab" href="#preferences" data-theme="b">העדפות</a> </li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="trackRidesTab" href="#trackRides" data-theme="b">מעקב הסעות</a> </li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="trackRidesTab" href="#auction" data-theme="b">מכרז</a> </li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-delete">'
        + '<a href="#" data-rel="close">סגירת התפריט</a>'
        + '</li>'
        + '</ul>'
        + '</div>'
        + '</div>';
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
});


//keyup/click/focusout events, refreshing the rides when jquery list filter is on action
$(document).on('pagebeforeshow', '#signMe', function () {
    $(document).on('keyup', '#signMe input[data-type="search"]', function () {

        printRides(rides);

    });

    $(document).on('keydown', '#signMe input[data-type="search"]', function () {

        printRides(rides);

    });

    $('#signMe .ui-filterable').click(function () {

        printRides(rides);

    });

    $('#signMe .ui-filterable').focusout(function () {

        printRides(rides);

    });

    $('#signMe .ui-filterable input').change(function () {

        printRides(rides);

    });
});


//mangae active state of tabs in signMe page
$(document).on('pagebeforeshow', '#signMe', function () {
    if ($('#shiftDDL').val() == 'בוקר') {
        $('#morningTAB').addClass('ui-btn-active');
    }
    else if ($('#shiftDDL').val() == 'אחהצ') {
        $('#afternoonTAB').addClass('ui-btn-active');
    }
    printRides(rides);
});


$(document).on('pagebeforeshow', '#loginPreference', function () {


    $("#welcomeTitle").html("שלום " + userInfo.FirstNameH);

    $("#nextPageBTN").on('click', function () {

        if (checkPlanRides(myRides)) {
            $.mobile.changePage("#myRides", { transition: "fade", changeHash: true });
        }
        else {
            $.mobile.changePage("#signMe", { transition: "fade", changeHash: true });
        }
    });
});

function checkPlanRides(myRides) {
    if (myRides == null || myRides.length == 0) {
        return false;
    }
    else {
        for (var i = 0; i < myRides.length; i++) {
            if (myRides[i].DateTime > Date.now()) {
                return true;
            }
        }
    }
    return false;
}


$(document).on('pagebeforeshow', '#loginLogo', function () {

    //for testing first time process
    //localStorage.clear();

    if (localStorage.cellphone == null) {

        manualLogin();

    }
    else {
        var cellphone = localStorage.cellphone;
        checkUserPN(cellphone);
    }

});


function checkUserPN(cellphone) {
    var request = {
        mobile: cellphone
    }
    checkUser(request, checkUserSuccessCB, checkUserErrorCB);
}


$(document).on('pagebeforeshow', '#loginFailed', function () {


    $('#userPnBTN').on('click', function () {

        var cellphone = $('#userPnTB').val();
        localStorage.cellphone = cellphone;

        var request = {
            mobile: cellphone
        }
        checkUser(request, checkUserSuccessCB, checkUserErrorCB);
    });

});


function manualLogin() {

    setTimeout(function () {
        $.mobile.changePage("#loginFailed", { transition: "fade", changeHash: true });
        return;
    }, 500);
}


function checkUserSuccessCB(results) {

    var results = $.parseJSON(results.d);

    //unassaigned user

    if (results.Id == 0) {
        //send request for volunteer
        setTimeout(function () {
            alert("מספר הטלפון שהוכנס אינו רשום למשתמש במערכת");
        }, 100);
        return;
    }


    userInfo = results;
    localStorage.userId = userInfo.Id;
    //get personal info: name, photo, address etc.
    //get preferences routes and seats


    //get all rides
    getRidesList();

    //getMyRides
    getMyRidesList();


    if (localStorage.availableSeats == null) {
        setTimeout(function () {
            $.mobile.changePage("#preferences", { transition: "fade", changeHash: true });
        }, 1000);
        return;
    }


    $.mobile.changePage("#loginPreference", { transition: "fade", changeHash: true });

}

function checkUserErrorCB(e) {
    alert("error in checkUser");
}

$(document).on('pagebeforeshow', '#preferences', function () {

    if (localStorage.availableSeats == null) {
        //do nothing, wait for user to change preferences (seats)
    }
    else {
        var seats = localStorage.availableSeats;
        $('#availableSeats select').val(seats);
        $('#availableSeats select').selectmenu('refresh');
    }


    $('#seatsToAreaBTN').on('click', function () {

        var seats = $('#availableSeats select').val();

        userInfo.availableSeats = seats;
        localStorage.availableSeats = seats;
        //and also update the db with the seats


        $.mobile.changePage("#myRoutes", { transition: "fade", changeHash: true });


    });
});


$(document).on('pagebeforeshow', '#myRoutes', function () {


    if (localStorage.routes == null) {
        //do nothing, wait for user to change preferences (routes)
    }
    else {
        //user have saved routes

        var routes = $.parseJSON(localStorage.routes);

        if (routes[0].south && !$('#southArea').is(':checked')) {
            $('#myRoutes #area .ui-checkbox label').eq(0).click();
            $('.south').show();
        }
        if (routes[0].center && !$('#centerArea').is(':checked')) {
            $('#myRoutes #area .ui-checkbox label').eq(1).click();
            $('.center').show();
        }
        if (routes[0].north && !$('#northArea').is(':checked')) {
            $('#myRoutes #area .ui-checkbox label').eq(2).click();
            $('.north').show();
        }


        showSavedRoutes(routes);
    }



    $('#area input').on('change', function () {

        showAreas();

    });

    $('#saveRoutesBTN').on('click', function () {

        if (!$('#southArea').is(':checked') && !$('#centerArea').is(':checked') && !$('#northArea').is(':checked')) {
            alert("אנא בחר איזורים והעדפות ורק לאחר מכן לחץ על המשך");
            return;
        }

        routesArr = [];

        var area = {};
        area.south = $('#southArea').is(':checked');
        area.center = $('#centerArea').is(':checked');
        area.north = $('#northArea').is(':checked');


        routesArr.push(area);

        var actives = $('#starts .ui-btn-active,#ends .ui-btn-active');

        for (var i = 0; i < actives.length; i++) {
            routesArr.push(actives[i].innerHTML);
        }

        if (routesArr.length < 2) {
            alert("אנא בחר העדפות ורק לאחר מכן לחץ על המשך");
            return;
        }

        //save routesArr to DB
        localStorage.routes = JSON.stringify(routesArr);


        //get all rides
        getRidesList();

        //getMyRides
        getMyRidesList();


        $.mobile.changePage("#signMe", { transition: "fade", changeHash: true });

    });

});

$(document).on('ready', '#myRoutes', function () {
    showAreas();
});


function showSavedRoutes(routes) {

    var activates = $('#myRoutes .ui-checkbox');

    for (var r = 0; r < routes.length; r++) {

        for (var i = 0; i < activates.length; i++) {

            var point = activates[i].children[0].innerHTML;

            if (point == routes[r]) {

                if ($('#myRoutes .ui-checkbox label').eq(i)[0].classList.contains("ui-checkbox-off")) {

                    $('#myRoutes .ui-checkbox label').eq(i).click();
                }

            }
        }

    }

}


function showAreas() {

    $('.north , .center , .south').hide();


    if ($('#southArea').is(':checked')) {
        $('.south').show();
    }

    if ($('#centerArea').is(':checked')) {
        $('.center').show();
    }

    if ($('#northArea').is(':checked')) {
        $('.north').show();
    }
}


$(window).load(function () {
    var phones = [{ "mask": "###-#######" }];
    $('#phoneTB').inputmask({
        mask: phones,
        greedy: false,
        definitions: { '#': { validator: "[0-9]", cardinality: 1 } }
    });
    $('#userPnTB').inputmask({
        mask: phones,
        greedy: false,
        definitions: { '#': { validator: "[0-9]", cardinality: 1 } }
    });
});