﻿using log4net;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Xml.Linq;

// <summary>
/// Summary description for Messege
/// </summary>

public class Message
{
    private static readonly ILog Log =
            LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
    public Message()
    {
        //
        // TODO: Add constructor logic here
        //

    }

    public int insertMsg(int parentID, string type, string title, string msgContent, int ridePatID, DateTime dateTime, int userID, string userNotes, bool isPush, bool isMail, bool isWhatsapp)
    {

        DbService db = new DbService();
        SqlCommand cmd = new SqlCommand();
        cmd.CommandType = CommandType.Text;
        SqlParameter[] cmdParams = new SqlParameter[11];
        cmdParams[0] = cmd.Parameters.AddWithValue("@ParentID", parentID);
        cmdParams[1] = cmd.Parameters.AddWithValue("@Type", type);
        cmdParams[2] = cmd.Parameters.AddWithValue("@Title", title);
        cmdParams[3] = cmd.Parameters.AddWithValue("@MsgContent", msgContent);
        cmdParams[4] = cmd.Parameters.AddWithValue("@RidePatID", ridePatID);
        cmdParams[5] = cmd.Parameters.AddWithValue("@DateTime", dateTime);
        cmdParams[6] = cmd.Parameters.AddWithValue("@UserID", userID);
        cmdParams[7] = cmd.Parameters.AddWithValue("@UserNotes", userNotes);
        cmdParams[8] = cmd.Parameters.AddWithValue("@isPush", isPush);
        cmdParams[9] = cmd.Parameters.AddWithValue("@isMail", isMail);
        cmdParams[10] = cmd.Parameters.AddWithValue("@isWhatsapp", isWhatsapp);
        string query = "insert into [Messages] OUTPUT inserted.MsgID values (@ParentID,@Type,@Title,@MsgContent,@RidePatID,@DateTime,@UserID,@UserNotes,@isPush,@isMail,@isWhatsapp)";

        try
        {
            return int.Parse(db.GetObjectScalarByQuery(query, cmd.CommandType, cmdParams).ToString());
        }
        catch (Exception e)
        {
            //add to log
            throw e;
        }
    }

    public void globalMessage(string message, string title)
    {
        //insert msg to db
        int msgID = insertMsg(0, "Global", title, message, 0, DateTime.Now, 0, "", true, false, false);

        //get volunteers
        Volunteer v = new Volunteer();
        List<Volunteer> volunteersList = v.getVolunteersList(true);
        var data = new JObject();

        /////////////////////////// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //TODO DELETE ONLY FOR TEST !!  !!  !!  !!  !!  !!  !!  !!  !!  !!
        /////////////////////////// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        var test = volunteersList.Find(x => x.Id == 14534);
        volunteersList = new List<Volunteer>();
        volunteersList.Add(test);

        foreach (Volunteer V in volunteersList)
        {
            if (V.Device == "iOS")
            {
                //PUSH IOS
                data = new JObject();
                var notification = new JObject();
                notification.Add("title", title);
                notification.Add("body", message);
                data = new JObject();
                data.Add("msgID", msgID);
                data.Add("content-available", 1);
                //send push
                myPushNot pushIOS = new myPushNot();
                pushIOS.RunPushNotificationOne(V, data, notification);
            }
            else
            {
                data = new JObject();
                data.Add("message", message);
                data.Add("title", title);
                data.Add("msgID", msgID);
                data.Add("content-available", 1);
                //send push
                myPushNot pushANDROID = new myPushNot();
                pushANDROID.RunPushNotificationOne(V, data, null);

            }
        }      
    }


