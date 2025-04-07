document.addEventListener("DOMContentLoaded", function () {
    let urlParams = new URLSearchParams(window.location.search);
    let activeTab = urlParams.get("tab") || "hotels"; // Default to 'hotels'

    showTab(activeTab);

    // Update tab when a tab button is clicked
    document.querySelectorAll(".tab-button").forEach(button => {
        button.addEventListener("click", function () {
            let tabName = this.innerText.includes("Hotels") ? "hotels" : "bookings";
            updateURL(tabName);
            showTab(tabName);
        });
    });

    // Ensure pagination links retain the current tab
    updatePaginationLinks(activeTab);
});

function showTab(tabName) {
    // Hide all tab content
    document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");

    // Remove 'active' class from all buttons
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));

    // Show the correct tab
    document.getElementById(tabName).style.display = "block";

    // Mark the correct button as active
    document.querySelectorAll(".tab-button").forEach(btn => {
        if ((tabName === "hotels" && btn.innerText.includes("Hotels")) ||
            (tabName === "bookings" && btn.innerText.includes("Bookings"))) {
            btn.classList.add("active");
        }
    });
}

function updateURL(tabName) {
    let url = new URL(window.location);
    url.searchParams.set("tab", tabName);
    window.history.replaceState({}, "", url); // Update URL without reloading
}

function updatePaginationLinks(activeTab) {
    document.querySelectorAll(".pagination a").forEach(link => {
        let href = new URL(link.href);
        href.searchParams.set("tab", activeTab);
        link.href = href.toString();
    });
}
