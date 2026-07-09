/* selection */

const frBtn = document.getElementById("fr-button");
const enBtn = document.getElementById("en-button");
const themeBtn = document.getElementById("theme-button");


/* multilinguisme */

/* petit dictionnaire de traduction : à compléter avec tout
   le texte du site. La clé = un attribut data-key qu'il
   faudra ajouter dans le HTML sur chaque élément à traduire
   (ex: <h1 data-key="titre">Mey K</h1>) */
const translations = {
    fr: {
        titre: "Mey K",
        tagline: "Étudiante en Master Cultures et Métiers du Web",
        // ... à compléter
    },
    en: {
        titre: "Mey K",
        tagline: "Master's student in Web Culture and Professions",
        // ... à compléter
    }
};

frBtn.addEventListener("click", () => {
    changeLanguage("fr");
});

enBtn.addEventListener("click", () => {
    changeLanguage("en");
});

function changeLanguage(lang) {
    // met à jour l'apparence des boutons FR/EN
    frBtn.classList.toggle("active", lang === "fr");
    enBtn.classList.toggle("active", lang === "en");
    frBtn.setAttribute("aria-pressed", lang === "fr");
    enBtn.setAttribute("aria-pressed", lang === "en");

    // parcourt tous les éléments qui ont un data-key
    // et remplace leur texte par la traduction correspondante
    document.querySelectorAll("[data-key]").forEach((el) => {
        const key = el.dataset.key;
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}


/* le thème  stocké dans l'attribut data-theme sur <html>,
   le CSS réagit tout seul grâce aux variables définies dans
   style.css ([data-theme="dark"] { ... }) */

themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = isDark ? "light" : "dark";
    themeBtn.textContent = isDark ? "🌙" : "☀️";

    // pour se souvenir du choix même après avoir rechargé la page
    localStorage.setItem("theme", isDark ? "light" : "dark");
});

// au chargement de la page, on applique le thème déjà choisi avant
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
    themeBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}


/*
   pour agrandir le CV et les images de projets directement
   sur la page, sans ouvrir de nouvel onglet.
   La fenêtre est créée une seule fois en JS et réutilisée. */

// on crée la structure de la lightbox et on l'ajoute à la page
const overlay = document.createElement("div");
overlay.className = "lightbox-overlay";
overlay.innerHTML = `
    <div class="lightbox-box">
        <button class="lightbox-close" aria-label="Fermer">✕</button>
        <div class="lightbox-content"></div>
    </div>
`;
document.body.appendChild(overlay);

const lightboxContent = overlay.querySelector(".lightbox-content");
const lightboxClose = overlay.querySelector(".lightbox-close");

function openLightbox(htmlContent) {
    lightboxContent.innerHTML = htmlContent;
    overlay.classList.add("active");
}

function closeLightbox() {
    overlay.classList.remove("active");
}

lightboxClose.addEventListener("click", closeLightbox);

// on ferme aussi si on clique en dehors de la boite
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
});

// clic sur le bloc CV -> ouvre le CV en grand
// (pour l'instant ça affiche le placeholder, à remplacer
// par une vraie image du CV : <img src="media/cv.jpg">)
const homeCvWrapper = document.querySelector(".home-cv-wrapper");
if (homeCvWrapper) {
    homeCvWrapper.addEventListener("click", () => {
        openLightbox(`<img src="media/cv.jpg" alt="CV de Mey K">`);
    });
}

// clic sur une image de projet -> ouvre l'image en grand
document.querySelectorAll(".project-visual").forEach((visual) => {
    visual.addEventListener("click", () => {
        const titre = visual.nextElementSibling.querySelector(".project-title").textContent;
        // à remplacer par la vraie image du projet plus tard
        openLightbox(`<h3>${titre}</h3><p>Image du projet à venir.</p>`);
    });
});


/* animatoon des cartes projets
   ajoute la classe "active" à une carte projet dès qu'elle
   devient visible à l'écran (le CSS gère le fondu, voir
   .project-card / .project-card.active dans style.css) */

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // une seule fois suffit
            }
        });
    },
    { threshold: 0.2 }
);

revealElements.forEach((el) => observer.observe(el));
