// ==UserScript==
// @name         Open Evergreen Links in New Tab on GitHub
// @namespace    https://github.com/PavelSafronov/mongodb-tools
// @version      0.1
// @description  Ensure links to evergreen.mongodb.com open in a new tab on GitHub.
// @author       Pavel Safronov
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to update links
    function updateLinks() {
        const evergreenLinks = document.querySelectorAll('a[href*="https://evergreen.mongodb.com"]');
        evergreenLinks.forEach((link) => {
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