    public void cancelRide(int ridePatID, Volunteer user)
    {
        //get ride details and generate msg
        RidePat rp = new RidePat();
        var abc = rp.GetRidePat(ridePatID);

        TimeZoneInfo sourceTimeZone = TimeZoneInfo.FindSystemTimeZoneById("UTC");
        TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Israel Standard Time");
        var converted = TimeZoneInfo.ConvertTime(abc.Date, sourceTimeZone, targetTimeZone);
        string time = converted.ToShortTimeString();
        if (time == "22:14")
        {

            time = "אחה\"צ";
        }


        var msg = "בוטלה נסיעה מ" + abc.Origin.Name + " ל" + abc.Destination.Name + " בתאריך " + abc.Date.ToShortDateString() + ", בשעה " + time;
        //insert msg to db
        int msgID = insertMsg(0, "Cancel", "נסיעה בוטלה", msg, ridePatID, DateTime.Now, user.Id, "", true, false, false);

        Volunteer V = new Volunteer();
        string device = V.getDeviceByID(user.Id);
        var data = new JObject();


        if (device == "iOS")
        {
            data = new JObject();
            //PUSH IOS
            var notification = new JObject();
            notification.Add("title", "נסיעה בוטלה");
            notification.Add("body", msg);
            data.Add("rideID", ridePatID);
            data.Add("status", "Canceled");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushIOS = new myPushNot();
            pushIOS.RunPushNotificationOne(user, data, notification);
        }
        else
        {
            data = new JObject();
            //PUSH ANDROID
            data.Add("message", msg);
            data.Add("title", "נסיעה בוטלה");
            data.Add("rideID", ridePatID);
            data.Add("status", "Canceled");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushANDROID = new myPushNot();
            pushANDROID.RunPushNotificationOne(user, data, null);

        }
      
    }

    public void cancelOneRide(int ridePatID, Volunteer user)
    {
        //get ride details and generate msg
        RidePat rp = new RidePat();
        var abc = rp.GetRidePat(ridePatID);

        TimeZoneInfo sourceTimeZone = TimeZoneInfo.FindSystemTimeZoneById("UTC");
        TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Israel Standard Time");
        var converted = TimeZoneInfo.ConvertTime(abc.Date, sourceTimeZone, targetTimeZone);
        string time = converted.ToShortTimeString();
        if (time == "22:14")
        {

            time = "אחה\"צ";
        }


        var msg = " החולה " +abc.Pat.DisplayName+" ירד מההסעה מ"+ abc.Origin.Name + " ל" + abc.Destination.Name + " בתאריך " + abc.Date.ToShortDateString() + ", בשעה " + time + ". אבל הנסיעה מתקיימת כי יש עדיין חולים אחרים על הסעה זו.";
        //insert msg to db
        int msgID = insertMsg(0, "Cancel", "נסיעה בוטלה", msg, ridePatID, DateTime.Now, user.Id, "", true, false, false);

        Volunteer V = new Volunteer();
        string device = V.getDeviceByID(user.Id);
        var data = new JObject();


        if (device == "iOS")
        {
            data = new JObject();
            //PUSH IOS
            var notification = new JObject();
            notification.Add("title", "עדכון לגבי הסעה");
            notification.Add("body", msg);
            data.Add("rideID", ridePatID);
            data.Add("status", "Canceled");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushIOS = new myPushNot();
            pushIOS.RunPushNotificationOne(user, data, notification);
        }
        else
        {
            data = new JObject();
            //PUSH ANDROID
            data.Add("message", msg);
            data.Add("title", "עדכון לגבי הסעה");
            data.Add("rideID", ridePatID);
            data.Add("status", "Canceled");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushANDROID = new myPushNot();
            pushANDROID.RunPushNotificationOne(user, data, null);

        }

    }


    public void rideIsTomorrow(int ridePatID, Volunteer user)
    {
        //get ride details and generate msg
        RidePat rp = new RidePat();
        var abc = rp.GetRidePat(ridePatID);
        var msg = "מחר מתקיימת הסעה מ" + abc.Origin.Name + " ל" + abc.Destination.Name +  ", בשעה " + abc.Date.ToShortTimeString();

        if (abc.Date.ToShortTimeString() == "22:14") msg = "מחר מתקיימת הסעה מ" + abc.Origin.Name + " ל" + abc.Destination.Name + " אחה\"צ";
        //insert msg to db
        int msgID = insertMsg(0, "Reminder", "תזכורת", msg, ridePatID, DateTime.Now, user.Id, "", true, false, false);

        
        //PUSH ANDROID
        var data = new JObject();
        data.Add("message", msg);
        data.Add("title", "נסיעה קרובה");
        data.Add("rideID", ridePatID);
        data.Add("status", "Reminder");
        data.Add("msgID", msgID);
        data.Add("content-available", 1);
        //send push
        myPushNot pushANDROID = new myPushNot();
        pushANDROID.RunPushNotificationOne(user, data, null);

        //PUSH IOS
        var notification = new JObject();
        notification.Add("title", "נסיעה קרובה");
        notification.Add("body", msg);
        data = new JObject();
        data.Add("rideID", ridePatID);
        data.Add("status", "Reminder");
        data.Add("msgID", msgID);
        data.Add("content-available", 1);
        //send push
        myPushNot pushIOS = new myPushNot();
        pushIOS.RunPushNotificationOne(user, data, notification);
    }

