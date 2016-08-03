/*
  Web Remote
  Copyright (c) 2016 Subhajit Das

  This file is part of Web Remote.

  Web Remote is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Web Remote is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
 * new CORS based
 * Author : Subhajit Das
 * Date : 21/02/16
 * Update : 25/06/16
 */
var initialFlag = true;
var updateDaemon;
var errCount = 0;
var host;
var xhrBusy = false;
var xhttp;

function configureHost(val) {
    if (xhrBusy) {
        xhttp.abort();
        send("S");
    }
    host = val;
}

// handles the XHR object creation
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;
        alert("Browser not supproted");
    }
    return xhr;
}

// initialy update on status and start update daemon
function init() {
    document.getElementById("keypadMask").style.display = "block";
    send("S");
    updateDaemon = setInterval(updateOnStatus, 5000);
}
// update on status and set color accordingly
function updateOnStatus() {
    if (!xhrBusy) {
        try {
            xhttp = createCORSRequest('GET', "http://" + host + "/getStatus.php");
            xhttp.onreadystatechange = function () {
                var errCount = 0;
                if (xhttp.readyState == 4) {
                    xhrBusy = false;
                    if (xhttp.status == 200) {
                        try {
                            var onStatus = xhttp.responseText.toString();

                            // setting power btn status
                            var element = document.getElementById("power");
                            if (onStatus.charAt(0) === "1") {
                                element.className = "w3-btn-floating w3-right w3-green";
                            } else if (onStatus.charAt(0) === "0") {
                                element.className = "w3-btn-floating w3-right w3-red";
                            }

                            // clear all event listener
                            // all 9 x 2
                            for (var i = 0; i < 8; i++) {
                                for (var j = i + 1; j <= i + 11; j += 10) {
                                    try {
                                        element = document.getElementById("k" + j);
                                    } catch (err) {
                                        continue;
                                    }
                                    // recreate element
                                    var clone = element.cloneNode();
                                    while (element.firstChild) {
                                        clone.appendChild(element.lastChild);
                                    }
                                    element.parentNode.replaceChild(clone, element);
                                }
                            }

                            // setting all load indicator status
                            onStatus = onStatus.substring(1);
                            for (var i = 0; i < onStatus.length; i++) {
                                for (var j = i + 1; j <= i + 11; j += 10) {
                                    try {
                                        element = document.getElementById("k" + j);
                                    } catch (err) {
                                        continue;
                                    }
                                    // setting events
                                    if (onStatus.charAt(i) === "1" || onStatus.charAt(i) === "0") {
                                        element.addEventListener("click", function () {
                                            send(this.innerHTML);
                                        });
                                    }
                                    // setting color
                                    if (onStatus.charAt(i) === "1") {
                                        element.className = "w3-green";
                                    } else if (onStatus.charAt(i) === "0") {
                                        element.className = "w3-red";
                                    }
                                }
                            }

                            // clear loading screen for first time update
                            if (initialFlag) {
                                document.getElementById("keypadMask").style.display = "none";
                                initialFlag = false;
                            }
                        } catch (e) {
                        }
                    } else {
                        errCount++;
                        if (errCount >= 10) {
                            alert("Server connntion lost");
                            location.reload();
                        }
                    }
                }
            };
            xhrBusy = true;
            xhttp.send();
        } catch (e) {
        }
    }
}
// send the key pressed
function send(key) {
    try {
        if (xhrBusy) {
            xhttp.abort();
        }
        xhrBusy = true;

        clearInterval(updateDaemon);
        document.getElementById("keypadMask").style.display = "block";

        xhttp = createCORSRequest('GET', "http://" + host + "/sendRemoteData.php?data=" + key);
        xhttp.onload = function () {
            document.getElementById("out").innerHTML = xhttp.responseText;
        };
        xhttp.onloadend = function () {
            setTimeout(function () {
                document.getElementById("keypadMask").style.display = "none";
            }, 5000);
            xhrBusy = false;

            updateDaemon = setInterval(updateOnStatus, 5000);
        };
        xhttp.send();
    } catch (e) {
    }
}