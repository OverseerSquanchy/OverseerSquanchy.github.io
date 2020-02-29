function getStatus(status) {
    if (typeof status === "undefined") return;
    const currentDay = new Date().getDay();
    const currentHour = new Date().getHours();
    if (currentDay === 0 || currentDay === 6) {
      return "WEEKEND";
    } else if (currentHour < 8 || currentHour > 17) {
      return "WEEKEND";
    } else
    if (status) {
        return "OFFICE";
    } else {
        return "HOME";
    }
}

function updateStatus(status) {
    const homeMessage = "Hello, i'm working remotely today";
    const officeMessage = "Hello, i'm in the office today";
    const weekendMessage = "Outside of office hours";
    let message = "Whoops, something broke";
    const body = $("body");
    var svgFile = "";
    switch (getStatus(status)) {
        case "LOADING":
            message = "Loading...";
            body.css("background-color", "slategrey");
            svgFile = "vacationNoBorder.svg";
            break;
        case "WEEKEND":
            message = weekendMessage;
            body.css("background-color", "slategrey");
            svgFile = "vacationNoBorder.svg";
            break;
        case "OFFICE":
            message = officeMessage;
            body.css("background-color", "#339966");
            svgFile = "inOfficeEdited.svg";
            break;
        case "HOME":
            message = homeMessage;
            body.css("background-color", "#6262f3");
            svgFile = "wfhNoBorder.svg";
            break;
        default:
            message = "Loading...";
            body.css("#c97946");
            svgFile = "wfhNoBorder.svg";
    }

    $("#status_image").attr("src", svgFile);
    $("#status").text(message);
}

function toggleStatus() {
    if (getStatus(status) === "WEEKEND") return;
    $.ajax({
        type: "POST",
        url: "/toggle",
        success: function(data) {
            updateStatus(data.status);
        },
        error: function() {
            if (typeof window.wfhStatus === "undefined") {
                window.wfhStatus = false;
            } else {
                window.wfhStatus = !window.wfhStatus;
            }
            console.log(window.wfhStatus);
            updateStatus(!window.wfhStatus);
        }
    });
}

$(document).ready(function() {
    let isInOffice;
    $.ajax({
        type: "GET",
        url: "/status",
        success: function(data) {
            isInOffice = Boolean(data);

            updateStatus(isInOffice);

            function updateClock() {
                $("#clock").text(moment().format("dddd MMMM Do, h:mm:ss a"));
            }

            updateClock();
            setInterval(updateClock, 1000);
        },
        error: function() {
            window.wfhStatus = false;
        }
    });
    updateStatus("LOADING");
});
