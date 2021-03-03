(function () {
  const blogArticle = new Swiper('.swiper-blog-article', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
})();
