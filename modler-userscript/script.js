// ==UserScript==
// @name        modler 
// @include     https://github.com/*/*
// @version     0.1
// @author      StormPacer
// @description Oneclick-like installer for Beat Saber mods from github.
// ==/UserScript==

(function () {
    "use strict";

    const list = document.getElementsByClassName("file-navigation mb-3 d-flex flex-items-start")

    const element = document.createElement("button")
    element.classList.add("btn")
    const txt = document.createTextNode("🛠 Install mod")

    const urlParts = window.location.href.split("/")

    element.onclick = () => {
        window.location.replace(`modler://https://api.github.com/repos/${urlParts[3]}/${urlParts[4]}/releases/latest`)
    }

    element.appendChild(txt)

    list.item(0).appendChild(element)
})();