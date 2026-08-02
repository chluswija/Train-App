import { TrainBooking, UserProfile } from '../types';

export const DEFAULT_TEST_USERS: UserProfile[] = [
  {
    username: 'admin_kishore',
    employeeName: 'Srivenkata Kishore',
    portalId: 'ADM-2026',
    email: 'kishore.admin@nlci.railways.gov.in',
    department: 'System Architecture & Database Admin',
    role: 'admin',
    loginTime: '08:00 AM'
  },
  {
    username: 'rajesh_k',
    employeeName: 'Rajesh Kumar',
    portalId: 'PASS-84920',
    email: 'rajesh.kumar@gmail.com',
    department: 'Passenger Services',
    role: 'viewer',
    loginTime: '08:15 AM'
  },
  {
    username: 'priya_s',
    employeeName: 'Priya Sharma',
    portalId: 'PASS-73019',
    email: 'priya.sharma@outlook.com',
    department: 'Passenger Services',
    role: 'viewer',
    loginTime: '08:20 AM'
  },
  {
    username: 'ananya_d',
    employeeName: 'Ananya Deshmukh',
    portalId: 'PASS-91827',
    email: 'ananya.d@yahoo.com',
    department: 'Passenger Services',
    role: 'viewer',
    loginTime: '08:25 AM'
  }
];

export const INITIAL_TRAIN_BOOKINGS: TrainBooking[] = [
  {
    pnrno: 'PNR84920156',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    seatNo: 'B2-34',
    trainName: 'Vande Bharat Express (20901)',
    travelDate: '2026-08-05',
    time: '06:00 AM',
    mobile: '9876543210',
    status: 'Confirmed',
    amount: 1450,
    classType: 'CC',
    createdAt: '2026-07-20 10:30:00'
  },
  {
    pnrno: 'PNR73019284',
    firstName: 'Priya',
    lastName: 'Sharma',
    seatNo: 'A1-12',
    trainName: 'Rajdhani Express (12431)',
    travelDate: '2026-08-10',
    time: '16:30 PM',
    mobile: '9123456789',
    status: 'Confirmed',
    amount: 2890,
    classType: '2A',
    createdAt: '2026-07-21 14:15:00'
  },
  {
    pnrno: 'PNR65412398',
    firstName: 'Arun',
    lastName: 'Subramanian',
    seatNo: 'S4-58',
    trainName: 'Coromandel Express (12841)',
    travelDate: '2026-08-12',
    time: '08:45 AM',
    mobile: '9988776655',
    status: 'Confirmed',
    amount: 680,
    classType: 'SL',
    createdAt: '2026-07-22 09:20:00'
  },
  {
    pnrno: 'PNR91827364',
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    seatNo: 'EC-08',
    trainName: 'Shatabdi Express (12001)',
    travelDate: '2026-08-15',
    time: '07:15 AM',
    mobile: '9765432109',
    status: 'Confirmed',
    amount: 1980,
    classType: 'EC',
    createdAt: '2026-07-24 11:05:00'
  },
  {
    pnrno: 'PNR52617283',
    firstName: 'Vikram',
    lastName: 'Singhania',
    seatNo: 'H1-04',
    trainName: 'Grand Trunk Express (12615)',
    travelDate: '2026-08-18',
    time: '19:10 PM',
    mobile: '9811223344',
    status: 'RAC',
    amount: 3400,
    classType: '1A',
    createdAt: '2026-07-25 16:40:00'
  }
];

export const AVAILABLE_TRAINS = [
  'Vande Bharat Express (20901)',
  'Rajdhani Express (12431)',
  'Shatabdi Express (12001)',
  'Coromandel Express (12841)',
  'Grand Trunk Express (12615)',
  'Tejas Express (82901)',
  'Duronto Express (12213)',
  'Garib Rath Express (12201)'
];

