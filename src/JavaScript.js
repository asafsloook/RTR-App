// add to kavim+times explain text
// disable/hide tabs in first login
// check all when choosing area first login
// add haifa to south
// alef-hey checked
// space before () headers
// daf rakaz text (my acc)
// adding some green
// get week (if fix)
// match (shift fix)
//add manager to rakaz permisions
//add info btn to signme lists
//save prefs by all ctrl change
//notes show on all rides
//matan-get more info for ridepat
//matan-reg id to check user web service
//double set status bug
//problems ui
//login to reporting status page
//problem statuses
//matan- varchar 150 status ???
//matan-last status (live) remember (nees status on ride (also הלוך חזור, primary seconderay on status))
//matan-myrides cancel popup rakaz call when ride is near (need coordinator cell)
//exceptions, error callbacks
//double click on active problem
//clear textarea problem after send
//after send problem go one back to status

//myPrefs exit without lines, (maybe ui )
//connect live status to status page (auto activate) ??

domain = '';
if (!window.location.href.includes('http')) {
    domain = 'https://proj.ruppin.ac.il/igroup91/test2/tar2';
}
else {
    domain = '..';
}

//get week function
Date.prototype.getWeek = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    d.setUTCDate(d.getUTCDate() - d.getUTCDay());
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}


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

    if (loginThread) {

        //getMyRides
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

        var rideTime = (new Date(results[i].DateTime)).toLocaleTimeString();

        if (rideTime.indexOf('PM') != -1) {
            results[i].Shift = "אחהצ";
        }
        else {
            results[i].Shift = "בוקר";
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
    popupDialog('שגיאה', e.responseJSON.Message, '#loginLogo', false, null);
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

    if (loginThread) {

        if (localStorage.availableSeats == null || localStorage.availableSeats == "0") {
            setTimeout(function () {
                loginThread = false;
                $.mobile.pageContainer.pagecontainer("change", "#myPreferences");
            }, 1000);
        }
        else {
            setTimeout(function () {
                loginThread = false;
                $.mobile.pageContainer.pagecontainer("change", "#loginPreference");
            }, 1000);
        }
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

            ridePat.DriverType = results[i].DriverType;

            ridePat.Id = ridePat.RidePatNum;
            ridePat.DateTime = parseInt(ridePat.Date.replace('/Date(', ''));
            ridePat.StartPoint = ridePat.Origin.Name;
            ridePat.EndPoint = ridePat.Destination.Name;

            var rideTime = (new Date(ridePat.DateTime)).toLocaleTimeString();

            if (rideTime.indexOf('PM') != -1) {
                ridePat.Shift = "אחהצ";
            }
            else {
                ridePat.Shift = "בוקר";
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
    popupDialog('שגיאה', e.responseJSON.Message, '#loginLogo', false, null);
}


function managePlusBTN() {
    if ($('#doneTAB').prop("class").indexOf("ui-btn-active") != -1) {

    }
}

//print my rides
function printMyRides(myRides) {

    managePlusBTN();

    $("#myRidesPH").empty();

    //sort result by datetime
    myRides.sort(function (a, b) {
        return a.DateTime.toString().localeCompare(b.DateTime.toString());
    });

    var myRideStr = "";
    for (var i = 0; i < myRides.length; i++) {

        if (filterMyRides(myRides[i])) {

            var temp = myRideListItem(myRides, i);
            if (typeof temp !== 'undefined') {
                myRideStr += temp;
            }
        }
    }

    //var counterStr = '<p style="margin:0px;">מספר הנסיעות: ' + myRides.length + '</p>';


    $("#myRidesPH").html(myRideStr);
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

    //dont show past rides as backup driver (not a actual ride)
    if (myRides[i].DriverType != "Primary" && $('#doneTAB').prop("class").indexOf("ui-btn-active") != -1) {
        return;
    }

    var str = '<li style="border: 1px solid rgba(200,200,200,0.5);" data-theme="a" ';

    if ($('#doneTAB').prop("class").indexOf("ui-btn-active") != -1) {
        str += ' id="popINFO' + myRides[i].Id + '" class="';
    }
    else {
        str += ' id="popDEL' + myRides[i].Id + '" class="';
    }


    if (myRides[i].DriverType == "Primary") {
        str += 'primary popINFO">';
    }
    else {
        str += 'backup popDEL">';
    }


    str += '<p style="float:right;width:20%;margin-right: 1%;">יום ' + day
        + ' <br> ' + myDate.getDate() + "." + (myDate.getMonth() + 1);

    var hour = myDate.toTimeString().replace(/.*?(\d{2}:\d{2}).*/, "$1");

    if (parseInt(hour.substring(0, 2)) <= 12) {
        if (hour.startsWith("0")) {
            hour = hour.substring(1, hour.length);
        }
        str += '<br>' + hour + '</p>';
    }
    else {
        str += '<br> אחה"צ </p>';
    }


    str = RideEquipment(str, myRides, i);
    str += '<p style="float:right;margin-right:5%;width: 40%;">';



    if (myRides[i].DriverType == "Primary") {
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

    str += '</p>';

    if ($('#doneTAB').prop("class").indexOf("ui-btn-active") == -1) {
        str += '<a style="background-color: #ff8c8c;float:left;border:none;margin:0;border-radius:25px" href="#" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all deleteokBTN"></a>';
    }

    str += "</li> ";

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

    $.mobile.pageContainer.pagecontainer("change", "#deleteConfirmation");
}

function deleteAllRideErrorCB() {
    popupDialog('שגיאה', e.responseJSON.Message, '#myRides', false, null);
}


//success call back function for delete ride
function deleteRideSuccessCB() {


    //for refreshing my rides after the delete
    myRidesPrint = true;
    getMyRidesList();

    getRidesList();

    $.mobile.pageContainer.pagecontainer("change", "#deleteConfirmation");
}

//error call back function for delete ride
function deleteRideErrorCB(e) {
    popupDialog('שגיאה', e.responseJSON.Message, '#myRides', false, null);
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
        else if (!checkTime(rides[i])) {

        }
        else if (typeof showAll !== 'undefined') {
            filteredRides.push(rides[i]);
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

//for filtering rides that conflict with active myRide of volunteer
function checkTime(ride) {

    var rideTime = (new Date(ride.DateTime)).toLocaleTimeString();
    var rideDate = (new Date(ride.DateTime)).toLocaleDateString();

    for (var i = 0; i < myRides.length; i++) {

        var myRideTime = (new Date(myRides[i].DateTime)).toLocaleTimeString();
        var myRideDate = (new Date(myRides[i].DateTime)).toLocaleDateString();

        if (rideDate == myRideDate) {
            if (myRides[i].Shift == ride.Shift) {
                if (myRideTime == rideTime && myRides[i].EndPoint == ride.EndPoint && myRides[i].StartPoint == ride.StartPoint) {
                    return true;
                }
                return false;
            }
        }
    }

    return true;
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
                startPointStr += results[s].StartPoint + ' (1) , ';
            }
            else {
                startPointStr = startPointStr.replace(results[s].StartPoint + ' (' + (ridesInDayCounter) + ')', results[s].StartPoint + ' (' + (++ridesInDayCounter) + ')');
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
    if (i <= results.length - 1 && i != 0) {

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

    str = '<li data-role="collapsible" data-theme="a"><hr style="margin:0;">'
        + ' <h2 class="rideListHeader">יום   ' + day + "  &nbsp;  "
        + myDate.getDate() + "." + (myDate.getMonth() + 1)
        + '  ' + startPointStr + '</h2>';

    return str;
}

//create the ride content inside the listview item
function ListItemRide(results, i) {

    str = "";

    str = RideEquipment(str, results, i);

    str = rideStr(str, results, i);

    //ride without driver (demand)
    if (results[i].Status == 'ממתינה לשיבוץ') {

        str += '<hr style="margin:0;">';
    }
    else {

        if (i != 0 && results[i].RideNum == results[i - 1].RideNum) {
            str = str.replace('<a style="', '<a style="display:none;');
            str += '<hr style="margin:0;border:0">';
        }
        else if (i + 1 == results.length) {
            str += '<hr style="margin:0;">';
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

function printInfo(ride) {

    $('#infoPagePH').empty();

    var str = getRideStr(ride);
    str += '<a href="tel:' + ride.Pat.CellPhone + '"><i class="fa fa-phone-square" style="font-size: 30px;"></i></a><br><br>'
    //call
    //window.open("tel:" + this.id);

    $('#infoPagePH').html(str);
}

function rideStr(str, results, i) {

    var myDate = new Date(results[i].DateTime);
    var time = myDate.toTimeString().replace(/.*?(\d{2}:\d{2}).*/, "$1");

    if (time.startsWith("0")) {
        time = time.substring(1, time.length);
    }

    str += '<p style="padding: 4%;float: right;margin-right: 0;text-align: right;border-radius:15px;max-width: 50%;border: 1px #ddd solid;"';

    if (results[i].Status == "שובץ נהג") {
        str += ' class="backup" >'
            + '<b>גיבוי ' + time + '</b>';
    }
    else {
        str += ' class="primary" >'
            + '<b>הסעה ' + time + '</b>';
    }
    str += '<i class="fa fa-info-circle" style="float: left;"></i><br>';

    str += results[i].StartPoint + ' <i class="fa fa-arrow-left"></i> ' //&#11164; &#129144;
        + '' + results[i].EndPoint

        + '<br/>' + results[i].Person;

    if (results[i].Melave.length > 0) {
        str += " +" + (results[i].Melave.length)
    }
    str += '</p>';

    str += '<a style="float:left;border:none;margin: 8% 3%;background: transparent;padding:0;" id="pop' + i + '" href="#signMePage"'
        + ' class="ui-btn" '
        + ' name="' + results[i].Id + '" onClick="info(' + results[i].Id + ')">'
        + '   <img style="width: 35px;" src="Images/reg.png"></a> '
        + "</a>";

    return str;
}



function RideEquipment(str, results, i) {

    var EquipmentLength = results[i].Pat.Equipment.length;
    var margin = 10;

    if (window.location.href.toString().indexOf('signMe') != -1) {
        str += '<p style="width:20%;float:right;text-align:center;';

        if (EquipmentLength == 3) {
            margin = 4;
        }
        else if (EquipmentLength == 2) {
            margin = 8;
        }
        else if (EquipmentLength == 1) {
            margin = 12;
        }
    }
    else if (window.location.href.toString().indexOf('myRides') != -1) {
        str += '<p style="width:20%;float:right;text-align:center;';

        if (EquipmentLength == 3) {
            margin = 0;
        }
        else if (EquipmentLength == 2) {
            margin = 4;
        }
    }


    str += 'margin:' + margin + '% 0; ">';

    if (results[i].Pat.Equipment == null) {
        str += '</p>';
        return str;
    }

    if (results[i].Pat.Equipment.includes("כסא גלגלים")) {
        str += '<img class="ridesIcons" src="Images/wheelchair.png" /><br>';
    }
    if (results[i].Pat.Equipment.includes("כסא תינוק")) {
        str += '<img class="ridesIcons" src="Images/babyseat.png" /><br>';
    }
    if (results[i].Pat.Equipment.includes("בוסטר")) {
        str += '<img class="ridesIcons" src="Images/booster.png" /><br>';
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
    $("#counterPH").empty();
    $("#ridesPH").empty();
    var str = "";
    ridesCounter = 0;

    results.sort(sortFunc);

    //filter rides
    var results = filterRides(results);


    if (typeof showInput !== 'undefined') {
        //filter by input
        if ($('#signMe .ui-filterable input').val() != "") {
            results = filterByTextInput(results);
        }
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

    var counterStr = '';
    if (ridesCounter == 0) {
        counterStr = '<p>לא נמצאו נסיעות</p><p>ניתן להציג את כל הנסיעות <BR>על ידי כפתור הצג הכל</p>';

        if (typeof showInput !== 'undefined' && $('#signMe .ui-filterable input').val() != "") {
            counterStr = '<p>לא נמצאו נסיעות על ידי<BR> מילות החיפוש שהזנת</p>';
            showInput = undefined;
        }
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

    if (rideOBJ.DriverType == "Primary" || rideOBJ.Status == "ממתינה לשיבוץ") {
        str += '<b>הסעה</b><br><br>';
    }
    else {
        str += '<b>גיבוי</b><br><br>';
    }

    str += 'יום ' + day
        + ', ' + myDate.getDate() + "." + (myDate.getMonth() + 1) + "." + myDate.getFullYear() + ', ';

    //if page is myRides show afternoon and not excact time
    var hour = myDate.toTimeString().replace(/.*?(\d{2}:\d{2}).*/, "$1");

    if (parseInt(hour.substring(0, 2)) <= 12) {
        if (hour.startsWith("0")) {
            hour = hour.substring(1, hour.length);
        }
        str += hour + '</p>';
    }
    else {
        str += 'אחה"צ</p>';
    }

    str += '<p>מ' + rideOBJ.StartPoint + ' '
        + 'ל' + rideOBJ.EndPoint
        + '<br/><br/>' + rideOBJ.Person + '<br/>';

    if (rideOBJ.Melave.length > 0) {
        str += 'מלווים: ';

        for (var i = 0; i < rideOBJ.Melave.length; i++) {
            str += rideOBJ.Melave[i] + "<br/>";
        }

        str += '</p>';
    }

    if (rideOBJ.RideNum > 0) {
        for (var i = 0; i < rides.length; i++) {
            if (rides[i].RideNum == rideOBJ.RideNum && rideOBJ.Id != rides[i].Id) {
                str += '<p>' + rides[i].Person + '<br/>';

                if (rides[i].Melave.length > 0) {
                    str += 'מלווים: ';

                    for (var j = 0; j < rides[i].Melave.length; j++) {
                        str += rides[i].Melave[j] + "<br/>";
                    }

                    str += '</p>';
                }
            }
        }
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
    popupDialog('שגיאה', e.responseJSON.Message, '#myRides', false, null);
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
    return day + "'";
}

////fill the date ddl dynamicly (30 days forward)
//$(document).on('pagebeforeshow', '#signMe', function () {
//    var str = "<option>תאריך</option>";
//    for (var i = 0; i < 30; i++) {

//        var nowDate = new Date();
//        var myDate = new Date(nowDate.setDate(nowDate.getDate() + i));

//        str += "<option>" + myDate.toLocaleDateString() + "</option>"; //myDate.getDate() + "." + (myDate.getMonth() + 1) + "." + myDate.getFullYear()
//    }

//    $('#dateDDL').html(str);
//    $("#dateDDL").selectmenu("refresh");

//});

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

        var rideTime = (new Date(results[i].DateTime)).toLocaleTimeString();
        var chooseRideTime = (new Date(ride.DateTime)).toLocaleTimeString();

        if (chooseRideTime != rideTime) {
            continue;
        }
        if (rideDate.toDateString() != chooseRideDate.toDateString()) {
            continue;
        }
        if (results[i].Id == id) {
            continue;
        }
        //if (ride.Shift != results[i].Shift) {
        //    continue;
        //}
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

//check how many seats are available in a specific day and time
function checkAvailabilty(lastRide) {

    var ride = lastRide;
    var sum = 0;

    for (var i = 0; i < myRides.length; i++) {

        var rideDate = (new Date(ride.DateTime)).toLocaleDateString();
        var myRideDate = (new Date(myRides[i].DateTime)).toLocaleDateString();

        var rideTime = (new Date(ride.DateTime)).toLocaleTimeString();
        var myRideTime = (new Date(myRides[i].DateTime)).toLocaleTimeString();

        if (myRideTime == rideTime && rideDate == myRideDate) {
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

            $.mobile.pageContainer.pagecontainer("change", "#suggest");

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

        $.mobile.pageContainer.pagecontainer("change", "#signConfirmation");
        //$("#phConfirmation").html(str);
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
        + ', ' + myDate.getDate() + "." + (myDate.getMonth() + 1) + "." + myDate.getFullYear()
        + ', בשעה ' + myDate.toTimeString().replace(/.*?(\d{2}:\d{2}).*/, "$1") + '</p>'
        + '<p>מ' + ride.StartPoint + ' ' + 'ל' + ride.EndPoint + '.</p>'

        //+ "<p> מושבים ברכבך (לא כולל נהג): " + maxSeats
        //+ '<a data-icon="edit" id="updateSeatsBTN" href="#" style="background-color:#202020" data-role="button" data-inline="true" data-theme="b" class="ui-button ui-button-inline ui-widget ui-button-a ui-link ui-btn ui-btn-b ui-icon-edit ui-btn-icon-left ui-btn-inline ui-shadow ui-corner-all" role="button">עדכן</a>'
        //+ '</p>'

        + '<p style="margin: 5% 10%;">האם אתה מעוניין לצרף לנסיעה את ' + suggestedRide.Person
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
        + ', ' + myDate.getDate() + "." + (myDate.getMonth() + 1) + "." + myDate.getFullYear()
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



//click on doneTAB or planTAB
$(document).on('pagebeforeshow', '#myRides', function () {

    if ($('#doneTAB').prop("class").indexOf("ui-btn-active") != -1 || $('#planTAB').prop("class").indexOf("ui-btn-active") != -1) {
        printMyRides(myRides);
    }
    else {
        $('#planTAB').addClass("ui-btn-active");
        $('#planTAB').click();
        printMyRides(myRides);
    }


});


//activate doneTAB after closing infoPastRide
$(document).on('pagebeforeshow', '#infoPastRide', function () {


    var myRide = getMyRideObjById(idDeleteChoose);

    $('#phPopInfo').html(getRideStr(myRide));

});


//activate planTAB after closing deleteMePage
$(document).on('pagebeforeshow', '#deleteMePage', function () {


    var myRide = getMyRideObjById(idDeleteChoose);

    $('#phPopDelete').html(getRideStr(myRide));

});


function myRideHasMultipulePats(ridePatId) {
    var thisRide = getMyRideObjById(ridePatId);
    var rideId = thisRide.rideId;

    for (var i = 0; i < myRides.length; i++) {
        if (myRides[i].Id != ridePatId && myRides[i].rideId == rideId && myRides[i].DriverType == "Primary") {
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
    var panel = '<div data-role="panel" id="mypanel"  data-position="right" data-display="reveal" data-theme="a" class="ui-panel ui-panel-position-right ui-panel-display-reveal ui-body-a ui-panel-animate">'
        + '<div class="ui-panel-inner">'
        + '<ul data-role="listview">'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="signMeTab" data-theme="a">שבץ אותי</a></li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="myRidesTab" data-theme="a">הנסיעות שלי</a> </li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="preferencesTab" href="#myPreferences" data-theme="a">העדפות</a> </li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="loginAgainTab" href="#" data-theme="a">חזור לדף הראשי</a> </li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="NotifyTab" data-theme="a">דיווחים</a> </li>'
        //+ '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="trackRidesTab" href="#trackRides" data-theme="b">מעקב הסעות</a> </li>'
        //+ '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-arrow-l"><a class="ui-btn" id="auctionTab" href="#auction" data-theme="b">מכרז</a> </li>'
        + '<li style="display:block;" data-icon="false" class="ui-btn-icon-left ui-icon-delete">'
        + '<a href="#" data-rel="close">סגירת התפריט</a>'
        + '</li>'
        + '</ul>'
        + '</div>'
        + '</div>';
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();

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
    $("#rakazBTNS").hide();

    if (userInfo.TypeVol == "רכז" || userInfo.TypeVol == 'מנהל') {
        $("#rakazBTNS").show();

        request = {
            active: true
        }
        getVolunteers(request, getVolunteersSCB, getVolunteersECB);

        request = {
            active: true
        }
        getPatients(request, getPatientsSCB, getPatientsECB);
    }

});

$(document).on('pageshow', '#loginPreference', function () {
    if (hasCloseRide()) {
        closeRide = $.parseJSON(localStorage.closeRide);
        var rideDate = new Date(closeRide.DateTime);
        var isSameDay = rideDate.getDay() == (new Date()).getDay() ? 'היום' : 'מחר';
        var alertRide = 'המערכת זיהתה שיש לך ' + isSameDay + ' נסיעה מ' + closeRide.StartPoint + ' ל' + closeRide.EndPoint + ' בשעה ' + rideDate.getHours() + ':' + (rideDate.getMinutes() < 10 ? '0' + rideDate.getMinutes() : rideDate.getMinutes()) + '. האם תרצה לדווח סטטוס?';

        popupDialog('הודעה', alertRide, '#status', true, null);
    }
});

function getPatientsSCB(data) {

    var results = $.parseJSON(data.d);
    Patients = results;

}

function getPatientsECB(e) {
    popupDialog('שגיאה', e.responseJSON.Message, '#loginLogo', false, null);
}


function getVolunteersSCB(data) {

    var results = $.parseJSON(data.d);
    volenteers = results;

}

function getVolunteersECB(e) {
    popupDialog('שגיאה', e.responseJSON.Message, '#loginLogo', false, null);
}


$(document).on('pageshow', '#rakazLogin', function () {

    $("#volenteersPH").empty();

    for (var i = 0; i < volenteers.length; i++) {

        $("#volenteersPH").append('<li><a class="ui-btn ui-btn-icon-left ui-icon-carat-l" href="#" id="' + volenteers[i].CellPhone.toString() + '" >' + volenteers[i].DisplayName + '</a></li>');
    }

    $("#volenteersPH").listview('refresh');
});


$(document).on('pageshow', '#allVolunteers', function () {

    $("#allVolunteersPH").empty();

    for (var i = 0; i < volenteers.length; i++) {

        $("#allVolunteersPH").append('<li><a class="ui-btn ui-btn-icon-left ui-icon-phone" href="#" id="' + volenteers[i].CellPhone.toString() + '" >' + volenteers[i].DisplayName + '</a></li>');
    }

    $("#allVolunteersPH").listview('refresh');
});


$(document).on('pageshow', '#allPatients', function () {

    $("#allPatientsPH").empty();

    for (var i = 0; i < Patients.length; i++) {

        $("#allPatientsPH").append('<li><a class="ui-btn ui-btn-icon-left ui-icon-phone" href="#" id="' + Patients[i].CellPhone.toString() + '" >' + Patients[i].DisplayName + '</a></li>');
    }

    $("#allPatientsPH").listview('refresh');
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

});


function checkUserPN(cellphone) {

    if (localStorage.RegId == null) {
        localStorage.RegId = "errorKey"
    }

    var request = {
        mobile: cellphone,
        regId: localStorage.RegId
    }
    checkUser(request, checkUserSuccessCB, checkUserErrorCB);
}

function manualLogin() {

    setTimeout(function () {
        localStorage.removeItem('cellphone');
        $.mobile.pageContainer.pagecontainer("change", "#loginFailed");
    }, 500);
}


function checkUserSuccessCB(results) {

    var results = $.parseJSON(results.d);

    //unassaigned user

    if (results.Id == 0) {
        //send request for volunteer
        setTimeout(function () {
            localStorage.removeItem('cellphone');
            popupDialog('שגיאה', 'הודעת שגיאה - מספר הטלפון אינו ידוע, אנא בדקו ונסו בשנית', '#loginFailed', false, null);
        }, 100);
        return;
    }


    userInfo = results;
    localStorage.userId = userInfo.Id;
    //get personal info: name, photo, address etc.
    //get preferences routes and seats
    getPrefs();


    //original identity
    if (localStorage.cellphone == userInfo.CellPhone) {
        localStorage.userType = userInfo.TypeVol;
    }

    //get all rides
    loginThread = true;
    getRidesList();
}

function hasCloseRide() {

    if (myRides != null) {
        for (var i = 0; i < myRides.length; i++) {
            if ((new Date(myRides[i].DateTime))/*.addHours(12)*/ >= (new Date()) && myRides[i].DriverType == 'Primary') {
                localStorage.closeRide = JSON.stringify(myRides[i]);
                return true;
            }
        }
        return false;
    }
    return false;
}

function getPrefs() {

    //get seats
    localStorage.availableSeats = userInfo.AvailableSeats;

    //get areas
    var area = {};
    if (userInfo.PrefArea.includes('מרכז')) {
        area.center = true;
    }
    if (userInfo.PrefArea.includes('צפון')) {
        area.north = true;
    }
    if (userInfo.PrefArea.includes('דרום')) {
        area.south = true;
    }

    var dbRoutes = [];
    dbRoutes.push(area);

    //get locations
    for (var i = 0; i < userInfo.PrefLocation.length; i++) {
        dbRoutes.push(userInfo.PrefLocation[i]);
    }

    localStorage.routes = JSON.stringify(dbRoutes);

    var times = [];
    //get times
    for (var i = 0; i < userInfo.PrefTime.length; i++) {

        var time = "";

        if (userInfo.PrefTime[i][1] == "אחהצ") {
            time = "evening";
        }
        else {
            time = "morning";
        }

        switch (userInfo.PrefTime[i][0]) {
            case "ראשון":
                time += "A";
                break;
            case "שני":
                time += "B";
                break;
            case "שלישי":
                time += "C";
                break;
            case "רביעי":
                time += "D";
                break;
            case "חמישי":
                time += "E";
                break;
            case "שישי":
                time += "F";
                break;
            case "שבת":
                time += "G";
                break;
        }

        times.push(time);
    }

    localStorage.times = JSON.stringify(times);
}

function checkUserErrorCB(e) {
    localStorage.removeItem('cellphone');
    popupDialog('שגיאה', e.responseJSON.Message, '#loginFailed', false, null);
}


function showSavedSeats() {
    var seats = localStorage.availableSeats;
    $('#mySeats').val(seats);
    $('#mySeats').selectmenu('refresh');
}



$(document).on('pagebeforeshow', '#myPreferences', function () {
    autoClicks = true;

    $('#prefTabs li').show();
    var checkboxes = $('#myPreferences .ui-checkbox label');

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes.eq(i)[0].classList.contains("ui-checkbox-on")) {

            checkboxes.eq(i).click();
        }
    }

    if (localStorage.routes == null || localStorage.routes == "[{}]") {
        //do nothing, wait for user to change preferences (routes)

        for (var i = 0; i < 6; i++) {

            $('.morning .ui-checkbox label').eq(i + 2).click();
            $('.evening .ui-checkbox label').eq(i + 2).click();
        }

        for (var i = 0; i < $('#starts .ui-checkbox label, #ends .ui-checkbox label').length; i++) {

            $('#starts .ui-checkbox label, #ends .ui-checkbox label').eq(i).click();
        }

        $('#prefTabs li').hide();
        $('a#menuBTN').hide()
        $('#continueBTN').show();

        $('#continueBTN').on('click', function () {

            if ($('#area .ui-checkbox-on').length == 0) {
                popupDialog('שגיאה', 'אנא בחר איזור אחד לפחות', null, false, null);
                //show dialog
                return;
            }

            if ($('#prefTabs a').eq(2).hasClass('ui-btn-active')) {

                var actives = $('#starts .ui-checkbox-on,#ends .ui-checkbox-on');
                if (actives.length == 0) {
                    popupDialog('שגיאה', "אנא בחר נקודות מוצא ויעד ורק לאחר מכן לחץ על המשך", null, false, null);
                    //show dialog
                    return;
                }

                $('#prefTabs a').eq(1).click().addClass('ui-btn-active');
                $('#prefTabs a').eq(2).removeClass('ui-btn-active');
            }
            else if ($('#prefTabs a').eq(1).hasClass('ui-btn-active')) {

                $('#prefTabs a').eq(0).click().addClass('ui-btn-active');
                $('#prefTabs a').eq(1).removeClass('ui-btn-active');

                $('#continueBTN')[0].innerHTML = "שמור";
            }
            else {
                //save all and end first time login

                saveRoutes();
                saveTimes();
                saveSeats();

                //get all rides
                getRidesList();

                //getMyRides
                getMyRidesList();

                $('a#menuBTN').show();

                setPrefs();
                autoClicks = false;
            }

        });
    }
    else {
        //user have saved routes
        $('#continueBTN').hide();

        var routes = $.parseJSON(localStorage.routes);

        if (routes[0].south && !$('#southArea').is(':checked')) {

            $('#myPreferences #area .ui-checkbox label').eq(0).click();
            $('.south').show();
        }
        if (routes[0].center && !$('#centerArea').is(':checked')) {

            $('#myPreferences #area .ui-checkbox label').eq(1).click();
            $('.center').show();
        }
        if (routes[0].north && !$('#northArea').is(':checked')) {

            $('#myPreferences #area .ui-checkbox label').eq(2).click();
            $('.north').show();
        }


        showSavedRoutes(routes);


        var times = $.parseJSON(localStorage.times);
        showSavedTimes(times);

        showSavedSeats();

        setTimeout(function () {
            autoClicks = false;
        }, 500);
    }
});


function autoSavePref(el) {

    if (autoClicks) return;

    setTimeout(function () {
        justSavePrefs = true;
        saveAllPrefs();
    }, 100);
}


function goMenu(id) {
    if (id == 'signMeTab') {
        $.mobile.pageContainer.pagecontainer("change", "#signMe");
    }
    else if (id == 'myRidesTab') {
        $.mobile.pageContainer.pagecontainer("change", "#myRides");
    }
    else if (id == 'loginAgainTab') {
        var cellphone = localStorage.cellphone;
        checkUserPN(cellphone);
    }
    else if (id == 'auctionTab') {
        $.mobile.pageContainer.pagecontainer("change", "#auction");
    }
    else if (id == 'trackRidesTab') {
        $.mobile.pageContainer.pagecontainer("change", "#trackRides");
    }
    else if (id == 'NotifyTab') {
        $.mobile.pageContainer.pagecontainer("change", "#status");
    }
}



function saveAllPrefs() {
    //local
    saveRoutes();
    saveTimes();
    saveSeats();

    //DB
    tempID = this.id;
    setPrefs();
}


function setPrefs() {

    var routes = JSON.parse(localStorage.routes);
    var locations = [];

    for (var i = 1; i < routes.length; i++) {
        locations.push(routes[i]);
    }

    var areas = [];
    if (routes[0].north) {
        areas.push("צפון");
    }
    if (routes[0].center) {
        areas.push("מרכז");
    }
    if (routes[0].south) {
        areas.push("דרום");
    }

    var times = JSON.parse(localStorage.times);

    var request = {
        Id: parseInt(localStorage.userId),
        PrefLocation: locations,
        PrefArea: areas,
        PrefTime: times,
        AvailableSeats: parseInt(localStorage.availableSeats)
    }

    setVolunteerPrefs(request, setVolunteerPrefsSCB, setVolunteerPrefsECB);

}


function setVolunteerPrefsSCB(data) {

    if (typeof justSavePrefs !== 'undefined' && justSavePrefs) {
        justSavePrefs = false;
        return;
    }


    if (typeof tempID !== 'undefined') {
        goMenu(tempID);
    }
    else {
        //first connect
        $.mobile.pageContainer.pagecontainer("change", "#signMe");
    }
}

function setVolunteerPrefsECB(e) {
    popupDialog('שגיאה', e.responseJSON.Message, '#myPreferences', false, null);
}


$(document).on('pageshow', '#myPreferences', function () {

    showAreas();

    if (!isTabActive()) {

        $('#prefTabs a').eq(2).click().addClass('ui-btn-active');
    }
});

function isTabActive() {
    for (var i = 0; i < $('#prefTabs a').length; i++) {
        if ($('#prefTabs a').eq(i).hasClass('ui-btn-active')) {
            return true;
        }
    }
    return false;
}

function saveTimes() {
    timesArr = [];

    var actives = $('#zmanim .ui-checkbox-on');

    for (var i = 0; i < actives.length; i++) {
        timesArr.push(actives.eq(i)[0].htmlFor);
    }

    //save routesArr to DB
    localStorage.times = JSON.stringify(timesArr);
}


function saveSeats() {
    //save seats
    var seats = $('#mySeats').val();

    userInfo.availableSeats = seats;
    localStorage.availableSeats = seats;
}

function saveRoutes() {
    routesArr = [];

    var area = {};
    area.south = $('#southArea').is(':checked');
    area.center = $('#centerArea').is(':checked');
    area.north = $('#northArea').is(':checked');

    routesArr.push(area);

    var actives = $('#starts .ui-checkbox-on , #ends  .ui-checkbox-on');

    for (var i = 0; i < actives.length; i++) {

        for (var j = 0; j < actives[i].parentElement.parentElement.classList.length; j++) {
            var areaId = actives[i].parentElement.parentElement.classList[j];
            if (area[areaId]) {
                var a = actives[i].innerHTML;

                if (!routesArr.includes(a)) {
                    routesArr.push(a);
                }
            }
        }

    }

    //save routesArr to DB
    localStorage.routes = JSON.stringify(routesArr);
}


function showSavedTimes(times) {

    var checkboxes = $('#zmanim .ui-checkbox label');

    for (var r = 0; r < times.length; r++) {

        for (var i = 0; i < checkboxes.length; i++) {

            var point = checkboxes.eq(i)[0].htmlFor;

            if (point == times[r]) {

                if (checkboxes.eq(i)[0].classList.contains("ui-checkbox-off")) {


                    checkboxes.eq(i).click();
                }

            }
        }

    }
}


function showSavedRoutes(routes) {

    var checkboxes = $('#starts .ui-checkbox label,#ends .ui-checkbox label');

    for (var r = 1; r < routes.length; r++) {

        for (var i = 0; i < checkboxes.length; i++) {

            var point = checkboxes.eq(i)[0].innerHTML;

            if (point == routes[r]) {

                if (checkboxes.eq(i)[0].classList.contains("ui-checkbox-off")) {

                    checkboxes.eq(i).click();
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


function onDeviceReady() {

    if (typeof PushNotification !== 'undefined') {

        var push = PushNotification.init({
            android: {
                senderID: "148075927844",
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

        //-----------------------------------------------------------------------
        // triggred by the notification server once the registration is completed
        //-----------------------------------------------------------------------
        push.on('registration', function (data) {
            // send the registration id to the server and save it in the DB
            // send also the userID
            localStorage.RegId = data.registrationId;

            login();

        });

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
            popupDialog('שגיאה', e.responseJSON.Message, '#loginLogo', false, null);
        });
    }
    else {
        login();
    }
}

//------------------------------------------------
// When the user is in the application
//------------------------------------------------
function handleForeground(data) {
    //
    alertPushMsg(data);
}

//-------------------------------------------------
// When the application runs in the background
//-------------------------------------------------
function handleBackground(data) {
    //
    alertPushMsg(data);
}

//-------------------------------------------------
// When the application doesn't rub
//-------------------------------------------------
function handleColdStart(data) {
    //
    alertPushMsg(data);
}


function alertPushMsg(data) {

    //data.message;
    //data.title;
    //data.additionalData.coldstart;
    //data.additionalData.foreground;
    //data.additionalData.status;
    //data.additionalData.rideID;
    //data.additionalData.msgID;


    //decide kind of messege

    var message = '';
    for (x in data) {
        //message += "data." + x + " :" + data[x] + " , ";

        if (x == "additionalData") {
            for (y in data.additionalData) {
                //message += "data.additionalData." + y + " :" + data.additionalData[y] + " , ";
            }
        }
    }

    userIDForPush_ = parseInt(localStorage.userId);
    msgIDForPush_ = parseInt(data.additionalData.msgID);

    popupDialog(data.title, data.message, null, true, 'sendPushReaction');
}

function confirmPushSCB(data) {

}

function confirmPushECB(e) {

}


if (window.location.href.toString().indexOf('http') == -1) {

    document.addEventListener("deviceready", onDeviceReady, false);

    //ignore backbutton
    document.addEventListener("backbutton", onBackKeyDown, false);
    function onBackKeyDown() {
        return;
    }
}
else {
    if (window.location.href.toString().indexOf('index.html') != -1) {
        login();
    }

}

function login() {
    if (localStorage.cellphone == null) {

        manualLogin();

    }
    else {
        var cellphone = localStorage.cellphone;
        checkUserPN(cellphone);
    }
}


$(document).ajaxStart(function () {
    $("body").addClass("loading");
});

$(document).ajaxStop(function () {
    $("body").removeClass("loading");
});


function sendProblem(element) {
    problem = $(element).children().html()
    elemProblemForSend = $(element).parent();
    if (problem == 'דווח') {
        elemProblemForSend = $('.problemName').eq(2);
        problem = $('#problem .accordion').val();
    };

    popupDialog('הודעת אישור', 'האם אתה מאשר את שליחת דיווח הסטטוס: ' + problem + '?', null, true, 'sendProblem');
}


$(document).on('pagebeforeshow', '#status', function () {

    if ($('.statusContent').html() != "") $('.statusContent').empty();

    var str = "";
    var statusID = 0;

    for (var i = 0; i < userInfo.Statusim.length; i++) {
        if (closeRide.Status == userInfo.Statusim[i].Name) {
            statusID = userInfo.Statusim[i].Id;
            break;
        }
    }

    userInfo.Statusim.sort(function (a, b) {
        return a.Id.toString().localeCompare(b.Id.toString());
    });
    for (var i = 0; i < userInfo.Statusim.length; i++) {
        var _status = userInfo.Statusim[i];
        var active = (typeof closeRide !== 'undefined') ? ((statusID >= _status.Id) ? ' statusActive' : '') : '';
        str +=
            '<div class="statusItem">' +
            '      <div class="statusNum' + active + '">' +
            '          <span>' + (i + 1) + '</span>' +
            '      </div>' +
            '      <div class="statusName' + active + '">' +
            '       <div class="statusButton" id="status' + _status.Id + '">' +
            '              <span>' + _status.Name + '</span>' +
            '       </div>' +
            '       </div>' +
            '   </div>' +
            '   <hr>';
    }
    $('.statusContent').html(str);
    $(document).on('click', '.statusButton', function () {

        if (!$(this).parent().hasClass('statusActive')) {

            if ($('.statusName.statusActive').length > 0) {
                for (var i = 0; i < $('.statusName.statusActive').length; i++) {
                    var thisId = parseInt($(this).attr('id').toString().replace('status', ''));
                    var thatId = parseInt($('.statusName.statusActive').eq(i).children().attr('id').toString().replace('status', ''));
                    if (thisId == thatId) continue;
                    if (thisId < thatId) return;
                }
            }

            statusForSend = $(this).children().html();
            elemStatusForSend = this;
            popupDialog('הודעת אישור', 'האם אתה מאשר את שליחת דיווח הסטטוס: ' + statusForSend + '?', null, true, 'sendStatus');
        }
    });
});


function sendStatus(_status, _rideId) {
    //send status to db
    var request = {
        rideId: _rideId,
        status: _status
    }
    setStatus(request, setStatusSCB, setStatusECB);
}

function setStatusSCB() {
    if (window.location.href.toString().indexOf('problem') != -1) {
        popupDialog('הודעת אישור', 'שליחת הבעיה התבצעה בהצלחה.', '#status', true, null);
    }
    else {
        popupDialog('הודעת אישור', 'עדכון סטטוס הנסיעה התבצע בהצלחה.', null, true, null);
    }
}

function setStatusECB() {

}


$(document).ready(function () {

    //keyup/click/focusout events, refreshing the rides when jquery list filter is on action
    $(document).on('keyup', '#signMe input[data-type="search"]', function () {

        showInput = true;
        printRides(rides);

    });
    $(document).on('change', '#signMe .ui-filterable input', function () {
        showInput = true;
        printRides(rides);

    });

    $("#closeInfoBTN").on('click', function () {
        $('#doneTAB').addClass('ui-btn-active');
        printMyRides(myRides);
    });

    $(document).on('click', '#doneTAB,#planTAB', function () {

        if (this.id == "planTAB") {
            $('#plusSignMe').show();
        }
        else {
            $('#plusSignMe').hide();
        }

        printMyRides(myRides);
    });

    //click on morningTAB or afternoonTAB
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

    //after signing to ride and we suggest a suited ride, volenteer click ok
    $("#suggestOkBTN").on("click", function () {

        CombineRideRidePat(suggestedRide.Id, parseInt(localStorage.lastRideId));

    });

    //on sign me to ride click ok
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

        //handle case that rise if already taken


    });

    $('#showAllRidesBTN').on('click', function () {

        if ($('#showAllRidesBTN').is(':checked')) {
            showAll = true;

            $('#signMe .ui-filterable input').val("");

            if ($('#shiftDDL').val() == 'בוקר') {
                $('#morningTAB').removeClass('ui-btn-active').css("background-color", "");

            }
            else if ($('#shiftDDL').val() == 'אחהצ') {
                $('#afternoonTAB').removeClass('ui-btn-active').css("background-color", "");
            }

            $('#shiftDDL').val("משמרת");
        }
        else {
            showAll = undefined;
        }
        printRides(rides);
    });

    //handle the filter events
    $('#signMe fieldset select').change(function () {

        printRides(rides);
    });

    $(document.body).on('click', '#myRides li', function (event) {

        if (this.id == "") {
            return;
        }

        if (event.target.classList.contains('deleteokBTN')) {
            var id_ = parseInt($(this)[0].id.replace("popDEL", "").replace("popINFO", ""));
            delInfo(parseInt(id_));

            if (myRideHasMultipulePats(id_)) {
                $.mobile.pageContainer.pagecontainer("change", "#deleteOptions");

            }
            else {
                $.mobile.pageContainer.pagecontainer("change", "#deleteConfirm");
            }
            return;
        }

        if (this.id.includes("INFO")) {
            var id_ = this.id.replace("popINFO", "");
            delInfo(parseInt(id_));

            $.mobile.pageContainer.pagecontainer("change", "#infoPastRide");
        }
        else {
            var id_ = this.id.replace("popDEL", "");
            delInfo(parseInt(id_));

            $.mobile.pageContainer.pagecontainer("change", "#deleteMePage");
        }

    });

    $(document.body).on('click', '#ridesPH p.backup, #ridesPH p.primary ', function (event) {

        var id = parseInt(this.nextSibling.name);
        var ride = getRideById(id);

        printInfo(ride);

        $.mobile.pageContainer.pagecontainer("change", "#infoPage");
    });

    //status and problemsr
    $(document).on('click', '.problemButton.problemKeyboard', function () {
        $('#problem #accordionMaster').removeClass('ui-screen-hidden');
    });

    $(document).on('click', '.problemButton', function () {
        if (this.className.includes('problemKeyboard')) return;
        if ($(this).parent().hasClass('statusActive')) return;
        $('#problem #accordionMaster').addClass('ui-screen-hidden');

        sendProblem(this);
    });

    $(document).on('click', '.sendButton', function () {

        if ($('#problem textarea').val() == '') {
            popupDialog('שגיאה', 'לא ניתן לשלוח הודעה ריקה', null, false, null);
            return;
        }

        sendProblem(this);
    });


    //remember to add this event to every new page
    $('#signMeTab , #myRidesTab , #loginAgainTab, #auctionTab, #trackRidesTab, #NotifyTab').on('click', function () {

        if (window.location.href.toString().indexOf('myPreferences') == -1) {

            if ($(this).attr('id') == 'NotifyTab' && !hasCloseRide()) {
                popupDialog('שגיאה', 'אין לך נסיעות קרובות הדורשות דיווח.', null, false, null);
                //show dialog
                return;
            }

            goMenu(this.id);
            return;
        }

        var actives = $('#starts .ui-checkbox-on,#ends .ui-checkbox-on');
        if (actives.length == 0) {
            popupDialog('שגיאה', "אנא בחר נקודות מוצא ויעד בקווי הסעה", null, false, null);
            //show dialog
            $('#mypanel').panel("close");
            return;
        }

        if ($('#area .ui-checkbox-on').length == 0) {
            popupDialog('שגיאה', "אנא בחר איזורים", null, false, null);
            //show dialog
            $('#mypanel').panel("close");
            return;
        }

        //local
        saveRoutes();
        saveTimes();
        saveSeats();

        //get all rides
        getRidesList();

        //getMyRides
        getMyRidesList();

        //DB
        tempID = this.id;
        setPrefs();
    });

    $('a#menuBTN').on('click', function () {
        if (localStorage.userType == 'רכז' || localStorage.userType == 'מנהל') {
            $('li #loginAgainTab,li #auctionTab,li #trackRidesTab').parent().show()
        }
        else {
            $('li #loginAgainTab,li #auctionTab,li #trackRidesTab').parent().hide()
        }
    });

    $('#kavim input, #zmanim input').on('click', function () {

        autoSavePref();
    });
    $('#other select').on('change', function () {

        autoSavePref();
    });


    $('#volenteersPH').on('click', 'a', function () {
        checkUserPN(this.id);
    });

    $('#allVolunteersPH').on('click', 'a', function () {
        window.open("tel:" + this.id);
    });

    $('#allPatientsPH').on('click', 'a', function () {
        window.open("tel:" + this.id);
    });

    $("#nextPageBTN").on('click', function () {

        if (checkPlanRides(myRides)) {
            $.mobile.pageContainer.pagecontainer("change", "#myRides");
        }
        else {
            $.mobile.pageContainer.pagecontainer("change", "#signMe");
        }
    });

    $('#userPnBTN').on('click', function () {

        var cellphone = $('#userPnTB').val().toString();
        var temp = cellphone.substring(0, 3) + "-" + cellphone.substring(3, 10);
        cellphone = temp;
        localStorage.cellphone = cellphone;

        if (localStorage.RegId == null) {
            localStorage.RegId = "errorKey"
        }

        var request = {
            mobile: cellphone,
            regId: localStorage.RegId
        }
        checkUser(request, checkUserSuccessCB, checkUserErrorCB);
    });

    $('#prefTabs a').on('click', function () {
        localStorage.lastPrefTab = this.id;
    });

    $('#mypanel').on('panelclose', function () {
        var selector = "#" + localStorage.lastPrefTab;
        $(selector).click();
    });

    $('#area input').on('change', function () {

        showAreas();

    });

    $("#popupDialog").popup();
    $("#cancelDialogBTN").on('click', function () {
        $("#popupDialog").popup('close');
        otherDialogFunction('Cancel');
    });
    $("#confirmDialogBTN").on('click', function () {
        $("#popupDialog").popup('close');
        if (isConfirmDialog) {
            if (redirectUrlFromDialog != null) {
                if (redirectUrlFromDialog == '#loginLogo') {
                    window.location.replace('index.html');
                }
                else {
                    $.mobile.pageContainer.pagecontainer("change", redirectUrlFromDialog);
                }
            }
        }
        redirectUrlFromDialog = null;
        otherDialogFunction('Confirm');
    });
});

function otherDialogFunction(reaction_) {
    if (typeof dialogFunction !== 'undefined' && dialogFunction != null) {
        switch (dialogFunction) {
            case 'sendProblem':
                if (reaction_ == 'Cancel') {
                    return;
                }
                $(elemProblemForSend).addClass('statusActive');
                $('#problem .accordion').empty();
                var rideID = closeRide.rideId;
                sendStatus(problem, rideID);
                break;
            case 'sendStatus':
                if (reaction_ == 'Cancel') {
                    return;
                }
                $(elemStatusForSend).parent().addClass('statusActive');
                $(elemStatusForSend).parent().siblings().eq(0).addClass('statusActive');
                var rideID = closeRide.rideId;
                sendStatus(statusForSend, rideID);
                break;
            case 'sendPushReaction':
                var request = {
                    userId: userIDForPush_,
                    msgId: msgIDForPush_,
                    status: reaction_
                };
                confirmPush(request, confirmPushSCB, confirmPushECB);
                break;
            default:
                break;
        }
    }
}



function popupDialog(title, content, redirectUrl, isConfirm, dialogFunction_) {

    redirectUrlFromDialog = redirectUrl;
    isConfirmDialog = isConfirm;
    dialogFunction = dialogFunction_;

    if (isConfirmDialog) $('#cancelDialogBTN').show();
    else $('#cancelDialogBTN').hide();


    $('#popupContent').empty();
    $('#popupTitle').empty();

    $('#popupContent').html(content);
    $('#popupTitle').html(title);

    $("#popupDialog").popup('open');
}
