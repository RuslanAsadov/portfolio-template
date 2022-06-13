import Swiper, { Pagination, A11y } from 'swiper';

document.addEventListener('DOMContentLoaded', () => {

  const menuButton = document.querySelector('.menu__button');
  const menuList = document.querySelector('.menu__list');

  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', !expanded);
    menuButton.classList.toggle('is-active');
    menuList.classList.toggle('menu__list--open');
  });

  new Swiper('.testimonials-slider', {
    modules: [Pagination, A11y],
    loop: true,
    speed: 600,
    autoHeight: true,
    slidesPerView: 1,
    spaceBetween: 20,
    a11y: {
      enabled: true,
      slideRole: 'article'
    },
    pagination: {
      el: '.testimonials-slider__pagination',
      clickable: true,
      bulletElement: 'button'
    },
    breakpoints: {
      // when window width is >= 576px
      576: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: -1,
        loopedSlides: 3,
        slideToClickedSlide: true,
      }
    },
    on: {
      init: function () {
        const { passedParams, el } = this;
        if (passedParams?.a11y?.enabled) {
          el
            .querySelectorAll('.swiper-slide-duplicate')
            .forEach(slide => slide.setAttribute('aria-hidden', true));
        }
      },
    },
  });

  const faqContainer = document.querySelector('.section-faq__accordion');

  const hideAccordionItem = (el) => {
    if (!el.classList.contains('accordion-item--hiding')) {
      el.querySelector('.accordion-item__body').style.maxHeight = 0;
      el.classList.add('accordion-item--hiding');
      setTimeout(() => {
        el.classList.remove('accordion-item--hiding');
        el.open = false;
      }, 400);
    }
  }

  const showAccordionItem = (el) => {
    if (el.open !== true) {
      el.open = true;
      const itemBody = el.querySelector('.accordion-item__body');
      itemBody.style.maxHeight = `${itemBody.scrollHeight}px`;
    }
  }

  faqContainer.addEventListener('click', e => {
    e.preventDefault();
    if (!e.target.closest('.accordion-item__header')) return;
    const el = e.target.closest('.accordion-item');
    faqContainer.querySelectorAll('.accordion-item[open]').forEach(openedElement => {
      if (openedElement !== el) hideAccordionItem(openedElement);
    });
    el.open ? hideAccordionItem(el) : showAccordionItem(el);
  });

  // Scroll link
  document
    .querySelectorAll('.scroll-link')
    .forEach($link => {
      $link.addEventListener('click', e => {
        e.preventDefault();
        const $el = document.querySelector(e.target.getAttribute('href'));
        if ($el) {
          window.scroll({
            behavior: 'smooth',
            left: 0,
            top: $el.offsetTop
          });
        }
      });
    });
})

