const HtmlNavOverlay = document.getElementById("myNav");
const menu = document.getElementById('menu');
const addButton = document.getElementById('addButton');

function toggleNav() {
    HtmlNavOverlay.classList.toggle("Show");
}

function Nav() {
    toggleNav();
}

// Add predefined options
const predefinedOptions = ['Option 1', 'Option 2', 'Option 3'];
predefinedOptions.forEach(option => addMenuItem(option));

// Function to add a new option
function addOption() {
    const newOption = prompt('Enter a new option:');
    if (newOption) {
        addMenuItem(newOption);
    }
}

// Function to add a menu item
function addMenuItem(text) {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    menuItem.textContent = text;
    menu.insertBefore(menuItem, menu.firstChild);

    let startX; // Variable to store the initial touch position

    // Add touchstart event listener to store the initial touch position
    menuItem.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    });

    // Add touchmove event listener to detect the swipe gesture
    menuItem.addEventListener('touchmove', function (e) {
        const currentX = e.touches[0].clientX;
        const distance = currentX - startX;

        // Check if the swipe distance is greater than a threshold (adjust as needed)
        if (Math.abs(distance) > 50) {
            // If swiped, add the 'remove' class and remove the element after the animation
            menuItem.classList.add('remove');
            toggleNav();
            // Remove the element from the DOM after the animation completes
            setTimeout(() => menu.removeChild(menuItem), 500);
        }
    });

    // Add click event listener for removal (fallback for non-swipe removal)
    menuItem.addEventListener('oncontextmenu', function () {
        menuItem.classList.add('remove');
        toggleNav();
        // Remove the element from the DOM after the animation completes
        setTimeout(() => menu.removeChild(menuItem), 500);
    });
}

addButton.addEventListener('click', addOption);
