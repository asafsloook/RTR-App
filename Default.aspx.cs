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


    protected void cancelRide(int rideID, int userID)
    {
        var p = new myPushNot();

        var v = new Volunteer();
        List<Volunteer> volunteersList = v.getVolunteersList(true);

        foreach (var user in volunteersList)
        {
            if (user.Id == userID)
            {
                p.cancelRide(rideID, user);
            }
        }
    }
    

    protected void cancelBTN_Click(object sender, EventArgs e)
    {
        int rideID = int.Parse(RideTB.Text);
        int userID = int.Parse(UserTB.Text);

        cancelRide(rideID, userID);
    }

    protected void globalBTN_Click(object sender, EventArgs e)
    {
        string title = TextBox1.Text;
        string message = TextBox2.Text;

        Volunteer v = new Volunteer();
        List<Volunteer> volunteersList = v.getVolunteersList(true);

        myPushNot pushNot = new myPushNot(message, title, "1", 1, "default");

        pushNot.RunPushNotificationAll(volunteersList, pushNot);
    }
}