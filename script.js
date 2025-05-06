

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            // Optional: Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- Smooth Scrolling & Active Link Highlighting ---
    const scrollLinks = document.querySelectorAll('.scroll-link');

    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - (header ? header.offsetHeight : 0); // Adjust for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active link (simple version for click)
                navLinks.forEach(nav => nav.classList.remove('active'));
                 // Find the corresponding nav link (might need adjustment if scroll-link is not a nav-link)
                const correspondingNavLink = document.querySelector(`.nav-link[href="${targetId}"]`);
                if(correspondingNavLink) correspondingNavLink.classList.add('active');
            }
        });
    });

     // --- Active link highlighting on scroll ---
     const sections = document.querySelectorAll('section[id]'); // Select sections with IDs
     window.addEventListener('scroll', navHighlighter);

     function navHighlighter() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - (header ? header.offsetHeight + 50 : 50); // Adjusted threshold
            const sectionId = current.getAttribute('id');
            const navLinkForSection = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

            if (navLinkForSection) { // Check if the nav link exists
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinkForSection.classList.add('active');
                } else {
                    navLinkForSection.classList.remove('active');
                }
            }
        });
     }


    // --- Portfolio Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    item.style.display = 'none'; // Hide all items initially
                    item.style.opacity = '0';    // For fade effect
                    item.style.transform = 'scale(0.9)'; // For scale effect

                    if (item.classList.contains(filterValue.replace('.', '')) || filterValue === '*') {
                        // Use setTimeout for staggered animation effect
                        setTimeout(() => {
                            item.style.display = 'block';
                             // Trigger reflow to restart animation
                            void item.offsetWidth;
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100); // Small delay for fade/scale in
                    }
                });
            });
        });
        // Trigger the 'All' filter initially if needed
        // document.querySelector('.filter-btn[data-filter="*"]').click();
    }


    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    let currentImageIndex = 0;
    let currentGalleryItems = []; // To store items of the currently visible gallery

    portfolioItems.forEach((item, index) => {
        const link = item.querySelector('a[data-lightbox]');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Filter items based on the current filter selection
                const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || '*';
                 currentGalleryItems = [];
                 portfolioItems.forEach(pItem => {
                      const itemLink = pItem.querySelector('a[data-lightbox]');
                      if(itemLink && (activeFilter === '*' || pItem.classList.contains(activeFilter.replace('.','')))) {
                        currentGalleryItems.push(itemLink);
                      }
                 });

                 // Find the index within the *filtered* gallery
                 currentImageIndex = currentGalleryItems.findIndex(galleryLink => galleryLink === link);

                showLightbox(currentImageIndex);
            });
        }
    });

    function showLightbox(index) {
        if (index < 0 || index >= currentGalleryItems.length) return;

        const link = currentGalleryItems[index];
        lightboxImg.setAttribute('src', link.getAttribute('href'));
        lightboxCaption.textContent = link.getAttribute('data-title') || '';
        currentImageIndex = index;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }

    function showPrevImage() {
        showLightbox((currentImageIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length);
    }

    function showNextImage() {
        showLightbox((currentImageIndex + 1) % currentGalleryItems.length);
    }

    if(lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        // Close lightbox on clicking the background overlay
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- Back to Top Button ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show after scrolling 300px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }

    // --- Scroll Animations ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
         // Optional: remove class if you want animation to repeat on scroll up
        // element.classList.remove('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.15)) { // Adjust dividend for trigger point
                displayScrollElement(el);
            } else {
                // hideScrollElement(el); // Optional: Hide if scrolled out of view upwards
            }
        });
    };

    window.addEventListener('scroll', handleScrollAnimation);
    // Initial check in case elements are already in view on load
    handleScrollAnimation();

    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
