(function() {
  const menuButton = document.querySelector(".nav-opener");
  const toggleMenu = () => {
    const mainMenu = document.querySelector(".drop");
    mainMenu.classList.toggle("mobile-open");

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
