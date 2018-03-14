using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Xml;
using System.Xml.Linq;
using System.Globalization;

/// <summary>
/// Summary description for ajaxWebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class ajaxWebService : System.Web.Services.WebService
{

    public ajaxWebService()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string GetRides(string test)
    {

        String xmlFile = Server.MapPath(".") + "/App_Data/Rides.xml";

        XmlReaderSettings xmlSettings = new XmlReaderSettings();
        xmlSettings.IgnoreWhitespace = true;
        xmlSettings.IgnoreComments = true;

        List<Ride> lp = new List<Ride>();

        using (XmlReader XmlRdr = XmlReader.Create(xmlFile, xmlSettings))
        {
            while (XmlRdr.Read())
            {
                if (XmlRdr.NodeType == XmlNodeType.Element && (XmlRdr.LocalName == "ride"))
                {

                    Ride p = new Ride();
                    p.Id = XmlRdr.GetAttribute(0);

                    string dateStr = XmlRdr.GetAttribute(1);

                    p.DateTime = Convert.ToDateTime(dateStr);

                    p.Shift = XmlRdr.GetAttribute(2);
                    p.Area = XmlRdr.GetAttribute(3);
                    p.StartPoint = XmlRdr.GetAttribute(4);
                    p.EndPoint = XmlRdr.GetAttribute(5);
                    p.Person = XmlRdr.GetAttribute(6);
                    p.Melave = new List<string>();

                    if (XmlRdr.GetAttribute("driverID") != null)
                    {
                        continue;
                    }
                    

                    for (int i = 7; i < XmlRdr.AttributeCount; i++)
                    {
                        p.Melave.Add(XmlRdr.GetAttribute(i));
                    }

                    lp.Add(p);
                    
                }
            }
            XmlRdr.Close();
        }

        JavaScriptSerializer js = new JavaScriptSerializer();

        string jsonString = js.Serialize(lp);
        return jsonString;
    }


    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string GetMyRides(string id)
    {

        String xmlFile = Server.MapPath(".") + "/App_Data/Rides.xml";

        XmlReaderSettings xmlSettings = new XmlReaderSettings();
        xmlSettings.IgnoreWhitespace = true;
        xmlSettings.IgnoreComments = true;

        List<Ride> lp = new List<Ride>();

        using (XmlReader XmlRdr = XmlReader.Create(xmlFile, xmlSettings))
        {
            while (XmlRdr.Read())
            {
                if (XmlRdr.NodeType == XmlNodeType.Element && (XmlRdr.LocalName == "ride"))
                {

                    if (XmlRdr.GetAttribute("driverID") == id)
                    {

                        Ride p = new Ride();
                        p.Id = XmlRdr.GetAttribute(0);

                        string dateStr = XmlRdr.GetAttribute(1);

                        p.DateTime = Convert.ToDateTime(dateStr);

                        p.Shift = XmlRdr.GetAttribute(2);
                        p.Area = XmlRdr.GetAttribute(3);
                        p.StartPoint = XmlRdr.GetAttribute(4);
                        p.EndPoint = XmlRdr.GetAttribute(5);
                        p.Person = XmlRdr.GetAttribute(6);
                        p.Melave = new List<string>();

                        for (int i = 7; i < XmlRdr.AttributeCount - 1; i++)
                        {
                            p.Melave.Add(XmlRdr.GetAttribute(i));
                        }

                        lp.Add(p);

                    }
                }
            }
            XmlRdr.Close();
        }
        

        JavaScriptSerializer js = new JavaScriptSerializer();

        string jsonString = js.Serialize(lp);
        return jsonString;
    }


    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string signDriver(int id)
    {
        String xmlFile = Server.MapPath(".") + "/App_Data/Rides.xml";

        XDocument doc = XDocument.Load(xmlFile);
        foreach (var ride in doc.Descendants("ride"))
        {
            if (ride.Attribute("id").Value == id.ToString())
            {
                ride.SetAttributeValue("driverID", "0528077973");
            }
        }

        doc.Save(xmlFile);
        doc = XDocument.Load(xmlFile);

        return "ok";
    }


    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string deleteRide(int id)
    {
        String xmlFile = Server.MapPath(".") + "/App_Data/Rides.xml";

        XDocument doc = XDocument.Load(xmlFile);
        foreach (var ride in doc.Descendants("ride"))
        {
            if (ride.Attribute("id").Value == id.ToString())
            {
                ride.Attribute("driverID").Remove();
            }
        }

        doc.Save(xmlFile);
        doc = XDocument.Load(xmlFile);

        return "ok";
    }


    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string checkUser(string id)
    {
        
        //testing user not exist
        //var test = false;

        //testing user exist
        var test = true;


        //if the volneteer exist
        if (test)
        {
        Volunteer v = new Volunteer();
        JavaScriptSerializer js = new JavaScriptSerializer();
        string jsonString = js.Serialize(v);
        return jsonString;
        }
        //if the volneteer not exist
        else
        {
            return null;
        }
    }

    
}
