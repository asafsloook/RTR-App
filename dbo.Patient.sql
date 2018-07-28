CREATE TABLE [dbo].[Patient] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [DisplayName]  NVARCHAR (255) NULL,
    [FirstNameH]   NVARCHAR (255) NOT NULL,
    [LastNameH]    NVARCHAR (255) NOT NULL,
    [CellPhone]    NVARCHAR (50)  NOT NULL,
    [CellPhone2]   NVARCHAR (50)  NULL,
    [HomePhone]    NVARCHAR (50)  NULL,
    [LivingArea]   NVARCHAR (255) NULL,
    [IsActive]     BIT            NULL,
    [BirthDate]    DATE           NULL,
    [History]      NVARCHAR (255) NULL,
    [Gender]       NVARCHAR (50)  NULL,
    [Remarks]      NVARCHAR (255) NULL,
    [Department]   NVARCHAR (255) NULL,
    [CityCityName] NVARCHAR (255) NULL,
    [pnRegId]      NVARCHAR (255) NULL,
    [Hospital]     NVARCHAR (255) NULL,
    [Barrier]      NVARCHAR (255) NULL,
    [FirstNameA]   NVARCHAR (255) NULL,
    [LastNameA]    NVARCHAR (255) NULL,
    [DisplayNameA] NVARCHAR (255) NULL,
    CONSTRAINT [PK__Patient__3214EC0718B6AB08] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ__Patient__A18E1CB11B9317B3] UNIQUE NONCLUSTERED ([CellPhone] ASC),
    CONSTRAINT [UQ__Patient__4E3E687D1E6F845E] UNIQUE NONCLUSTERED ([DisplayName] ASC),
    CONSTRAINT [UQ__Patient__A18E1CB116644E42] UNIQUE NONCLUSTERED ([CellPhone] ASC),
    CONSTRAINT [UQ__Patient__4E3E687D1940BAED] UNIQUE NONCLUSTERED ([DisplayName] ASC),
    CONSTRAINT [FKPatient117009] FOREIGN KEY ([CityCityName]) REFERENCES [dbo].[City] ([CityName]),
    CONSTRAINT [FK__Patient__Hospita__5C37ACAD] FOREIGN KEY ([Hospital]) REFERENCES [dbo].[Location] ([Name]),
    CONSTRAINT [FK__Patient__Barrier__5D2BD0E6] FOREIGN KEY ([Barrier]) REFERENCES [dbo].[Location] ([Name])
);


GO
CREATE trigger [dbo].[PatientDisplayNameTrigger]
on [dbo].[Patient] for insert
as
begin
declare @dName nvarchar(50) =   (select firstNameH from inserted)+' '+(select lastNameH from inserted)
declare @cell nvarchar(11)= (select cellPhone from inserted)
declare @id int = (select id from inserted)
if exists (select * from [dbo].[Patient] where [displayName]=@dNAme)
update [dbo].[Patient] set displayName=@dName+'_'+@cell where id=@id
else
update [dbo].[Patient] set displayName=@dName where id=@id
end
GO
create trigger [dbo].[PatientArabicDisplayNameTrigger]
on [dbo].[Patient] for insert
as
begin
declare @dName nvarchar(50) =   (select firstNameA from inserted)+' '+(select lastNameA from inserted)
declare @cell nvarchar(11)= (select cellPhone from inserted)
declare @id int = (select id from inserted)
if exists (select * from [dbo].[Patient] where [displayNameA]=@dNAme)
update [dbo].[Patient] set displayNameA=@dName+'_'+@cell where id=@id
else
update [dbo].[Patient] set displayNameA=@dName where id=@id
end