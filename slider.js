class ImageSlider {

    constructor(selector) {

        this.slider = document.querySelector(selector);

        if (!this.slider) {
            return;
        }

        this.track = this.slider.querySelector(".slider-track");

        this.originalSlides =
            Array.from(this.track.querySelectorAll(".slide"));

        this.nextButton =
            this.slider.querySelector(".next");

        this.previousButton =
            this.slider.querySelector(".prev");

        this.dotsContainer =
            this.slider.querySelector(".slider-dots");

        this.currentIndex = 1;

        this.isMoving = false;

        this.autoSlide = null;

        this.createClones();

        this.createDots();

        this.updatePosition(false);

        this.updateDots();

        this.addEvents();

        this.startAutoSlide();
    }


    createClones() {

        const firstSlide =
            this.originalSlides[0].cloneNode(true);

        const lastSlide =
            this.originalSlides[
                this.originalSlides.length - 1
            ].cloneNode(true);

        firstSlide.classList.add("clone");

        lastSlide.classList.add("clone");

        this.track.appendChild(firstSlide);

        this.track.insertBefore(
            lastSlide,
            this.track.firstChild
        );

        this.slides =
            Array.from(
                this.track.querySelectorAll(".slide")
            );
    }


    updatePosition(animate = true) {

        if (animate) {

            this.track.style.transition =
                "transform 0.5s ease-in-out";

        } else {

            this.track.style.transition = "none";
        }

        const position =
            -this.currentIndex * 100;

        this.track.style.transform =
            `translateX(${position}%)`;
    }


    nextSlide() {

        if (this.isMoving) {
            return;
        }

        this.isMoving = true;

        this.currentIndex++;

        this.updatePosition(true);

        this.updateDots();
    }


    previousSlide() {

        if (this.isMoving) {
            return;
        }

        this.isMoving = true;

        this.currentIndex--;

        this.updatePosition(true);

        this.updateDots();
    }


    createDots() {

        this.dotsContainer.innerHTML = "";

        this.originalSlides.forEach((slide, index) => {

            const dot =
                document.createElement("button");

            dot.classList.add("dot");

            dot.type = "button";

            dot.setAttribute(
                "aria-label",
                `Go to slide ${index + 1}`
            );

            dot.addEventListener("click", () => {

                if (this.isMoving) {
                    return;
                }

                this.currentIndex = index + 1;

                this.updatePosition(true);

                this.updateDots();

                this.isMoving = true;
            });

            this.dotsContainer.appendChild(dot);
        });

        this.dots =
            Array.from(
                this.dotsContainer.querySelectorAll(".dot")
            );
    }


    updateDots() {

        let index =
            this.currentIndex - 1;

        if (index < 0) {
            index =
                this.originalSlides.length - 1;
        }

        if (
            index >=
            this.originalSlides.length
        ) {
            index = 0;
        }

        this.dots.forEach((dot, dotIndex) => {

            dot.classList.toggle(
                "active",
                dotIndex === index
            );
        });
    }


    handleTransitionEnd() {

        if (
            this.currentIndex ===
            this.slides.length - 1
        ) {

            this.currentIndex = 1;

            this.updatePosition(false);
        }


        if (this.currentIndex === 0) {

            this.currentIndex =
                this.originalSlides.length;

            this.updatePosition(false);
        }

        this.updateDots();

        this.isMoving = false;
    }


    startAutoSlide() {

        this.stopAutoSlide();

        this.autoSlide =
            setInterval(() => {

                this.nextSlide();

            }, 5000);
    }


    stopAutoSlide() {

        if (this.autoSlide !== null) {

            clearInterval(this.autoSlide);

            this.autoSlide = null;
        }
    }


    addEvents() {

        this.nextButton.addEventListener(
            "click",
            () => {

                this.stopAutoSlide();

                this.nextSlide();

                this.startAutoSlide();
            }
        );


        this.previousButton.addEventListener(
            "click",
            () => {

                this.stopAutoSlide();

                this.previousSlide();

                this.startAutoSlide();
            }
        );


        this.track.addEventListener(
            "transitionend",
            () => {

                this.handleTransitionEnd();
            }
        );


        this.slider.addEventListener(
            "mouseenter",
            () => {

                this.stopAutoSlide();
            }
        );


        this.slider.addEventListener(
            "mouseleave",
            () => {

                this.startAutoSlide();
            }
        );
    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        new ImageSlider(".slider");

    }
);