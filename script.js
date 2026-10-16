// ==========================================
// 1. REPLACE THE LINK BELOW WITH YOUR GOOGLE WEB APP URL
// ==========================================
const scriptURL = 'https://script.google.com/macros/s/AKfycbw7AQSwy2tP6nWZ1V13zRUGKiaJS8yOaFT-ah743HUjP-OjFPiJbzODxJcq_bJNwG_V/exec';
// ==========================================

const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const landingPage = document.getElementById('landing-page');
const formPage = document.getElementById('form-page');
const thankYouPage = document.getElementById('thank-you-page');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const form = document.forms['submit-to-google-sheet'];
const submitBtn = document.getElementById('submit-btn');
const detailsBackdrop = document.getElementById('project-details-backdrop');
const detailName = document.getElementById('detail-name');
const detailLocation = document.getElementById('detail-location');
const detailDescription = document.getElementById('detail-description');
const detailHighlights = document.getElementById('detail-highlights');
const selectedProjectInput = document.getElementById('selected-project');
const enquireProjectBtn = document.getElementById('enquire-project');

// Transition to form page
function openFormPage() {
    landingPage.classList.remove('active');
    landingPage.classList.add('hidden');
    formPage.classList.remove('hidden');
    formPage.classList.add('active');
}

startBtn.addEventListener('click', openFormPage);

// Form page Back Button
backBtn.addEventListener('click', () => {
    formPage.classList.remove('active');
    formPage.classList.add('hidden');

    landingPage.classList.remove('hidden');
    landingPage.classList.add('active');
});

// Thank You Page Back Button (Return to Home)
backToHomeBtn.addEventListener('click', () => {
    thankYouPage.classList.remove('active');
    thankYouPage.classList.add('hidden');

    landingPage.classList.remove('hidden');
    landingPage.classList.add('active');
});

// Submit form to Google Sheets
form.addEventListener('submit', e => {
    e.preventDefault();

    submitBtn.innerHTML = "Connecting...";

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => {
          submitBtn.innerHTML = "Connect With Us";
          form.reset();
          
          // Switch to Thank You Page instead of showing small text
          formPage.classList.remove('active');
          formPage.classList.add('hidden');
          
          thankYouPage.classList.remove('hidden');
          thankYouPage.classList.add('active');
      })
      .catch(error => {
          console.error('Error!', error.message);
          submitBtn.innerHTML = "Connect With Us";
          alert("Something went wrong. Please try again.");
      });
});

// ==========================================
// VERTICAL INFINITE CAROUSEL + SELECTED PROPERTY DETAILS
// ==========================================
const carousel = document.getElementById('property-carousel');
const track = document.querySelector('.carousel-track');

const projectInfo = {
    'Hero Homes - Leafsong Retreat': {
        location: 'Greater Noida',
        description: 'Explore Hero Homes Leafsong Retreat and connect with our team for the latest project information, availability and pricing.',
        highlights: ['Residential project in Sector Mu Greater Noida', 'Premium 3 BHK living', '50+ amenities']
    },
    'Godrej Global Buisness City': {
        location: 'Greater Noida',
        description: 'Discover Godrej Global Business City in the DMIC region . Enquire for the latest project details and available options.',
        highlights: ['23.2 acres of land parcel', 'An Integrated Township', 'Excellent Connectivity']
    },
    'Prestige City': {
        location: 'Indirapuram',
        description: 'Explore this Prestige City property listing and speak with our team to get verified project details.',
        highlights: ['62.5 acres of land parcel', 'About 4000 residencies provided', 'High-rise luxury living with landscaped open spaces']
    },
    'Sobha Rivana': {
        location: 'Greater Noida',
        description: 'Learn more about Sobha Rivana in Greater Noida. Contact our team for verified project information and availability.',
        highlights: ['2, 3 and 4 BHK residences', 'Approximately 11.76 acres of total land parcel', 'Landscaped stream approximately 350 metres long']
    }
};

// Clone cards once to create the infinite loop
track.innerHTML += track.innerHTML;
const propertyCards = track.querySelectorAll('.property-card');
let selectedCard = null;
let detailsOpen = false;

function getCardName(card) {
    return card.querySelector('.card-overlay h3')?.textContent.trim() || card.querySelector('img')?.alt || 'Property';
}

function showProject(card) {
    const name = getCardName(card);
    const location = card.querySelector('.card-overlay p')?.textContent.trim() || 'Contact us for location details';
    const info = projectInfo[name] || {
        location,
        description: 'Contact our team to learn more about this property and request the latest verified details.',
        highlights: ['Request project details', 'Check current availability', 'Ask about pricing and amenities']
    };

    propertyCards.forEach(item => {
        item.classList.remove('selected');
        item.setAttribute('aria-pressed', 'false');
    });
    card.classList.add('selected');
    card.setAttribute('aria-pressed', 'true');
    selectedCard = card;

    detailName.textContent = name;
    detailLocation.textContent = info.location || location;
    detailDescription.textContent = info.description;
    detailHighlights.replaceChildren();
    info.highlights.forEach(highlight => {
        const li = document.createElement('li');
        li.textContent = highlight;
        detailHighlights.appendChild(li);
    });

    selectedProjectInput.value = name;
    detailsBackdrop.classList.add('open');
    detailsBackdrop.setAttribute('aria-hidden', 'false');
    detailsOpen = true;
}

