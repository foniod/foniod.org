(function() {
  var menu = document.querySelector("aside.sidebar nav");
  addEventListener("beforeunload", function(event) {
    localStorage.setItem("menu.scrollTop", menu.scrollTop);
  });
  menu.scrollTop = localStorage.getItem("menu.scrollTop");
})();
