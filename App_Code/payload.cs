using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for payload
/// </summary>
public class Payload
{
	public Payload()
	{
		//
		// TODO: Add constructor logic here
		//
	}

    private string Code;

    public string code
    {
        get { return Code; }
        set { Code = value; }
    }

    private int Year;

    public int year
    {
        get { return Year; }
        set { Year = value; }
    }
}