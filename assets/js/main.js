
$(document).ready(function() {
  "use strict";

  var window_width = $(window).width(),
    window_height = window.innerHeight,
    header_height = $(".default-header").height(),
    header_height_static = $(".site-header.static").outerHeight(),
    fitscreen = window_height - header_height;


  $(".fullscreen").css("height", window_height)
  $(".fitscreen").css("height", fitscreen);

  if (document.getElementById("default-select")) {
    $('select').niceSelect();
  };




  // Mobile Navigation - encapsulated init and safe binding
  function initMobileNav() {
    if (!$('#nav-menu-container').length) return;
    if ($('#mobile-nav').length) return; // already initialized

    var $mobile_nav = $('#nav-menu-container').clone().prop({ id: 'mobile-nav' });
    $mobile_nav.find('> ul').attr({ 'class': '', 'id': '' });
    $('body').append($mobile_nav);
    if ($('#mobile-nav-toggle').length === 0) {
      $('body').prepend('<button type="button" id="mobile-nav-toggle" aria-label="Open navigation" aria-expanded="false"><i class="lnr lnr-menu" aria-hidden="true"></i></button>');
    }
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="lnr lnr-chevron-down"></i>');

    // delegated handlers to avoid duplicate bindings
    $(document).off('click', '.menu-has-children i').on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("lnr-chevron-up lnr-chevron-down");
    });

    $(document).off('click', '#mobile-nav-toggle').on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      var expanded = $('#mobile-nav-toggle').attr('aria-expanded') === 'true';
      $('#mobile-nav-toggle').attr('aria-expanded', (!expanded).toString());
      $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
      $('#mobile-body-overly').toggle();
    });

    $(document).off('click.mobileNavClose').on('click.mobileNavClose', function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle').attr('aria-expanded', 'false');
          $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
          $('#mobile-body-overly').hide();
        }
      }
    });
  }

  // initial call
  initMobileNav();

  // Re-init when nav container is added/changed (e.g., different pages without full reload)
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) { if (m.addedNodes && m.addedNodes.length) initMobileNav(); });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // fallback
  window.addEventListener('load', initMobileNav);

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (!$('#header').hasClass('header-fixed')) {
            top_space = top_space;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle').attr('aria-expanded', 'false');
          $('#mobile-nav-toggle i').toggleClass('lnr-times lnr-bars');
          $('#mobile-body-overly').hide();
        }
        return false;
      }
    }
  });


  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });







  $(".hover").mouseleave(
    function() {
      $(this).removeClass("hover");
    }
  );




});