    public void driverCanceledRide(int ridePatID, Volunteer user)
    {
        //get ride details and generate message
        RidePat rp = new RidePat();
        var abc = rp.GetRidePat(ridePatID);
        Volunteer coor = new Volunteer();
        coor = abc.Coordinator.getVolunteerByDisplayName(abc.Coordinator.DisplayName);

        var message = "";
        if (user.Gender == "מתנדב")
        {
            message = "הנהג " + user.FirstNameH + " " + user.LastNameH + " ביטל את הנסיעה מ" + abc.Origin.Name + " ל" + abc.Destination.Name + " עם החולה " + abc.Pat.DisplayName + " שמתקיימת בזמן הקרוב";

        }
        else
        {
            message = "הנהגת " + user.FirstNameH + " " + user.LastNameH + " ביטלה את הנסיעה מ" + abc.Origin.Name + " ל" + abc.Destination.Name + " עם החולה " + abc.Pat.DisplayName + " שמתקיימת בזמן הקרוב";
        }
        //insert msg to db
        int msgID = insertMsg(0, "Canceled by driver", "נסיעה בוטלה על ידי נהג\\ת", message, ridePatID, DateTime.Now, user.Id, "", true, false, false);


        var data = new JObject();

        if (coor.Device == "iOS")
        {
            //PUSH IOS
            data = new JObject();
            var notification = new JObject();
            notification.Add("title", "נסיעה בוטלה על ידי נהג\\ת");
            notification.Add("body", message);
            data.Add("rideID", ridePatID);
            data.Add("status", "Canceled");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushIOS = new myPushNot();
            pushIOS.RunPushNotificationOne(coor, data, notification);
        }
        else
        {
            //PUSH ANDROID
            data = new JObject();
            data.Add("message", message);
            data.Add("title", "נסיעה בוטלה על ידי נהג\\ת");
            data.Add("rideID", ridePatID);
            data.Add("status", "Canceled");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushANDROID = new myPushNot();
            pushANDROID.RunPushNotificationOne(coor, data, null);
        }
    }

    public void driverSignUpToCloseRide(int ridePatID, Volunteer user,bool isPrimary)
    {
        //get ride details and generate message
        RidePat rp = new RidePat();
        var abc = rp.GetRidePat(ridePatID);
        Volunteer coor = new Volunteer();
        coor = abc.Coordinator.getVolunteerByDisplayName(abc.Coordinator.DisplayName);
        string driverType = isPrimary ? "נהג ראשי" : "גיבוי";
        TimeZoneInfo sourceTimeZone = TimeZoneInfo.FindSystemTimeZoneById("UTC");
        TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Israel Standard Time");
        var converted = TimeZoneInfo.ConvertTime(abc.Date, sourceTimeZone, targetTimeZone);
        string time = converted.ToShortTimeString();
        if (time == "22:14")
        {

            time = "אחה\"צ";
        }

        var message = "";
        if (user.Gender == "מתנדב")
        {
            message = "הנהג " + user.FirstNameH + " " + user.LastNameH + " נרשם להסעה מ" + abc.Origin.Name + " ל" + abc.Destination.Name + " עם החולה " + abc.Pat.DisplayName + " כ" + driverType+" בתאריך " + abc.Date.ToShortDateString() + " ושעה "+ time+".";
        }
        else
        {
            message = "הנהגת " + user.FirstNameH + " " + user.LastNameH + " נרשמה להסעה מ" + abc.Origin.Name + " ל" + abc.Destination.Name + " עם החולה " + abc.Pat.DisplayName + " כ" + driverType + " בתאריך " + abc.Date.ToShortDateString() + " ושעה " + time + ".";
        }
        //insert msg to db
        int msgID = insertMsg(0, "sign by driver", "הרשמה להסעה קרובה", message, ridePatID, DateTime.Now, user.Id, "", true, false, false);


        var data = new JObject();

        if (coor.Device == "iOS")
        {
            //PUSH IOS
            data = new JObject();
            var notification = new JObject();
            notification.Add("title", "הרשמה להסעה קרובה");
            notification.Add("body", message);
            data.Add("rideID", ridePatID);
            data.Add("status", "SignUp");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushIOS = new myPushNot();
            pushIOS.RunPushNotificationOne(coor, data, notification);
        }
        else
        {
            //PUSH ANDROID
            data = new JObject();
            data.Add("message", message);
            data.Add("title", "הרשמה להסעה קרובה");
            data.Add("rideID", ridePatID);
            data.Add("status", "SignUp");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushANDROID = new myPushNot();
            pushANDROID.RunPushNotificationOne(coor, data, null);
        }
    }

