(function() {
  const body = document.querySelector("body");
  const mainMenu = document.querySelector(".main-menu");
  const menuButton = document.querySelector(".nav-opener");

  if (window.location && window.location.pathname.includes("/docs/")) {
    const menuItems = Array.from(mainMenu.querySelectorAll("a"));
    const active = menuItems.find(i => i.pathname.includes("/docs/"));
    if (!active.classList.contains("active")) {
      active.classList.add("active");
    }
  }

  const toggleMenu = () => {
    const mainMenu = document.querySelector(".drop");
    mainMenu.classList.toggle("mobile-open");
    body.classList.toggle("nav-active");

    const docsMenu = document.querySelector(".sidebar");
    if (docsMenu) {
      docsMenu.classList.toggle("mobile-open");
      if (docsMenu.classList.contains("mobile-open")) {
        docsMenu.style.marginTop = `${mainMenu.clientHeight}px`;
      } else {
        docsMenu.style.marginTop = 0;
      }
    }
  };
  menuButton.onclick = toggleMenu;
})();
