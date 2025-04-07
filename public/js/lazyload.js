document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll(".lazy");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute("data-src"); // Cleanup for performance
                    }
                    img.classList.remove("lazy");
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => observer.observe(img));
    } else {
        // Fallback for older browsers
        const lazyLoadFallback = () => {
            lazyImages.forEach(img => {
                if (img.dataset.src && img.getBoundingClientRect().top < window.innerHeight) {
                    img.src = img.dataset.src;
                    img.removeAttribute("data-src");
                    img.classList.remove("lazy");
                }
            });
        };

        window.addEventListener("scroll", lazyLoadFallback);
        window.addEventListener("resize", lazyLoadFallback);
        lazyLoadFallback(); // Load visible images on page load
    }
});
