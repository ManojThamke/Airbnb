document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.querySelector(".user-icon");
    const dropdown = document.querySelector(".dropdown-content");

    userIcon.addEventListener("click", () => {
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
        if (!userIcon.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });
});
