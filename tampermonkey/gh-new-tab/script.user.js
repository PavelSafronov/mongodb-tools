// ==UserScript==
// @name         Open Links in New Tab on GitHub
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ensure links open in a new tab on GitHub.
// @author       Your Name
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to update links
    function updateLinks() {
        const links = document.querySelectorAll('a[href]');
        links.forEach((link) => {
            if (link.target !== '_blank') {
                link.target = '_blank'; // Open the link in a new tab
            }
        });
    }

    // Initial update for links already on the page
    updateLinks();

    // Observe dynamic DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            updateLinks();
        });
    });

    // Attach MutationObserver to the body element to monitor changes
    observer.observe(document.body, {
        childList: true, // Monitor direct children added/removed
        subtree: true,    // Monitor all descendants, not just immediate children
    });

})();
