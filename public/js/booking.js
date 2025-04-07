document.addEventListener("DOMContentLoaded", () => {
    const bookingButton = document.querySelector("#bookingButton");

    if (!bookingButton) {
        console.error("Booking button not found!");
        return;
    }

    bookingButton.addEventListener("click", async (event) => {
        event.preventDefault();

        // Disable button to prevent duplicate submissions
        if (bookingButton.disabled) return;
        bookingButton.disabled = true;

        const hotelId = document.querySelector("#hotelId")?.value;
        const checkIn = document.querySelector("#checkIn")?.value;
        const checkOut = document.querySelector("#checkOut")?.value;
        const guests = document.querySelector("#guests")?.value;
        const paymentMethod = document.querySelector("#paymentMethod")?.value;

        if (!hotelId || !checkIn || !checkOut || !guests || !paymentMethod) {
            alert("All fields are required!");
            bookingButton.disabled = false;
            return;
        }

        const token = getCookie("accessToken"); // Get token from cookies

        console.log("[DEBUG] Frontend Retrieved Token:", token); // Log for debugging

        if (!token) {
            alert("You need to log in first!");
            bookingButton.disabled = false;
            return;
        }

        try {
            const response = await fetch("/bookings/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Send token in request
                },
                body: JSON.stringify({ hotelId, checkIn, checkOut, guests, paymentMethod }),
                credentials: "include" // Ensure cookies are sent
            });

            const data = await response.json();

            if (response.ok) {
                alert("Booking successful!");
                window.location.href = "/"; 
            } else {
                alert(`Error: ${data.message || "Something went wrong!"}`);
            }
        } catch (error) {
            console.error("Booking failed:", error);
            alert("An error occurred while booking. Try again.");
        } finally {
            bookingButton.disabled = false; // Re-enable button after request
        }
    });
});

// Function to get JWT token from cookies
function getCookie(name) {
    const cookieString = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return cookieString ? decodeURIComponent(cookieString.split('=')[1]) : null;
}
