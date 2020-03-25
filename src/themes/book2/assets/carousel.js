(function() {
  // carousel on install-section of landing page
  
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");
  const slideButtons = document.querySelectorAll(".carousel-nav li");
  const slides = document.querySelectorAll(".carousel-slide");

  let index = 0;

  if (slideButtons.length !== slides.length) {
    console.warn("Add the same number of slides as buttons you silly billy!!!");
  }

  const init = () => {
    [slideButtons, slides].map(i => i[0].classList.add("active"));
  }

  const setActive = (prevIndex, index) => {
    [slideButtons, Array.from(slides)].map(i => {
      i[prevIndex].classList.remove("active");
      i[index].classList.add("active");
    });
  }

  const selectSlide = btnIdx => {
    const prevIndex = index;
    if (prevIndex !== btnIdx) {
      index = btnIdx;
      setActive(prevIndex, index);
    }
  }

  const cycleSlide = direction => {
    const prevIndex = index;
    if (index > 0 && direction === "prev") {
      index--;
    }
    if (index < slides.length -1 && direction === "next") {
      index++;
    }
    setActive(prevIndex, index);
  }

  init();

  prevButton.onclick = () => cycleSlide("prev");
  nextButton.onclick = () => cycleSlide("next");
  Array.from(slideButtons).map((val, idx) => val.firstElementChild.onclick = () => selectSlide(idx))

})();
  