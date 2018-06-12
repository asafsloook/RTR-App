using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using PushSharp.Core;
using PushSharp.Google;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using Newtonsoft.Json.Linq;

/// <summary>
/// Summary description for myPushNot
/// </summary>
public class myPushNot
{
    public myPushNot()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    private string Message;

    public string message
    {
        get { return Message; }
        set { Message = value; }
    }

    private string payloadString;

    public string PayloadString
    {
        get { return payloadString; }
        set { payloadString = value; }
    }

    private string Title;

    public string title
    {
        get { return Title; }
        set { Title = value; }
    }

    private string Msgcnt;

    public string msgcnt
    {
        get { return Msgcnt; }
        set { Msgcnt = value; }
    }

    private int Badge;

    public int badge
    {
        get { return Badge; }
        set { Badge = value; }
    }

    private string Sound;

    public string sound
    {
        get { return Sound; }
        set { Sound = "default"; }
    }

    private Payload payload1;

    public Payload data
    {
        get { return payload1; }
        set { payload1 = value; }
    }

    public myPushNot(string _message, string _title, string _msgcnt, int _badge, string _sound)
    {
        message = _message;
        title = _title;
        msgcnt = _msgcnt;
        badge = _badge;
        sound = _sound;
    }
    public void RunPushNotification(List<Volunteer> userList, myPushNot pushNot)
    {
        List<string> registrationIDs = new List<string>();

        foreach (var item in userList)
        {
            registrationIDs.Add(item.RegId);
        }

        
        //registrationIDs.Add("ejuGwkyol70:APA91bHbIzoj87i0YxrtEIt5kisubNBKK-eGGZYuUqdMZlL-2CyuJs_bWaPDiJrv0_MPzZq8tFGv6XNUxEYl1j0bRWRz7HS7L00H5wulc-TC6uZodEWjMfWIbpgWP1ZZ6dUz4ZkdayUz");


        var config = new GcmConfiguration("AIzaSyDQfirNkIkUKNy9B2irYhb8CV6pYpIVBOQ");
        var broker = new GcmServiceBroker(config);


        broker.OnNotificationFailed += (GcmNotification notification, AggregateException exception) => {
            exception.Handle(ex => {
                /*Ex handling*/

                return true;
            });
        };

        broker.OnNotificationSucceeded += (notification) => {
            Console.WriteLine("Notification Sent!");
        };
        broker.Start();
        string message = "";
        while (message != "quit")
        {
            broker.QueueNotification(new GcmNotification()
            {
                RegistrationIds = registrationIDs,
                Notification = JObject.Parse("{\"alert\":\"" + message + "\",\"badge\":7}")
            });
        }
        broker.Stop();
    }
    

}