let controller;
let slideScene;
let pageScene;

//? Landing Page Animations
function animateSlide() {
    //* Initialize the contrller
    controller = new ScrollMagic.Controller();
    //* Select some stuffs
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');
    //* Loop over each slide
    sliders.forEach((slide, slides, index) => {
        const revealImg = slide.querySelector('.reveal-img');
        const revealText = slide.querySelector('.reveal-text');
        const img = slide.querySelector('img');
        //* Adding GSAP
        const slideTimeline = gsap.timeline({
            defaults: {duration: 1, ease: "power1.out"}
        });
        // 
        window.scrollTo(0, 0);
        slideTimeline.fromTo(revealImg, {x: "0%"}, {x: "100%"});
        slideTimeline.fromTo(img, {scale: 2}, {scale: 1}, "-=1")
        slideTimeline.fromTo(revealText, {x: "0%"}, {x: "100%"}, "-=0.75");
        slideTimeline.fromTo(nav, {y: "-100%"}, {y: "0%"}, "-=1.2");
        //* Create the scene
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            reverse: false,
            triggerHook: 0.25
        })
            // .addIndicators({
            //     colorStart: 'white',
            //     colorTrigger: 'white',
            //     name: 'slide'
            // })
            .setTween(slideTimeline)
            .addTo(controller)

        //* Create a new animation
        const pageTimeline = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
        // 
        pageTimeline.fromTo(nextSlide, {y: "0%"}, {y: "70%"});
        pageTimeline.fromTo(slide, {opacity: 1, scale: 1}, {opacity: 0, scale: 0.5});
        pageTimeline.fromTo(nextSlide, {y: "70%"}, {y: "0%"}, "-=0.5");
        //* Create a scene for the new animation
        pageScene = new ScrollMagic.Scene({
            triggerHook: 0,
            triggerElement: slide,
            duration: "100%"
        })
            // .addIndicators({
            //     colorStart: 'white',
            //     colorTrigger: 'white',
            //     name: 'slide'
            // })
            .setTween(pageTimeline)
            .setPin(slide, {pushFollowers: false})
            .addTo(controller)   
    });
};

//? Circular Cursor
const mouse = document.querySelector('.cursor');
const mouseText = mouse.querySelector('.cursor-text');
const burger = document.querySelector('.burger');

function cursor(e) {
    mouse.style.top = e.pageY + 'px';
    mouse.style.left = e.pageX + 'px';
};

function activeCursor(e) {
    const item = e.target;
    //* For the navbar
    if (item.id === 'logo' || item.classList.contains('burger')) {
        mouse.classList.add('nav-active');
    } else {
        mouse.classList.remove('nav-active');
    }

    //* For the explore button
    if (item.classList.contains('explore')) {
        mouse.classList.add('explore-active');
        mouseText.innerText = 'Tap';
        gsap.to('.title-swipe', 1, {y: "0%"});
    } else {
        mouse.classList.remove('explore-active');
        mouseText.innerText = '';
        gsap.to('.title-swipe', 1, {y: "100%"}); 
    }
};

//? Display nav items
function navToggle(e) {
    const item = e.target; 
    if (!item.classList.contains('active')) {
        item.classList.add('active');
        gsap.to('.line1', 0.3, {rotate: "45", y: "5", backgroundColor: "black"})
        gsap.to('.line2', 0.3, {rotate: "-45", y: "-5", backgroundColor: "black"});
        gsap.to('.line3', 0.3, {opacity: 0});
        gsap.to('#logo', {color: "black"}, "-=0.5");
        gsap.to('.nav-bar', 0.8, {clipPath: "circle(2500px at 100% -10% )"});
        document.body.classList.add('hide');

    } else {
        item.classList.remove('active');
        gsap.to('.line1', 0.3, {rotate: "0", y: "0", backgroundColor: "white"})
        gsap.to('.line2', 0.3, {rotate: "-0", y: "-0", backgroundColor: "white"});
        gsap.to('.line3', 0.3, {opacity: 1});
        gsap.to('#logo', {color: "white"}, "-=0.5");
        gsap.to('.nav-bar', 0.8, {clipPath: "circle(50px at 100% -10% )"});
        document.body.classList.remove('hide');
    } 
};

//? Page Transition
const logo = document.querySelector('#logo');

barba.init({
    views: [
        {
            namespace: "home",
            beforeEnter(){
                animateSlide();
                logo.href = "./index.html"
            },
            beforeLeave(){
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
            }
        },
        {
            namespace: "mountain",
            beforeEnter(){
                mountainSlide();
                logo.href = "../index.html";
            },
            beforeLeave(){
                mountScene.destroy();
                controller.destroy();
            }
        },
        {
            namespace: "hike",
            beforeEnter(){
                hikeSlide();
                logo.href = "../index.html";
            },
            beforeLeave(){
                hikeScene.destroy();
                controller.destroy();
            }
        },
        {
            namespace: "fashion",
            beforeEnter() {
                fashionSlide();
                logo.href = "../index.html";
            },
            beforeLeave(){
                fashionScene.destroy();
                controller.destroy();
            }
        }
    ],
    transitions: [
        {
            leave({current, next}){
                let done = this.async();
                //* An Animation
                const tl = gsap.timeline(
                    {defaults: {ease: 'power2.inOut'}}
                );
                tl.fromTo(current.container, 0.6, {opacity: 1}, {opacity: 0});
                tl.fromTo('.swipe', 0.5, {x: "-100%"}, {x: "0%", onComplete: done}, "-=0.5");

            },
            enter({current, next}){
                let done = this.async();
                //* Scroll to the top
                window.scrollTo(0, 0);
                //* An Animation
                const tl = gsap.timeline(
                    {defaults: {ease: 'power2.inOut'}}
                );
                tl.fromTo(next.container, 0.6, {opacity: 0}, {opacity: 1});
                tl.fromTo('.swipe', 0.4, {x: "0%"}, {x: "100%", stagger: 0.3, onComplete: done});
                tl.fromTo('.nav-header', 1, {y:"-100%"}, {y:"0%", ease: "power1.out"}, "-=1.5");
            }

        }
    ]
});

