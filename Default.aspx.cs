using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void submitBtn_click(object sender, EventArgs e)
    {
        Volunteer v = new Volunteer();
        List<Volunteer> volunteersList = v.getVolunteersList(true);

        string message = messageTB.Text;
        string title = titleTB.Text;

        myPushNot pushNot = new myPushNot(message, title, "1", 0, "default");
        
        Payload p = new Payload();
        p.code = "benny";
        p.year = 52;

        pushNot.data = p;

        string str = JsonConvert.SerializeObject(p);

        pushNot.PayloadString = str;

        pushNot.RunPushNotification(volunteersList, pushNot);
        
        
        //pushNot.msgcnt = "1"; //message id - 
        //pushNot.badge = 7; //count of messages - field name in the client is count
        
    }


   
}