﻿var watchID = null;
var positionDateTime;
var hasFix;
var m_PositionAverager;
var authToken;
var displayName;
var userName;
var siteTagCount;
var siteUserCount;
var siteHydrantCount;
var Tags;

function menuselect(event, ui) {
    alert("Hello");
}

function register() {
    $("#lblStatus").removeClass("bg-success");
    $("#lblStatus").removeClass("bg-danger");
    
    var username = $("#txtUsername").val();
    var email = $("#txtEmailAddress").val();
    var password1 = $("#txtPassword").val();
    var password2 = $("#txtPassword2").val();

    if (password1 == password2) {
        $.ajax({
            type: "POST",
            url: "/register",
            headers: { "Username": username, "Password": password1, "Email": email },
            success: function(response) {
                if (response.Result == "Success") {
                    window.alert("Please check your email to verify your account.");

                    window.location.replace("/login");
                } else if (response.Result == "UsernameNotAvailable") {
                    $("#lblStatus").text("The username is not available.");
                    $("#lblStatus").addClass("bg-danger");
                }
            },
            error: RegisterFailure,
            cache: false,
            contentType: false,
            processData: false
        });
    } else {
        $("#lblStatus").text("Passwords do not match.");
        $("#lblStatus").addClass("bg-danger");
    }
}

function TypeChange(type) {

    if (type == 'allyear') {
        
    }
    else if (type == 'before') {
        
    }
    else if (type == 'after') {
        
    }
    else if (type == 'between') {
        
    }
    else if (type == 'on') {
        
    }
}



function RegisterFailure() {
    $("#lblStatus").text("An error has occurred.");
    $("#lblStatus").addClass("bg-danger");
}


function login() {
    var username = $("#txtUsername").val();
    var password = $("#txtPassword").val();
    
    $("#lblStatus").removeClass("bg-success");
    $("#lblStatus").removeClass("bg-danger");

    $.ajax({
        type: "POST",
        url: "/login",
        headers: { "Username": username, "Password": password },
        success: function (response) {
            if (response.Result == "Success") {
                //Cache user info
                authToken = response.AuthorizationToken;
                userName = response.UserName;
                displayName = response.DisplayName;
                WriteToLocalStorage();

                window.location.replace("/home");
            }
            else if (response.Result == "NotActive") {
                $("#lblStatus").text("User has been deactivated.");
                $("#lblStatus").addClass("bg-danger");
            }
            else if (response.Result == "NotVerified") {
                $("#lblStatus").text("Please verify the email address of your account.");
                $("#lblStatus").addClass("bg-danger");
            }
            else {
                $("#lblStatus").text("Bad user or password combination.");
                $("#lblStatus").addClass("bg-danger");
            }
        },
        error: LoginFailure,
        cache: false,
        contentType: false,
        processData: false
    });
}

function ChangePassword() {
    $("#lblStatus").removeClass("bg-success");
    $("#lblStatus").removeClass("bg-danger");

    var username = localStorage.userName;
    var authToken = localStorage.authToken;
    var current = $("#txtCurrentPassword").val();
    var new1 = $("#txtNewPassword").val();
    var new2 = $("#txtNewPasswordRepeat").val();

    if (new1 == new2) {
        var formData = new FormData();
        formData.append('currentpassword', current);
        formData.append('newpassword', new1);

        $.ajax({
            type: "POST",
            url: "/changepassword",
            headers: { "Username": username, "AuthorizationToken": authToken },
            data: formData,
            success: function(response) {
                if (response.Result == "Success") {
                    $("#lblStatus").addClass("bg-success");
                    $("#lblStatus").text("Your password has been changed.");
                } else {
                    $("#lblStatus").addClass("bg-danger");
                    $("#lblStatus").text("Your current password wasn't correct.");
                }
            },
            error: ResetFailure,
            cache: false,
            contentType: false,
            processData: false
        });
    } else {
        $("#lblStatus").text("The new passwords do not match.");
        $("#lblStatus").addClass("bg-danger");
    }
}

function GetMyAntiResolutions() {
    
}

function ResetPassword() {
    var email = $("#txtEmailAddress").val();

    $.ajax({
        type: "POST",
        url: "/reset",
        headers: { "EmailAddress": email },
        success: function (response) {
            if (response.Result == "Success") {
                alert("If the email is in our system, a password reset email has been sent.");

                window.location.replace("/home");
            }
        },
        error: ResetFailure,
        cache: false,
        contentType: false,
        processData: false
    });
}

function ResetFailure() {
    alert("An error occurred.");
}

function GetPendingTags() {
    var username = localStorage.userName;
    var authToken = localStorage.authToken;

    $.ajax({
        type: "GET",
        url: "/rest/tags/pending/table",
        headers: { "Username": username, "AuthorizationToken": authToken },
        success: GetPendingTagsReceived,
        error: GetPendingTagsFailure,
        cache: false,
        contentType: false,
        processData: false
    });
}

function GetPendingTagsFailure() {
    
}

function GetPendingTagsReceived(response) {
    $('#tags_table').dataTable({
        data: response.Data,
        columns: [{ "data": "ReviewButton", "width": "10%" },
                  { "data": "TagDateTime", "width": "25%" },
                  { "data": "Username", "width": "20%" },
                  { "data": "Location", "width": "25%" },
                  { "data": "Thumbnail", "width": "20%"}]
    });
}

function LoginFailure(jqxhr, status, error) {
    alert(error);
}

//Load the security info from local storage
function LoadFromLocalStorage() {
    authToken = localStorage.authToken;
    displayName = localStorage.displayName;
    userName = localStorage.userName;
}

//Write security info to local storage
function WriteToLocalStorage() {
    localStorage.authToken = authToken;
    localStorage.displayName = displayName;
    localStorage.userName = userName;
}

//Clear security info from storage to log the user out
function LogoutAndClear() {
    authToken = null;
    displayName = null;
    userName = null;

    localStorage.removeItem("authToken");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userName");
}

function SaveAntiResolutions() {
    
    var resolution = $("#txtAntiResolution").val();
    

}