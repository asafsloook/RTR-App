<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        Enter a Title: <asp:TextBox ID="titleTB" runat="server"></asp:TextBox> <br />
        Enter a Message: <asp:TextBox ID="messageTB" runat="server"></asp:TextBox> <br />
        
        <asp:Button ID="submitBtn" runat="server" Text="Button" OnClick="submitBtn_click" />
    </div>
    </form>
</body>
</html>
