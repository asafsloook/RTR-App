--clear user prefs

update Volunteer set AvailableSeats = null where Id = 20

delete from PreferredArea_Volunteer where VolunteerId = 20

delete from PreferedDay_Volunteer where VolunteerId = 20

delete from PreferredLocation_Volunteer where VolunteerId = 20