    public void changeAnonymousPatient(int ridePatID, Volunteer user)
    {
        //get ride details and generate msg
        RidePat rp = new RidePat();
        var abc = rp.GetRidePat(ridePatID);

        TimeZoneInfo sourceTimeZone = TimeZoneInfo.FindSystemTimeZoneById("UTC");
        TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Israel Standard Time");
        var converted = TimeZoneInfo.ConvertTime(abc.Date, sourceTimeZone, targetTimeZone);
        string time = converted.ToShortTimeString();
        if (time == "22:14")
        {

            time = "אחה\"צ";
        }

        var msg =  abc.Pat.DisplayName + " הינו החולה בנסיעה מ" + "" + abc.Origin.Name + " ל" + abc.Destination.Name + " בתאריך " + abc.Date.ToShortDateString() + ", בשעה " + time;
        //insert msg to db
        int msgID = insertMsg(1, "Anonymous Patient changed", "עדכון שם חולה בהסעה", msg, ridePatID, DateTime.Now, user.Id, "", true, false, false);

        Volunteer V = new Volunteer();
        string device = V.getDeviceByID(user.Id);
        var data = new JObject();
        if (device == "iOS")
        {
            data = new JObject();
            //PUSH IOS
            var notification = new JObject();
            notification.Add("title", "עדכון שם חולה בהסעה");
            notification.Add("body", msg);
            data.Add("rideID", ridePatID);
            data.Add("status", "Anonymous Patient changed");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushIOS = new myPushNot();
            pushIOS.RunPushNotificationOne(user, data, notification);
        }
        else
        {
            data = new JObject();
            //PUSH ANDROID
            data.Add("message", msg);
            data.Add("title", "עדכון שם חולה בהסעה");
            data.Add("rideID", ridePatID);
            data.Add("status", "Anonymous Patient changed");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushANDROID = new myPushNot();
            pushANDROID.RunPushNotificationOne(user, data, null);
        }
    }

    public int backupToPrimary(int ridePatID)
    {
        string time = "";
        //get ride details and generate msg
        RidePat rp = new RidePat();
        rp = rp.GetRidePat(ridePatID);
        Volunteer v = new Volunteer();
        if (rp.Drivers[0].DriverType == "Secondary") v = rp.Drivers[0];
        else throw new Exception("The assigned driver is the primary driver for this ride");

        string device = v.getDeviceByID(v.Id);

        TimeZoneInfo sourceTimeZone = TimeZoneInfo.FindSystemTimeZoneById("UTC");
        TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Israel Standard Time");
        var converted = TimeZoneInfo.ConvertTime(rp.Date, sourceTimeZone, targetTimeZone);
        time = converted.ToShortTimeString();
        if (time == "22:14")
        {

            time = "אחה\"צ";
        }

        string msg = "האם ברצונך להחליף את הנהג הראשי בנסיעה מ" + rp.Origin.Name + " ל" + rp.Destination.Name + " בתאריך " + rp.Date.ToShortDateString() + ", בשעה " + time + "?";

        //insert msg to db
        int msgID = insertMsg(0, "BackupToPrimary","החלפת נהג ראשי", msg, ridePatID, DateTime.Now, v.Id, "", true, false, false);

        var data = new JObject();
        if (device == "iOS")
        {
            data = new JObject();
            //PUSH IOS
            var notification = new JObject();
            notification.Add("title", "החלפת נהג ראשי");
            notification.Add("body", msg);
            data.Add("rideID", ridePatID);
            data.Add("status", "PrimaryCanceled");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushIOS = new myPushNot();
            pushIOS.RunPushNotificationOne(v, data, notification);
        }
        else
        {
            data = new JObject();
            //PUSH ANDROID
            data.Add("message", msg);
            data.Add("title", "החלפת נהג ראשי");
            data.Add("rideID", ridePatID);
            data.Add("status", "PrimaryCanceled");
            data.Add("msgID", msgID);
            data.Add("content-available", 1);
            //send push
            myPushNot pushANDROID = new myPushNot();
            pushANDROID.RunPushNotificationOne(v, data, null);

        }

        return 1;
    }
}