function closeProjectDetails() {
    detailsBackdrop.classList.remove('open');
    detailsBackdrop.setAttribute('aria-hidden', 'true');
    detailsOpen = false;
    propertyCards.forEach(card => {
        card.classList.remove('selected');
        card.setAttribute('aria-pressed', 'false');
    });
    selectedCard = null;
}

track.addEventListener('click', event => {
    const card = event.target.closest('.property-card');
    if (!card || dragMoved) return;
    showProject(card);
});

document.getElementById('close-details').addEventListener('click', closeProjectDetails);
detailsBackdrop.addEventListener('click', event => {
    if (event.target === detailsBackdrop) closeProjectDetails();
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && detailsOpen) closeProjectDetails();
});

enquireProjectBtn.addEventListener('click', () => {
    closeProjectDetails();
    openFormPage();
});

// Calculate distance based on Vertical Center (Y Axis)
function updateCardsEffect() {
    const carouselRect = carousel.getBoundingClientRect();
    const carouselCenter = carouselRect.top + (carouselRect.height / 2);

    const isMobile = window.innerWidth <= 992;
    const maxVisibleDistance = isMobile ? 320 : 500;

    propertyCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + (rect.height / 2);
        const distance = Math.abs(carouselCenter - cardCenter);

        let opacity = 1 - (distance / maxVisibleDistance);
        let scale = 1.05 - (distance / maxVisibleDistance) * 0.2;

        if (distance > maxVisibleDistance) {
            opacity = 0;
        } else {
            opacity = Math.max(0.3, Math.min(1, opacity));
        }
        scale = Math.max(0.8, Math.min(1.05, scale));
        if (card === selectedCard) scale = Math.max(scale, 1.07);

        card.style.opacity = opacity;
        card.style.transform = `scale(${scale})`;
        card.style.zIndex = card === selectedCard ? 101 : Math.round(opacity * 100);
    });
}

// Centre the first/last card on any screen size
function sizeTrackPadding() {
    const pad = Math.max(0, (carousel.clientHeight - propertyCards[0].offsetHeight) / 2);
    track.style.paddingTop = pad + 'px';
    track.style.paddingBottom = pad + 'px';
}

// Exact height of one full set of 4 cards (for a seamless loop)
function getLoopHeight() {
    return propertyCards[4].offsetTop - propertyCards[0].offsetTop;
}

// Continuous smooth vertical auto-scroll
let isDragging = false;
let dragMoved = false;
let autoScrollSpeed = 1.2;
let animationId;

function autoScroll() {
    if (!isDragging && !detailsOpen) {
        carousel.scrollTop += autoScrollSpeed;
        const loop = getLoopHeight();
        if (carousel.scrollTop >= loop) carousel.scrollTop -= loop;
    }
    updateCardsEffect();
    animationId = requestAnimationFrame(autoScroll);
}

// Drag support: works for mouse, finger and stylus
let startY, scrollStartTop;

carousel.addEventListener('pointerdown', e => {
    if (detailsOpen) return;
    isDragging = true;
    dragMoved = false;
    startY = e.clientY;
    scrollStartTop = carousel.scrollTop;
});

window.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > 6) dragMoved = true;
    carousel.scrollTop = scrollStartTop - dy * (e.pointerType === 'mouse' ? 2.5 : 1);

    const loop = getLoopHeight();
    if (carousel.scrollTop >= loop) {
        carousel.scrollTop -= loop;
        scrollStartTop -= loop;
    } else if (carousel.scrollTop <= 0) {
        carousel.scrollTop += loop;
        scrollStartTop += loop;
    }
});

const endDrag = () => { isDragging = false; };
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

// Mouse wheel / trackpad scrolling (laptops, device-emulation mode)
landingPage.addEventListener('wheel', e => {
    if (detailsOpen) return;
    e.preventDefault();
    carousel.scrollTop += e.deltaY;

    const loop = getLoopHeight();
    if (carousel.scrollTop >= loop) carousel.scrollTop -= loop;
    else if (carousel.scrollTop <= 0) carousel.scrollTop += loop;
}, { passive: false });

window.addEventListener('resize', () => {
    sizeTrackPadding();
    updateCardsEffect();
});

// Start
carousel.scrollTop = 0;
propertyCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && !detailsOpen) {
            event.preventDefault();
            showProject(card);
        }
    });
});
sizeTrackPadding();
updateCardsEffect();
autoScroll();