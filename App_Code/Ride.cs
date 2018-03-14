using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Ride
/// </summary>
public class Ride
{
    public Ride()
    {
        //
        // TODO: Add constructor logic here
        //

    }

    string id;
    public string Id { get; set; }

    DateTime dateTime;
    public DateTime DateTime { get; set; }

    string shift;
    public string Shift { get; set; }

    string area;
    public string Area { get; set; }
    
    string startPoint;
    public string StartPoint { get; set; }

    string endPoint;
    public string EndPoint { get; set; }

    string person;
    public string Person { get; set; }

    List<string> melave;
    public List<string> Melave { get; set; }

    string driverID;
    public string DriverID { get; set; }

    bool wheelchair;
    public string Wheelchair { get; set; }

}