/**
 * PASSWORD MANAGER APPLICATION
 * =============================
 * A simple browser-based password manager that stores passwords in localStorage.
 *
 * Features:
 * - Add new passwords
 * - View all saved passwords
 * - Copy passwords to clipboard
 * - Delete password entries
 *
 * Note: This uses localStorage which is NOT encrypted. Do not use for real passwords!
 */

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

/**
 * Display all saved passwords in the table
 * Retrieves passwords from localStorage and renders them in HTML table format
 * If no passwords exist, shows "No Data to Show" message
 */

// Function to display a temporary toast notification
function showToast(message) {

  // Get the toast element from the page
  const toast = document.getElementById("toast");

  // Set the message text inside the toast
  toast.textContent = message;

  // Add the "show" class to make the toast visible
  toast.classList.add("show");

  // After 2.5 seconds, remove the "show" class to hide the toast again
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function showPasswords() {
  // Get the table element from DOM
  const tb = document.querySelector("table");
  // Retrieve password data from localStorage
  const data = localStorage.getItem("passwords");
  // Check if localStorage has no data
  if (data === null) {
    // Display empty state with table headers
    tb.innerHTML = `<tr><th>Website</th><th>Username</th><th>Password</th><th>Delete</th></tr>
                    <tr><td colspan="4">No Data to Show</td></tr>`;
  } else {
    // Parse the JSON string from localStorage to JavaScript array
    const arr = JSON.parse(data);
    // Check if array is empty
    if (arr.length === 0) {
      tb.innerHTML = `<tr><th>Website</th><th>Username</th><th>Password</th><th>Delete</th></tr>
                      <tr><td colspan="4">No Data to Show</td></tr>`;
    } else {
      // Build table with all password entries
      let str = `<tr><th>Website</th><th>Username</th><th>Password</th><th>Delete</th></tr>`;
      // Loop through each password entry
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        // Mask the password with asterisks for security
        const maskedPassword = "*".repeat(element.password.length);
        // Create table row for this password entry
        str += `<tr>
              <td id="website-${index}">${element.website}
                  <button onclick="copyField('website-${index}')"><i class="fa-solid fa-copy"></i></button>
              </td>
              <td id="username-${index}">${element.username}
                  <button onclick="copyField('username-${index}')"><i class="fa-solid fa-copy"></i></button>
              </td>
              <td id="password-${index}" class="password-cell" data-realpassword="${element.password}">
                  <span class="masked">${"*".repeat(element.password.length)}</span>
                  <span class="visible">${element.password}</span>
                  <button class="view-btn" onclick="togglePassword(${index})"><i class="fa-solid fa-eye"></i></button>
                  <button class="copy-btn" onclick="copyField('password-${index}')"><i class="fa-solid fa-copy"></i></button>
              </td>
              <td>
                  <button onclick="deletePassword(${index})"><i class="fa-solid fa-trash"></i></button>
              </td>
          </tr>`;
      }
      // Set the table's HTML content
      tb.innerHTML = str;
    }
  }
}

// Function to toggle password visibility for a specific table row
function togglePassword(index) {
  // Get the password cell for this row
  const cell = document.getElementById(`password-${index}`);

  // Select the masked (****) and visible (actual password) span elements
  const masked = cell.querySelector(".masked");
  const visible = cell.querySelector(".visible");

  // Select the eye icon inside the toggle button
  const icon = cell.querySelector(".view-btn i");

  // Determine whether the password is currently hidden
  const isHidden = visible.style.display !== "inline";

  if (isHidden) {
    // ---- Show password ----
    visible.style.display = "inline";    // Show actual password text
    masked.style.display = "none";       // Hide asterisks
    icon.classList.remove("fa-eye");     // Switch icon from 'eye'
    icon.classList.add("fa-eye-slash");  // to 'eye-slash'
    showToast("Password Revealed");      // Optional toast message
  } else {
    // ---- Hide password ----
    visible.style.display = "none";      // Hide actual password text
    masked.style.display = "inline";     // Show asterisks again
    icon.classList.remove("fa-eye-slash"); // Switch icon back
    icon.classList.add("fa-eye");          // to 'eye'
    showToast("Password Hidden");        // Optional toast message
  }
}


// ============================================================================
// DELETE FUNCTION
// ============================================================================

/**
 * Delete a password entry at the specified index
 * @param {number} index - The index of the password to delete in the array
 */
// Function to delete a password entry based on its index
function deletePassword(index) {

  // Retrieve existing passwords from localStorage.
  // If nothing is stored yet, use an empty array.
  let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

  // Remove the password entry at the given index.
  // splice(index, 1) removes exactly one item.
  passwords.splice(index, 1);

  // Save the updated password list back to localStorage
  localStorage.setItem("passwords", JSON.stringify(passwords));

  // Notify user that a password entry was deleted
  showToast("Password entry deleted");

  // Refresh the table to show updated data
  showPasswords();
}


// ============================================================================
// COPY FUNCTION
// ============================================================================

/**
 * Copy text from a specific field to clipboard
 * For password fields, it copies the actual password (not the masked version)
 * @param {string} id - The element ID to copy from
 */
// Function to copy a field's text content (website, username, or password)
function copyField(id) {

    // Get the element using the provided ID
    const elem = document.getElementById(id);

    // Retrieve the actual password if this is a password field
    const realPassword = elem.getAttribute("data-realpassword");

    // Determine what text should be copied:
    // If the ID starts with "password-", copy the real password.
    // Otherwise, copy the element's visible text (trimmed).
    let text = id.startsWith("password-") 
        ? realPassword 
        : elem.textContent.trim();

    // Copy the selected text to the clipboard
    navigator.clipboard.writeText(text)
        .then(() => showToast("Copied: " + text))   // Show success toast
        .catch(() => alert("Copy failed"));         // Handle copy failure
}



// ============================================================================
// FORM SUBMISSION HANDLER
// ============================================================================

/**
 * Handle form submission to add new password
 * Prevents default form submission and saves data to localStorage
 */
document.querySelector("form").addEventListener("submit", function (e) {
  // Prevent default form submission (page reload)
  e.preventDefault();

  // Get values from form inputs
  const website = document.getElementById("website").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Retrieve existing passwords from localStorage
  let passwords = localStorage.getItem("passwords");
  let json;

  if (passwords) {
    // If passwords exist, parse the JSON string to array
    json = JSON.parse(passwords);
  } else {
    // If no passwords exist, create empty array
    json = [];
  }

  // Add new password object to array
  json.push({ website, username, password });

  // Save updated array back to localStorage as JSON string
  localStorage.setItem("passwords", JSON.stringify(json));

  // Show success message
  showToast("Password Saved");

  // Refresh the table to show new password
  showPasswords();

  // Clear form inputs after saving
  document.getElementById("website").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
});

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initial load - Display passwords when page loads
 * This runs immediately when the script is loaded
 */
showPasswords();
