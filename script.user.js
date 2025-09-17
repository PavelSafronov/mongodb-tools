// ==UserScript==  
// @name         Copy Header with URL
// @namespace    https://github.com/PavelSafronov/mongodb-tools
// @version      0.6
// @description  Add a copy button next to headers to copy their text along with the page's URL as a link (with anchor support and silent notifications).  
// @author       Pavel Safronov
// @match        *://*/*  
// ==/UserScript==  
/*  
 * Final Notes and Documentation:  
 *   
 * 1. Silent Notifications:  
 *    - Instead of using `GM_notification`, this script uses a custom HTML-based notification system to avoid browser-triggered sounds during clipboard operations.  
 *    - Notifications appear in the bottom-right corner with a subtle fade-out animation.  
 *   
 * 2. Clipboard Copy Behavior:  
 *    - The `navigator.clipboard.write` API is used to programmatically copy formatted HTML+text content to the clipboard.  
 *    - The copied content dynamically includes an anchor (`#id`) if the header element has an `id` attribute, otherwise defaults to the page URL.  
 *   
 * 3. Design Choices for Copy Icon:  
 *    - The copy button (`⧉`) was selected for minimalism and to blend with site designs. It uses inherited header styles for seamless integration.  
 *    - The positioning (5px margin) is kept modest to avoid disrupting the layout of any website.  
 *   
 * 4. DOM Mutation Observer:  
 *    - The script uses `MutationObserver` to handle headers that are added dynamically (e.g., websites built with frameworks like React, Vue, or Angular).  
 *    - The observer watches `childList` and `subtree` mutations so that the "copy" button attaches to dynamically loaded headers.  
 *   
 * 5. Areas for Future Improvement:  
 *    - Accessibility: The `⧉` icon itself is clickable, but it does not have an associated `aria-label` or `title` for screen readers. Adding these attributes may improve accessibility.  
 *    - CSS Styling: The notification style and the icon position could use customization for certain websites with conflicting designs.  
 *    - Handling Spaces: If headers contain excessive white space or formatting artifacts, additional cleanup logic can be added to extract cleaner text.  
 *    - Icon Customization: For more prominent visibility, a customizable icon image or text could be supported via runtime configuration.  
 */
(function () {
    'use strict';

    // Function to copy the header text and URL to the clipboard  
    async function copyHeader(headerElement, pageURL) {
        // Extract only the plain header text (excluding the "copy" button)  
        const headerText = headerElement.cloneNode(true); // Clone the header element  
        Array.from(headerText.querySelectorAll('.copy-icon')).forEach(icon => icon.remove()); // Remove the "copy" button  
        const plainText = headerText.textContent.trim(); // Extract clean text  

        // Check if the header has an ID, and append it to the URL as an anchor if present  
        const headerId = headerElement.id ? `#${headerElement.id}` : '';
        const fullURL = pageURL + headerId;

        // Create both plain text and HTML content for the clipboard  
        const mdContent = `[${plainText}](${fullURL})`; // Plain text format  
        const htmlContent = `<a href="${fullURL}">${plainText}</a>`; // Clickable hyperlink (HTML format)  

        try {
            // Copy the HTML link to the clipboard  
            // Use navigator.clipboard API to write both formats to the clipboard  
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/plain': new Blob([mdContent], { type: 'text/plain' }),
                    'text/html': new Blob([htmlContent], { type: 'text/html' }),
                })
            ]);
            // Show silent notification if successfully written  
            showSilentNotification('Copied successfully!');
        } catch (err) {
            // Handle errors gracefully if clipboard write fails  
            console.error('Clipboard error:', err);
            showSilentNotification('Failed to copy!');
        }
    }

    // Function to add the "copy" button next to headers  
    function addCopyIcons() {
        // Select all header tags on the page (h1, h2, h3, etc.)  
        const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        headers.forEach(header => {
            // Skip if the "copy" button is already added  
            if (header.querySelector('.copy-icon')) return;

            // Create the "copy" icon element  
            const copyIcon = document.createElement('span');
            copyIcon.textContent = '⧉'; // Unicode symbol for a simple link/copy action  
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.marginLeft = '5px'; // Minimal spacing  
            copyIcon.style.color = 'inherit'; // Inherit the color of the header for blending  
            copyIcon.style.fontSize = '0.8em'; // Small size to keep it subtle  
            copyIcon.style.opacity = '0.7'; // Slightly muted for aesthetics  
            copyIcon.className = 'copy-icon';

            // Add click handler  
            copyIcon.onclick = () => {
                const pageURL = window.location.href; // Get the current page URL  
                copyHeader(header, pageURL); // Copy header text with URL  
            };

            // Append the "copy" icon to the header  
            header.appendChild(copyIcon);
        });
    }

    // Silent notification system  
    function showSilentNotification(message) {
        // Create a temporary notification element  
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#292b2c';
        notification.style.color = 'white';
        notification.style.padding = '8px 12px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.3)';
        notification.style.fontSize = '0.9em';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0.9';

        // Append the notification to the body  
        document.body.appendChild(notification);

        // Automatically fade out the notification after 1.5 seconds  
        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 1500);
    }

    // Run the script when the DOM is loaded  
    document.addEventListener('DOMContentLoaded', addCopyIcons);

    // Observe changes to the DOM (for dynamically added headers)  
    const observer = new MutationObserver(addCopyIcons);
    observer.observe(document.body, { childList: true, subtree: true });
})();  
