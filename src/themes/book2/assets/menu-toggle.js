(function() {
  const menuButton = document.querySelector(".nav-opener");
  const toggleMenu = () => {
    document.querySelector(".sidebar").classList.toggle('mobile-open');
  }
  menuButton.onclick = toggleMenu;

})();
  