export const SAMPLE_CODE_FILES = {
  'Trainbooking.sql': `-- ============================================================
-- NLCI .NET Developer Certification Case Study
-- Script: Table Creation & Stored Procedures for Trainbooking
-- Database: NLCIDB (SQL Server 2019/2022)
-- ============================================================

USE [NLCIDB];
GO

-- 1. Create Trainbooking Table
IF OBJECT_ID('dbo.Trainbooking', 'U') IS NOT NULL
    DROP TABLE dbo.Trainbooking;
GO

CREATE TABLE dbo.Trainbooking (
    Pnrno       VARCHAR(20) NOT NULL PRIMARY KEY,
    FirstName   NVARCHAR(50) NOT NULL,
    LastName    NVARCHAR(50) NOT NULL,
    SeatNo      VARCHAR(15) NOT NULL,
    TrainName   NVARCHAR(100) NOT NULL,
    TravelDate  DATE NOT NULL,
    [Time]      VARCHAR(15) NOT NULL,
    Mobile      VARCHAR(15) NOT NULL,
    CreatedAt   DATETIME DEFAULT GETDATE()
);
GO

-- Create Index on Mobile and TravelDate for Query Performance
CREATE INDEX IX_Trainbooking_Mobile ON dbo.Trainbooking(Mobile);
CREATE INDEX IX_Trainbooking_TravelDate ON dbo.Trainbooking(TravelDate);
GO

-- 2. Stored Procedure: Create Booking (INSERT)
CREATE PROCEDURE dbo.sp_InsertTrainBooking
    @Pnrno       VARCHAR(20),
    @FirstName   NVARCHAR(50),
    @LastName    NVARCHAR(50),
    @SeatNo      VARCHAR(15),
    @TrainName   NVARCHAR(100),
    @TravelDate  DATE,
    @Time        VARCHAR(15),
    @Mobile      VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.Trainbooking (Pnrno, FirstName, LastName, SeatNo, TrainName, TravelDate, [Time], Mobile)
    VALUES (@Pnrno, @FirstName, @LastName, @SeatNo, @TrainName, @TravelDate, @Time, @Mobile);
END;
GO

-- 3. Stored Procedure: Read All Bookings (SELECT)
CREATE PROCEDURE dbo.sp_GetAllTrainBookings
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT Pnrno, FirstName, LastName, SeatNo, TrainName, TravelDate, [Time], Mobile, CreatedAt
    FROM dbo.Trainbooking
    ORDER BY TravelDate DESC, CreatedAt DESC;
END;
GO

-- 4. Stored Procedure: Update Booking (UPDATE)
CREATE PROCEDURE dbo.sp_UpdateTrainBooking
    @Pnrno       VARCHAR(20),
    @FirstName   NVARCHAR(50),
    @LastName    NVARCHAR(50),
    @SeatNo      VARCHAR(15),
    @TrainName   NVARCHAR(100),
    @TravelDate  DATE,
    @Time        VARCHAR(15),
    @Mobile      VARCHAR(15)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Trainbooking
    SET FirstName  = @FirstName,
        LastName   = @LastName,
        SeatNo     = @SeatNo,
        TrainName  = @TrainName,
        TravelDate = @TravelDate,
        [Time]     = @Time,
        Mobile     = @Mobile
    WHERE Pnrno = @Pnrno;
END;
GO

-- 5. Stored Procedure: Delete Booking (DELETE)
CREATE PROCEDURE dbo.sp_DeleteTrainBooking
    @Pnrno VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM dbo.Trainbooking
    WHERE Pnrno = @Pnrno;
END;
GO
`,

  'Web.config': `<?xml version="1.0" encoding="utf-8"?>
<!--
  NLCI ASP.NET Web Application Configuration
  ADO.NET Connection String configuration for SQL Server
-->
<configuration>
  <connectionStrings>
    <add name="NLCIDbConnection" 
         connectionString="Data Source=localhost\\SQLEXPRESS;Initial Catalog=NLCIDB;Integrated Security=True;TrustServerCertificate=True" 
         providerName="System.Data.SqlClient" />
  </connectionStrings>

  <system.web>
    <compilation debug="true" targetFramework="4.8" />
    <httpRuntime targetFramework="4.8" />
  </system.web>
</configuration>
`,

  'TrainBookingDAL.cs': `using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Collections.Generic;

namespace NLCI.TrainBookingApp.DAL
{
    /// <summary>
    /// Data Access Layer for Trainbooking table using ADO.NET.
    /// Handles CRUD operations with SqlConnection, SqlCommand, SqlDataReader, and SqlDataAdapter.
    /// </summary>
    public class TrainBookingDAL
    {
        private readonly string _connectionString;

        public TrainBookingDAL()
        {
            _connectionString = ConfigurationManager.ConnectionStrings["NLCIDbConnection"].ConnectionString;
        }

        // ==========================================
        // 1. CREATE: Add New Train Booking
        // ==========================================
        public bool InsertBooking(string pnrNo, string firstName, string lastName, string seatNo, string trainName, DateTime travelDate, string time, string mobile)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Trainbooking (Pnrno, FirstName, LastName, SeatNo, TrainName, TravelDate, [Time], Mobile)
                                VALUES (@Pnrno, @FirstName, @LastName, @SeatNo, @TrainName, @TravelDate, @Time, @Mobile)";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@Pnrno", pnrNo);
                    cmd.Parameters.AddWithValue("@FirstName", firstName);
                    cmd.Parameters.AddWithValue("@LastName", lastName);
                    cmd.Parameters.AddWithValue("@SeatNo", seatNo);
                    cmd.Parameters.AddWithValue("@TrainName", trainName);
                    cmd.Parameters.AddWithValue("@TravelDate", travelDate);
                    cmd.Parameters.AddWithValue("@Time", time);
                    cmd.Parameters.AddWithValue("@Mobile", mobile);

                    try
                    {
                        conn.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();
                        return rowsAffected > 0;
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception("ADO.NET Database Error during Insert: " + ex.Message, ex);
                    }
                }
            }
        }

        // ==========================================
        // 2. READ: Get All Train Bookings (DataSet / DataTable)
        // ==========================================
        public DataTable GetAllBookings()
        {
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT Pnrno, FirstName, LastName, SeatNo, TrainName, TravelDate, [Time], Mobile FROM Trainbooking ORDER BY TravelDate DESC";
                
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                    {
                        try
                        {
                            adapter.Fill(dt);
                        }
                        catch (SqlException ex)
                        {
                            throw new Exception("ADO.NET Error fetching records: " + ex.Message, ex);
                        }
                    }
                }
            }
            return dt;
        }

        // ==========================================
        // 3. READ SINGLE: Get Booking by PNR (SqlDataReader)
        // ==========================================
        public DataRow GetBookingByPNR(string pnrNo)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT Pnrno, FirstName, LastName, SeatNo, TrainName, TravelDate, [Time], Mobile FROM Trainbooking WHERE Pnrno = @Pnrno";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Pnrno", pnrNo);
                    using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                    {
                        adapter.Fill(dt);
                    }
                }
            }
            return dt.Rows.Count > 0 ? dt.Rows[0] : null;
        }

        // ==========================================
        // 4. UPDATE: Modify Existing Booking
        // ==========================================
        public bool UpdateBooking(string pnrNo, string firstName, string lastName, string seatNo, string trainName, DateTime travelDate, string time, string mobile)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Trainbooking 
                                SET FirstName = @FirstName,
                                    LastName = @LastName,
                                    SeatNo = @SeatNo,
                                    TrainName = @TrainName,
                                    TravelDate = @TravelDate,
                                    [Time] = @Time,
                                    Mobile = @Mobile
                                WHERE Pnrno = @Pnrno";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Pnrno", pnrNo);
                    cmd.Parameters.AddWithValue("@FirstName", firstName);
                    cmd.Parameters.AddWithValue("@LastName", lastName);
                    cmd.Parameters.AddWithValue("@SeatNo", seatNo);
                    cmd.Parameters.AddWithValue("@TrainName", trainName);
                    cmd.Parameters.AddWithValue("@TravelDate", travelDate);
                    cmd.Parameters.AddWithValue("@Time", time);
                    cmd.Parameters.AddWithValue("@Mobile", mobile);

                    try
                    {
                        conn.Open();
                        int rows = cmd.ExecuteNonQuery();
                        return rows > 0;
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception("ADO.NET Error during Update: " + ex.Message, ex);
                    }
                }
            }
        }

        // ==========================================
        // 5. DELETE: Remove Booking by PNR
        // ==========================================
        public bool DeleteBooking(string pnrNo)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Trainbooking WHERE Pnrno = @Pnrno";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Pnrno", pnrNo);
                    try
                    {
                        conn.Open();
                        int rows = cmd.ExecuteNonQuery();
                        return rows > 0;
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception("ADO.NET Error during Delete: " + ex.Message, ex);
                    }
                }
            }
        }
    }
}
`,

  'TrainBooking.aspx': `<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TrainBooking.aspx.cs" Inherits="NLCI.TrainBookingApp.TrainBooking" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>NLCI - Train Booking System (ADO.NET)</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <style>
        body { background-color: #f8fafc; font-family: 'Segoe UI', sans-serif; }
        .header-bg { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: white; }
        .card-custom { border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="header-bg py-4 mb-4 shadow">
            <div class="container">
                <h2 class="fw-bold mb-0">NLCI .NET Train Booking Management System</h2>
                <p class="mb-0 text-light opacity-75">ASP.NET Web Application built with ADO.NET CRUD Architecture</p>
            </div>
        </div>

        <div class="container pb-5">
            <!-- Alert Messages -->
            <asp:Label ID="lblMessage" runat="server" CssClass="alert d-block" Visible="false"></asp:Label>

            <div class="row g-4">
                <!-- Left Column: Input Form (Create / Edit) -->
                <div class="col-lg-4">
                    <div class="card card-custom p-4 bg-white">
                        <h4 class="card-title fw-bold text-primary mb-3">
                            <asp:Literal ID="litFormTitle" runat="server" Text="New Train Booking"></asp:Literal>
                        </h4>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">PNR Number</label>
                            <asp:TextBox ID="txtPnrno" runat="server" CssClass="form-control" Placeholder="e.g. PNR98765432"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="rfvPnr" runat="server" ControlToValidate="txtPnrno" 
                                ErrorMessage="PNR is required" CssClass="text-danger small" ValidationGroup="vgBooking" />
                        </div>

                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label fw-semibold">First Name</label>
                                <asp:TextBox ID="txtFirstName" runat="server" CssClass="form-control" Placeholder="John"></asp:TextBox>
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label fw-semibold">Last Name</label>
                                <asp:TextBox ID="txtLastName" runat="server" CssClass="form-control" Placeholder="Doe"></asp:TextBox>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">Seat Number</label>
                            <asp:TextBox ID="txtSeatNo" runat="server" CssClass="form-control" Placeholder="e.g. S3-42"></asp:TextBox>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">Train Name</label>
                            <asp:DropDownList ID="ddlTrainName" runat="server" CssClass="form-select">
                                <asp:ListItem Text="Select Train" Value="" />
                                <asp:ListItem Text="Vande Bharat Express (20901)" Value="Vande Bharat Express (20901)" />
                                <asp:ListItem Text="Rajdhani Express (12431)" Value="Rajdhani Express (12431)" />
                                <asp:ListItem Text="Shatabdi Express (12001)" Value="Shatabdi Express (12001)" />
                                <asp:ListItem Text="Coromandel Express (12841)" Value="Coromandel Express (12841)" />
                            </asp:DropDownList>
                        </div>

                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label fw-semibold">Travel Date</label>
                                <asp:TextBox ID="txtTravelDate" runat="server" TextMode="Date" CssClass="form-control"></asp:TextBox>
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label fw-semibold">Time</label>
                                <asp:TextBox ID="txtTime" runat="server" CssClass="form-control" Placeholder="08:30 AM"></asp:TextBox>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">Mobile Number</label>
                            <asp:TextBox ID="txtMobile" runat="server" CssClass="form-control" Placeholder="9876543210"></asp:TextBox>
                        </div>

                        <div class="d-flex gap-2">
                            <asp:Button ID="btnSave" runat="server" Text="Save Booking" CssClass="btn btn-primary w-100 fw-bold" 
                                OnClick="btnSave_Click" ValidationGroup="vgBooking" />
                            <asp:Button ID="btnClear" runat="server" Text="Clear" CssClass="btn btn-outline-secondary" 
                                OnClick="btnClear_Click" CauseValidation="false" />
                        </div>
                    </div>
                </div>

                <!-- Right Column: DataGrid (Read / Update / Delete) -->
                <div class="col-lg-8">
                    <div class="card card-custom p-4 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="fw-bold mb-0 text-dark">Train Bookings Directory</h4>
                            <div class="input-group w-50">
                                <asp:TextBox ID="txtSearch" runat="server" CssClass="form-control" Placeholder="Search by PNR or Name..."></asp:TextBox>
                                <asp:Button ID="btnSearch" runat="server" Text="Search" CssClass="btn btn-outline-primary" OnClick="btnSearch_Click" />
                            </div>
                        </div>

                        <div class="table-responsive">
                            <asp:GridView ID="gvBookings" runat="server" AutoGenerateColumns="False" 
                                DataKeyNames="Pnrno" CssClass="table table-hover table-striped align-middle border"
                                OnRowEditing="gvBookings_RowEditing" 
                                OnRowUpdating="gvBookings_RowUpdating" 
                                OnRowCancelingEdit="gvBookings_RowCancelingEdit"
                                OnRowDeleting="gvBookings_RowDeleting">
                                <Columns>
                                    <asp:BoundField DataField="Pnrno" HeaderText="PNR No" ReadOnly="True" />
                                    <asp:BoundField DataField="FirstName" HeaderText="First Name" />
                                    <asp:BoundField DataField="LastName" HeaderText="Last Name" />
                                    <asp:BoundField DataField="SeatNo" HeaderText="Seat No" />
                                    <asp:BoundField DataField="TrainName" HeaderText="Train Name" />
                                    <asp:BoundField DataField="TravelDate" HeaderText="Travel Date" DataFormatString="{0:yyyy-MM-dd}" />
                                    <asp:BoundField DataField="Time" HeaderText="Time" />
                                    <asp:BoundField DataField="Mobile" HeaderText="Mobile" />
                                    <asp:CommandField ShowEditButton="True" ShowDeleteButton="True" 
                                        ControlStyle-CssClass="btn btn-sm btn-link" />
                                </Columns>
                            </asp:GridView>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
`,

  'TrainBooking.aspx.cs': `using System;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using NLCI.TrainBookingApp.DAL;

namespace NLCI.TrainBookingApp
{
    public partial class TrainBooking : System.Web.UI.Page
    {
        private readonly TrainBookingDAL _dal = new TrainBookingDAL();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                BindGridView();
            }
        }

        private void BindGridView()
        {
            try
            {
                DataTable dt = _dal.GetAllBookings();
                gvBookings.DataSource = dt;
                gvBookings.DataBind();
            }
            catch (Exception ex)
            {
                ShowMessage("Error loading bookings: " + ex.Message, "alert-danger");
            }
        }

        protected void btnSave_Click(object sender, EventArgs e)
        {
            try
            {
                string pnr = txtPnrno.Text.Trim();
                string fName = txtFirstName.Text.Trim();
                string lName = txtLastName.Text.Trim();
                string seat = txtSeatNo.Text.Trim();
                string train = ddlTrainName.SelectedValue;
                DateTime travelDate = Convert.ToDateTime(txtTravelDate.Text);
                string time = txtTime.Text.Trim();
                string mobile = txtMobile.Text.Trim();

                bool isSuccess = _dal.InsertBooking(pnr, fName, lName, seat, train, travelDate, time, mobile);
                if (isSuccess)
                {
                    ShowMessage("Train Booking " + pnr + " created successfully via ADO.NET!", "alert-success");
                    ClearForm();
                    BindGridView();
                }
            }
            catch (Exception ex)
            {
                ShowMessage("Failed to save booking: " + ex.Message, "alert-danger");
            }
        }

        protected void gvBookings_RowEditing(object sender, GridViewEditEventArgs e)
        {
            gvBookings.EditIndex = e.NewEditIndex;
            BindGridView();
        }

        protected void gvBookings_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
        {
            gvBookings.EditIndex = -1;
            BindGridView();
        }

        protected void gvBookings_RowUpdating(object sender, GridViewUpdateEventArgs e)
        {
            try
            {
                string pnr = gvBookings.DataKeys[e.RowIndex].Value.ToString();
                GridViewRow row = gvBookings.Rows[e.RowIndex];

                string fName = ((TextBox)row.Cells[1].Controls[0]).Text;
                string lName = ((TextBox)row.Cells[2].Controls[0]).Text;
                string seat = ((TextBox)row.Cells[3].Controls[0]).Text;
                string train = ((TextBox)row.Cells[4].Controls[0]).Text;
                DateTime travelDate = Convert.ToDateTime(((TextBox)row.Cells[5].Controls[0]).Text);
                string time = ((TextBox)row.Cells[6].Controls[0]).Text;
                string mobile = ((TextBox)row.Cells[7].Controls[0]).Text;

                bool isSuccess = _dal.UpdateBooking(pnr, fName, lName, seat, train, travelDate, time, mobile);
                if (isSuccess)
                {
                    gvBookings.EditIndex = -1;
                    ShowMessage("Booking " + pnr + " updated successfully!", "alert-success");
                    BindGridView();
                }
            }
            catch (Exception ex)
            {
                ShowMessage("Update Error: " + ex.Message, "alert-danger");
            }
        }

        protected void gvBookings_RowDeleting(object sender, GridViewDeleteEventArgs e)
        {
            try
            {
                string pnr = gvBookings.DataKeys[e.RowIndex].Value.ToString();
                bool isSuccess = _dal.DeleteBooking(pnr);
                if (isSuccess)
                {
                    ShowMessage("Booking " + pnr + " deleted successfully!", "alert-info");
                    BindGridView();
                }
            }
            catch (Exception ex)
            {
                ShowMessage("Delete Error: " + ex.Message, "alert-danger");
            }
        }

        protected void btnClear_Click(object sender, EventArgs e)
        {
            ClearForm();
        }

        private void ClearForm()
        {
            txtPnrno.Text = "";
            txtFirstName.Text = "";
            txtLastName.Text = "";
            txtSeatNo.Text = "";
            ddlTrainName.SelectedIndex = 0;
            txtTravelDate.Text = "";
            txtTime.Text = "";
            txtMobile.Text = "";
        }

        private void ShowMessage(string msg, string cssClass)
        {
            lblMessage.Text = msg;
            lblMessage.CssClass = "alert " + cssClass + " d-block";
            lblMessage.Visible = true;
        }
    }
}
`
};
