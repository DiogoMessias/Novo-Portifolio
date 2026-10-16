const projects = [
  {
    icon: "</>",
    title: { pt: "Site para Barbearia", en: "Barbershop Website" },
    description: {
      pt: "Website moderno e responsivo desenvolvido utilizando HTML, CSS e JavaScript.",
      en: "A modern, responsive website built with HTML, CSS, and JavaScript.",
    },
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    icon: "✦",
    title: { pt: "Dashboard", en: "Dashboard" },
    description: {
      pt: "Interface de dashboard desenvolvida para apresentação de informações e dados.",
      en: "A dashboard interface designed to present information and data.",
    },
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    icon: "◈",
    title: { pt: "Loja Virtual", en: "Online Store" },
    description: {
      pt: "Projeto de loja virtual com layout moderno, produtos e interação com JavaScript.",
      en: "An online store concept with a modern layout, products, and JavaScript interactions.",
    },
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    icon: "✧",
    title: { pt: "Landing Page para Academia", en: "Fitness Landing Page" },
    description: {
      pt: "Modelo de página para divulgar serviços, horários e planos de uma academia.",
      en: "A landing page concept to showcase gym services, schedules, and memberships.",
    },
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    icon: "✓",
    title: { pt: "Aplicativo de Tarefas", en: "Task Manager" },
    description: {
      pt: "Modelo de aplicação para organizar tarefas e acompanhar atividades do dia a dia.",
      en: "An app concept for organizing tasks and keeping track of daily activities.",
    },
    technologies: ["React", "CSS", "JavaScript"],
  },
  {
    icon: "▦",
    title: { pt: "Catálogo de Produtos", en: "Product Catalog" },
    description: {
      pt: "Modelo de catálogo digital com produtos organizados e navegação simples.",
      en: "A digital catalog concept with organized products and simple navigation.",
    },
    technologies: ["HTML", "CSS", "JavaScript"],
  },
];

const root = document.documentElement;
const grid = document.querySelector("#projects-grid");
const moreButton = document.querySelector("#more-projects");
const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#main-navigation");
const languageToggle = document.querySelector("#language-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const progressBar = document.querySelector("#reading-progress");
const toast = document.querySelector("#toast");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let language = "pt";
let projectsExpanded = false;
let toastTimeout;

function createProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = "project-card reveal";
  card.hidden = index >= 3;
  card.innerHTML = `
    <div class="project-topline">
      <span class="project-icon" aria-hidden="true">${project.icon}</span>
      <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
    </div>
    <h3 data-project-title>${project.title.pt}</h3>
    <p data-project-description>${project.description.pt}</p>
    <div class="project-tech" aria-label="Tecnologias">
      ${project.technologies.map((technology) => `<span>${technology}</span>`).join("")}
    </div>
  `;
  card.dataset.projectIndex = String(index);
  return card;
}

projects.forEach((project, index) => {
  grid.append(createProjectCard(project, index));
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-pt][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  document.querySelectorAll(".project-card").forEach((card) => {
    const project = projects[Number(card.dataset.projectIndex)];
    card.querySelector("[data-project-title]").textContent = project.title[language];
    card.querySelector("[data-project-description]").textContent =
      project.description[language];
  });

  languageToggle.textContent = language === "pt" ? "EN" : "PT";
  languageToggle.setAttribute(
    "aria-label",
    language === "pt" ? "Switch to English" : "Mudar para português",
  );
  document.title =
    language === "pt"
      ? "Diogo Messias | Desenvolvedor Web"
      : "Diogo Messias | Web Developer";
}

function closeMenu() {
  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", language === "pt" ? "Abrir menu" : "Open menu");
}

function updateScrollState() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function updateActiveNavigation(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".main-navigation a").forEach((link) => {
      link.classList.toggle("active", link.hash === `#${entry.target.id}`);
    });
  });
}

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light" || savedTheme === "dark") {
  root.dataset.theme = savedTheme;
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  themeToggle.setAttribute(
    "aria-label",
    nextTheme === "light" ? "Ativar tema escuro" : "Ativar tema claro",
  );
});

languageToggle.addEventListener("click", () => {
  setLanguage(language === "pt" ? "en" : "pt");
  closeMenu();
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  navigation.classList.toggle("open", !isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    !isOpen
      ? language === "pt" ? "Fechar menu" : "Close menu"
      : language === "pt" ? "Abrir menu" : "Open menu",
  );
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

moreButton.addEventListener("click", () => {
  projectsExpanded = !projectsExpanded;
  grid.querySelectorAll(".project-card").forEach((card, index) => {
    card.hidden = !projectsExpanded && index >= 3;
    if (!card.hidden) requestReveal(card);
  });
  moreButton.setAttribute("aria-expanded", String(projectsExpanded));
  moreButton.querySelector("span:last-child").textContent =
    language === "pt"
      ? projectsExpanded ? "Menos projetos" : "Mais projetos"
      : projectsExpanded ? "Fewer projects" : "More projects";
});

function requestReveal(element) {
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    element.classList.add("is-visible");
    return;
  }
  revealObserver.observe(element);
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach(requestReveal);
grid.querySelectorAll(".project-card:not([hidden])").forEach(requestReveal);

const sectionObserver = new IntersectionObserver(updateActiveNavigation, {
  rootMargin: "-25% 0px -60% 0px",
});
document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();
document.querySelector("#current-year").textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", link.getAttribute("href"));
  });
});
