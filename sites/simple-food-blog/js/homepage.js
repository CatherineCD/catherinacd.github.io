(function () {
  const blogArticle = new Swiper('.swiper-blog-article', {
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }, breakpoints: {
      320: {
        sslidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 30,
      },
      1365: {
        slidesPerView: 'auto',
        spaceBetween: 30,
      }
    }
  });
  
  function classToggle() {
    const navs = document.querySelectorAll('.header__navigation-list')
    console.log(navs);
    navs.forEach(nav => nav.classList.toggle('header__toggle--show'));
  }
  
  document.querySelector('.header__toggle')
    .addEventListener('click', classToggle);
})();
