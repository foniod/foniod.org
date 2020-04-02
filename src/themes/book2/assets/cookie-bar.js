(function() {
  /*
  cookie-bar.js
  1. Show if 'cookie consent yes' is not set to 'true' in localStorage
  2. remove h3 heading on scroll
  3. mobile responsive padding (#main element). Handle docs page sidebars also.
  4. button click sets 'redsift/gave-cookie-consent' flag in localStorage
  */

  const body = document.querySelector("body");
  const main = document.querySelector("#main");
  const cookieBar = document.querySelector("#cookie-bar");
  const cookieHeading = document.querySelector("#cookie-heading");
  const cookieButton = document.querySelector("#cookie-button");

  const gaveConsent = localStorage.getItem("redsift/gave-cookie-consent");

  const setDocsPadding = () => {
    if (body.classList.contains("fixed-position") && !gaveConsent && window.innerWidth >= 768) {
      const left = document.querySelector("#left-sidebar");
      const right = document.querySelector("#right-sidebar");
      left.style.top = `${cookieBar.clientHeight}px`;
      right.style.top = `${77 + cookieBar.clientHeight}px`;
    }
  }

  const setPadding = () => {
    if (!gaveConsent) {
      let mainPaddingTop = 72;
      if (window.innerWidth < 768){
        mainPaddingTop = 63;
      }
      cookieBar.classList.remove("hide");
      main.style.paddingTop = `${cookieBar.clientHeight + mainPaddingTop}px`;
      setDocsPadding();
    }
  }

  const hideHeading = () => {
    if (window.scrollY >= 80) {
      cookieHeading.classList.add("hide");
    } else {
      cookieHeading.classList.remove("hide");
    }
  }

  const hideBar = () => {
    localStorage.setItem("redsift/gave-cookie-consent", "yes");
    cookieBar.classList.add("hide");
    main.style.removeProperty('padding-top');
    // docs padding reset
    if (body.classList.contains("fixed-position") && window.innerWidth >= 768) {
      const left = document.querySelector("#left-sidebar");
      const right = document.querySelector("#right-sidebar");
      left.style.removeProperty('top');
      right.style.removeProperty('top');
    }
  }

  setPadding();
  setDocsPadding();
  cookieButton.onclick = hideBar;

  window.addEventListener('resize', () => {
    setPadding();
    setDocsPadding();
  });

  window.addEventListener('scroll', () => {
    hideHeading();
    setPadding();
  });

})();