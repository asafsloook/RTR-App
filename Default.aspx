<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        div{
            margin:5%;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        Ride ID: <asp:TextBox ID="RideTB" runat="server"></asp:TextBox> <br />
        User ID: <asp:TextBox ID="UserTB" runat="server"></asp:TextBox> <br />
        
        <asp:Button ID="cancelBTN" runat="server" Text="Notify cancel" OnClick="cancelBTN_Click" />
    </div>
       
    <div>
        Title: <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox> <br />
        Messege: <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox> <br />
        
        <asp:Button ID="globalBTN" runat="server" Text="Global messege" OnClick="globalBTN_Click" />
    </div>


    </form>
</body>
</html>
