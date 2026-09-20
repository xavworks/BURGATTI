/* =========================================
   VELOCITY MOTORS — MAIN JAVASCRIPT
========================================= */


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .model-card, .performance-item, .tech-item, .contact-content"
);

revealElements.forEach((element, index) => {

    element.classList.add("reveal");

    element.style.transitionDelay = `${index * 0.08}s`;

});


const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");

            revealObserver.unobserve(entry.target);

        });

    },
    {
        threshold: 0.15
    }
);


revealElements.forEach((element) => {

    revealObserver.observe(element);

});



/* =========================================
   NAVBAR SCROLL
========================================= */

const navbar = document.querySelector(".navbar");

let scrollTicking = false;


window.addEventListener(
    "scroll",
    () => {

        if (scrollTicking) {
            return;
        }

        scrollTicking = true;


        requestAnimationFrame(() => {

            if (navbar) {

                if (window.scrollY > 50) {
                    navbar.classList.add("scrolled");
                } else {
                    navbar.classList.remove("scrolled");
                }

            }

            scrollTicking = false;

        });

    },
    {
        passive: true
    }
);



/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");


if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle("active");

        }
    );


    navLinks
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove("active");

                }
            );

        });

}



/* =========================================
   PERFORMANCE NUMBER REVEAL
========================================= */

const performanceItems =
    document.querySelectorAll(".performance-item");


const performanceObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add(
                    "number-visible"
                );

                performanceObserver.unobserve(
                    entry.target
                );

            });

        },
        {
            threshold: 0.3
        }
    );


performanceItems.forEach((item) => {

    performanceObserver.observe(item);

});



/* =========================================
   HERO PARALLAX
========================================= */

const hero =
    document.querySelector(".hero");

const heroContent =
    document.querySelector(".hero-content");


if (
    hero &&
    heroContent &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationFrame = null;


    const animateParallax = () => {

        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;


        heroContent.style.transform =
            `translate(${currentX}px, ${currentY}px)`;


        if (
            Math.abs(mouseX - currentX) > 0.01 ||
            Math.abs(mouseY - currentY) > 0.01
        ) {

            animationFrame =
                requestAnimationFrame(
                    animateParallax
                );

        } else {

            animationFrame = null;

        }

    };


    hero.addEventListener(
        "mousemove",
        (event) => {

            mouseX =
                (event.clientX / window.innerWidth - 0.5) * 16;

            mouseY =
                (event.clientY / window.innerHeight - 0.5) * 12;


            if (!animationFrame) {

                animationFrame =
                    requestAnimationFrame(
                        animateParallax
                    );

            }

        },
        {
            passive: true
        }
    );


    hero.addEventListener(
        "mouseleave",
        () => {

            mouseX = 0;
            mouseY = 0;


            if (!animationFrame) {

                animationFrame =
                    requestAnimationFrame(
                        animateParallax
                    );

            }

        }
    );

}