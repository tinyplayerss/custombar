document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener("scroll", revealSections);

    function revealSections() {
        var sections = document.querySelectorAll(".animated-section");
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var sectionTop = section.getBoundingClientRect().top;

            if (sectionTop <= window.innerHeight - 100) {
                section.classList.add("section-visible");
            }
        }
    }

    revealSections();
});