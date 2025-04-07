document.addEventListener("DOMContentLoaded", function () {
    const cancelButtons = document.querySelectorAll(".cancel-btn");

    cancelButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const bookingId = this.dataset.id;

            if (confirm("Are you sure you want to cancel this booking?")) {
                try {
                    const response = await fetch(`/bookings/${bookingId}`, {
                        method: "DELETE"
                    });

                    if (response.ok) {
                        alert("Booking canceled successfully.");
                        location.reload();
                    } else {
                        const result = await response.json();
                        alert(`Error: ${result.message}`);
                    }
                } catch (error) {
                    console.error("Error canceling booking:", error);
                    alert("An error occurred. Please try again.");
                }
            }
        });
    });
});
