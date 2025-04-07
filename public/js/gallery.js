document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".image-grid img");
    const showMore = document.querySelector(".show-more");
    let modal = document.createElement("div");
    modal.classList.add("modal");
    document.body.appendChild(modal);

    let currentIndex = 0;

    function showImage(index) {
        let imgElement = images[index];
        let imageUrl = imgElement.dataset.src || imgElement.src;

        if (!imgElement.src) {
            imgElement.src = imgElement.dataset.src; // Ensure the image loads
            imgElement.removeAttribute("data-src");
        }

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="${imageUrl}" alt="Large View">
                <button class="prev">&#10094;</button>
                <button class="next">&#10095;</button>
            </div>
        `;
        modal.style.display = "flex";

        document.querySelector(".close").addEventListener("click", () => {
            modal.style.display = "none";
        });

        document.querySelector(".prev").addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        document.querySelector(".next").addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });
    }

    images.forEach((img, index) => {
        img.addEventListener("click", () => {
            currentIndex = index;
            showImage(currentIndex);
        });
    });

    if (showMore) {
        showMore.addEventListener("click", () => {
            images[5].click();
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
