// DOM Elements
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("nav");
const themeBtns = document.querySelectorAll(".theme-btn");
const skillBars = document.querySelectorAll(".skill-progress");
const typingText = document.getElementById("typing-text");

// Current section index
let currentSectionIndex = 0;

// Initialiser le thème depuis localStorage ou utiliser le thème par défaut
function initTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme") || "cyber";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Mettre à jour le bouton de thème actif
  themeBtns.forEach((btn) => {
    if (btn.dataset.theme === savedTheme) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Changer de thème
function changeTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);

  // Mettre à jour le bouton de thème actif
  themeBtns.forEach((btn) => {
    if (btn.dataset.theme === theme) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Animation d'écriture pour l'effet "hacking"
function typeWriterEffect(element, messages, speed = 50) {
  let i = 0;
  let messageIndex = 0;
  let currentMessage = messages[messageIndex];
  let isDeleting = false;
  let timeout = 2000; // Temps d'attente après l'écriture complète

  function type() {
    const fullText = currentMessage;

    if (isDeleting) {
      element.textContent = fullText.substring(0, i);
      i--;

      if (i === 0) {
        isDeleting = false;
        messageIndex++;

        if (messageIndex === messages.length) {
          messageIndex = 0;
        }

        currentMessage = messages[messageIndex];
        timeout = 500; // Temps d'attente avant de commencer à écrire
      }
    } else {
      element.textContent = fullText.substring(0, i) + "█";
      i++;

      if (i > fullText.length) {
        element.textContent = fullText; // Supprimer le curseur à la fin
        isDeleting = true;
        timeout = 2000; // Temps d'attente avant de commencer à supprimer
      }
    }

    const typingSpeed = isDeleting ? speed / 2 : speed;
    setTimeout(type, i === fullText.length || i === 0 ? timeout : typingSpeed);
  }

  type();
}

// Fonction pour activer une section
function activateSection(index) {
  // Désactiver toutes les sections et liens
  sections.forEach((section) => section.classList.remove("active"));
  navLinks.forEach((link) => link.classList.remove("active"));

  // Activer la section et le lien correspondant
  sections[index].classList.add("active");
  navLinks[index].classList.add("active");

  // Mettre à jour l'URL avec l'ancre
  history.pushState(null, null, navLinks[index].getAttribute("href"));

  // Mettre à jour l'index courant
  currentSectionIndex = index;

  // Animer les barres de compétences si on est sur la section compétences
  if (sections[index].id === "skills") {
    animateSkillBars();
  }
}

// Animer les barres de compétences
function animateSkillBars() {
  skillBars.forEach((bar) => {
    const progress = bar.getAttribute("data-progress");
    bar.style.width = "0";

    setTimeout(() => {
      bar.style.width = `${progress}%`;
    }, 200);
  });
}

// Navigation avec les touches du clavier
function handleKeyNavigation(e) {
  // Ignorer si un champ de formulaire est actif
  if (
    document.activeElement.tagName === "INPUT" ||
    document.activeElement.tagName === "TEXTAREA"
  ) {
    return;
  }

  if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
    e.preventDefault();
    if (currentSectionIndex > 0) {
      activateSection(currentSectionIndex - 1);
    }
  } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (currentSectionIndex < sections.length - 1) {
      activateSection(currentSectionIndex + 1);
    }
  }
}

// Observer pour animations au scroll
function setupScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");

          // Si c'est la section compétences, animer les barres
          if (entry.target.id === "skills") {
            animateSkillBars();
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Gestion du formulaire de contact
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simulation d'envoi de formulaire
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Envoi en cours...";
      submitBtn.disabled = true;

      setTimeout(() => {
        // Réinitialiser le formulaire
        form.reset();

        // Afficher un message de succès
        alert("Message envoyé avec succès !");

        // Restaurer le bouton
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
}

// Déterminer la section active initiale basée sur l'URL
function getInitialSectionIndex() {
  const hash = window.location.hash;
  if (hash) {
    for (let i = 0; i < navLinks.length; i++) {
      if (navLinks[i].getAttribute("href") === hash) {
        return i;
      }
    }
  }
  return 0;
}

// Initialisation
document.addEventListener("DOMContentLoaded", function () {
  // Initialiser le thème
  initTheme();

  // Déterminer la section initiale
  const initialIndex = getInitialSectionIndex();
  activateSection(initialIndex);

  // Configuration de l'observateur de défilement
  setupScrollObserver();

  // Configuration du formulaire de contact
  setupContactForm();

  // Effet de terminal sur la page d'accueil
  const hackingMessages = [
    "Initialisation du système... Accès autorisé.",
    "Chargement du profil d'Elisée Maouly...",
    "Développeur Web & Technicien Support.",
    "Recherche alternance BTS SIO... En cours.",
    "Compétences: HTML, CSS, JS, PHP, Réseaux...",
    "Systèmes maîtrisés: Windows, Linux, Windows Server.",
    "Scannez mon profil pour en savoir plus...",
  ];
  typeWriterEffect(typingText, hackingMessages, 70);

  // Événements

  // Changer de thème
  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      changeTheme(theme);
    });
  });

  // Navigation avec clic
  navLinks.forEach((link, index) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      activateSection(index);
    });
  });

  // Navigation mobile - toggle menu
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  // Fermer le menu mobile après clic sur un lien
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });

  // Navigation avec clavier
  document.addEventListener("keydown", handleKeyNavigation);
});
