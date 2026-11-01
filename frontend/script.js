const API_URL = "http://127.0.0.1:8000";

// DOM elements
const contactsBody = document.getElementById("contactsBody");
const searchInput = document.getElementById("searchInput");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const apiStatus = document.getElementById("apiStatus");
const countText = document.getElementById("countText");

let contacts = [];
let editingId = null;


// Get contact ID
function getId(contact) {
    return contact.contactId ?? contact.id;
}


// Get contact name
function getName(contact) {
    return contact.contactName ?? contact.name ?? "";
}


// Update API status
function setStatus(message, type = "") {
    apiStatus.textContent = message;
    apiStatus.className = `api-status ${type}`;
}


// Display form message
function showMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.className = isError
        ? "message error"
        : "message";
}


// Escape HTML to prevent injection
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


// Load contacts from API
async function loadContacts() {
    setStatus("Connecting…");

    try {
        const response = await fetch(`${API_URL}/contacts`);

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        contacts = Array.isArray(data) ? data : [];

        setStatus("Connected to API", "connected");
        renderContacts();

    } catch (error) {
        contacts = [];
        renderContacts();

        setStatus("API not connected", "error");

        contactsBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Could not load contacts.
                    Start FastAPI and check the API URL.
                </td>
            </tr>
        `;

        countText.textContent = "Showing 0 contacts";

        console.error("Loading contacts failed:", error);
    }
}


// Render contacts in the table
function renderContacts() {
    const query = searchInput.value.trim().toLowerCase();

    const filtered = contacts.filter(contact =>
        [
            getName(contact),
            contact.email,
            contact.phone,
            contact.address
        ].some(value =>
            String(value ?? "").toLowerCase().includes(query)
        )
    );

    if (!filtered.length) {
        contactsBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    ${
                        query
                            ? "No matching contacts found."
                            : "No contacts yet. Add your first contact below."
                    }
                </td>
            </tr>
        `;
    } else {
        contactsBody.innerHTML = filtered.map(contact => `
            <tr>
                <td>${escapeHTML(getId(contact))}</td>
                <td>${escapeHTML(getName(contact))}</td>
                <td>${escapeHTML(contact.email)}</td>
                <td>${escapeHTML(contact.phone)}</td>
                <td>${escapeHTML(contact.address ?? "")}</td>
                <td>
                    <div class="row-actions">
                        <button
                            class="action-btn edit-btn"
                            data-action="edit"
                            data-id="${escapeHTML(getId(contact))}">
                            <span class="action-icon">✎</span>Edit
                        </button>

                        <button
                            class="action-btn delete-btn"
                            data-action="delete"
                            data-id="${escapeHTML(getId(contact))}">
                            <span class="action-icon">▤</span>Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    countText.textContent =
        `Showing ${filtered.length} of ${contacts.length} contacts`;
}


// Reset form
function resetForm() {
    contactForm.reset();
    editingId = null;

    document.getElementById("formTitle").textContent =
        "Add New Contact";

    document.getElementById("submitText").textContent =
        "Save Contact";

    showMessage("");
}


// Fill form for editing
function fillForm(contact) {
    editingId = getId(contact);

    document.getElementById("contactName").value =
        getName(contact);

    document.getElementById("email").value =
        contact.email ?? "";

    document.getElementById("phone").value =
        contact.phone ?? "";

    document.getElementById("address").value =
        contact.address ?? "";

    document.getElementById("formTitle").textContent =
        "Edit Contact";

    document.getElementById("submitText").textContent =
        "Update Contact";

    showMessage("");

    document.getElementById("add-contact").scrollIntoView({
        behavior: "smooth"
    });
}


// Add or update contact
contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    const payload = {
        contactName: document.getElementById("contactName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address:
            document.getElementById("address").value.trim() || null
    };

    const isEditing = editingId !== null;

    const url = isEditing
        ? `${API_URL}/contact/${encodeURIComponent(editingId)}`
        : `${API_URL}/contact`;

    try {
        const response = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const detail = await response.json().catch(() => ({}));

            throw new Error(
                detail.detail || `Request failed (${response.status})`
            );
        }

        resetForm();

        showMessage(
            isEditing
                ? "Contact updated successfully."
                : "Contact added successfully."
        );

        await loadContacts();

    } catch (error) {
        showMessage(error.message || "Could not save contact.", true);
        console.error("Saving contact failed:", error);
    }
});


// Handle edit and delete buttons
contactsBody.addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;

    const contact = contacts.find(
        item => String(getId(item)) === String(id)
    );

    if (!contact) return;

    // Edit contact
    if (button.dataset.action === "edit") {
        fillForm(contact);
        return;
    }

    // Delete contact
    if (button.dataset.action === "delete") {
        if (!confirm(
            `Delete ${getName(contact)}? This cannot be undone.`
        )) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/contact/${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                const detail = await response.json().catch(() => ({}));

                throw new Error(
                    detail.detail || `Delete failed (${response.status})`
                );
            }

            if (String(editingId) === String(id)) {
                resetForm();
            }

            await loadContacts();

        } catch (error) {
            alert(error.message || "Could not delete contact.");
            console.error("Deleting contact failed:", error);
        }
    }
});


// Search contacts
searchInput.addEventListener("input", renderContacts);


// Cancel form
document.getElementById("cancelBtn").addEventListener("click", resetForm);


// Show add contact form
document.getElementById("showFormBtn").addEventListener("click", () => {
    resetForm();

    document.getElementById("add-contact").scrollIntoView({
        behavior: "smooth"
    });
});


// Add contact navigation
document.getElementById("addNav").addEventListener("click", () => {
    resetForm();

    document.getElementById("add-contact").scrollIntoView({
        behavior: "smooth"
    });
});


// Initial load
loadContacts();