//* Mountain Page Scroll Animation
function mountainSlide() {
    controller = new ScrollMagic.Controller();
    const mountSlide = document.querySelectorAll('.mountain-slide');

    //* Loop over the slides
    mountSlide.forEach((slide) => {
        const mountImg = slide.querySelector('.mountain-hero-img');
        const mountDesc = slide.querySelector('.mountain-hero-desc');
        const slideOne = slide.querySelector('.slide-1');
        const slideTwo = slide.querySelector('.slide-2');
        const slideThree = slide.querySelector('.slide-3');
        //* Adding GSAP
        const slideTl = gsap.timeline({
            defaults: {ease: 'slow(1, 1)'}
        });

        window.scrollTo(0, 0); 
        slideTl.from(mountImg, 2.1, {x: "-100%", opacity: 0}, {x: "0%", opacity: 1});
        slideTl.from(mountDesc, 2.1, {x: "80%", opacity: 0}, {x: "0%", opacity: 1});
        slideTl.fromTo(slideOne, 0.8, {y: "100%", opacity: 0}, {y: "0%", opacity: 1}, "-=1.2");
        slideTl.fromTo(slideTwo, 0.8, {y: "100%", opacity: 0}, {y: "0%", opacity: 1}, "-=1.4");
        slideTl.fromTo(slideThree, 0.8, {y: "100%", opacity: 0}, {y: "0%", opacity: 1}, "-=1.5");

        mountScene = new ScrollMagic.Scene({
            triggerElement: slide,
            reverse: false,
            triggerHook: 0.19,
        })
            .setTween(slideTl)
            // .addIndicators({
            //     colorStart: 'white',
            //     colorTrigger: 'white',
            //     name: 'slide'
            // })
            .addTo(controller)
    });

};

//* Hike Page Scroll Animation
function hikeSlide(){
    controller = new ScrollMagic.Controller();
    const hkSlide = document.querySelectorAll('.hike-slide');
    // 
    hkSlide.forEach((slide) => {
        const hikeImg = slide.querySelector('.hike-img');
        const hikeText = slide.querySelector('.hike-text');
        const hikeNo = slide.querySelector('.hike-no');
        // 
        const slideTl = gsap.timeline({
            defaults: {duration: 0.9, ease: 'slow(1, 1)'}
        });
        // 
        window.scrollTo(0, 0); 
        slideTl.from(hikeText,  {opacity: 0, x: "-100%"}, {opacity: 1, x: "0%"});
        slideTl.from(hikeImg,  {opacity: 0, x: "100%"}, {opacity: 1, x: "0%"});
        slideTl.from(hikeNo, {opacity: 0}, {opacity: 1}, "-=1.5");

        fashionScene = new ScrollMagic.Scene({
            triggerElement: slide,
            // reverse: false,
            triggerHook: 0.19,
        })
            .setTween(slideTl)
            // .addIndicators({
            //     colorStart: 'white',
            //     colorTrigger: 'white',
            //     name: 'slide'
            // })
            .addTo(controller)
    });
};

//* Fashion Page Scroll Animation
function fashionSlide(){
    controller = new ScrollMagic.Controller();
    const fshSlide = document.querySelectorAll('.fashion-slide');
    // 
    fshSlide.forEach((slide) => {
        const fashionImg = slide.querySelector('.fashion-img');
        const fashionText = slide.querySelector('.fashion-text');
        const fashionNo = slide.querySelector('.fashion-no');
        // 
        const slideTl = gsap.timeline({
            defaults: {duration: 0.9, ease: 'slow(1, 1)'}
        });
        // 
        window.scrollTo(0, 0); 
        slideTl.from(fashionText,  {opacity: 0, x: "-100%"}, {opacity: 1, x: "0%"});
        slideTl.from(fashionImg,  {opacity: 0, x: "100%"}, {opacity: 1, x: "0%"});
        slideTl.from(fashionNo, {opacity: 0}, {opacity: 1}, "-=1.5");

        fashionScene = new ScrollMagic.Scene({
            triggerElement: slide,
            // reverse: false,
            triggerHook: 0.15,
        })
            .setTween(slideTl)
            // .addIndicators({
            //     colorStart: 'white',
            //     colorTrigger: 'white',
            //     name: 'slide'
            // })
            .addTo(controller)
    });
};

//? Event Listeners
burger.addEventListener('click', navToggle);
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);