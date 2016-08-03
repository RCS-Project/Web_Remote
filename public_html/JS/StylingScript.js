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
function nav_switch() {
    var element = document.getElementsByClassName("w3-sidenav")[0];
    if (element.style.display == "none")
        element.style.display = "block";
    else
        element.style.display = "none";
}
function nav_close() {
    var element = document.getElementsByClassName("w3-sidenav")[0];
    element.style.display = "none";
}

function aboutBoxShow() {
    var element = document.getElementById("aboutBox");
    element.style.display = "block";
}

function aboutBoxHide() {
    var element = document.getElementById("aboutBox");
    element.style.display = "none";
}