var Main{{projecNamePascalCase}} = (function (window, jQuery, undefined) {
  var leftArrowSlide = function () {
    return '<div class="arrow-left-slick"><i class="icon-arrow-left"></i></div>';
  };

  var rightArrowSlide = function () {
    return '<div class="arrow-right-slick"><i class="icon-arrow-right"></i></div>';
  };

  var checkMediaQuery = function (deviceWidth, direction) {
    var string = direction == "up" ? "min-width" : "max-width";
    var resultMatch = window.matchMedia("(" + string + ": " + deviceWidth + "px)");
    return resultMatch ? resultMatch.matches : null;
  };

  var mobileMenu = function () {
    jQuery(".header .menu-item-has-children>a").click(function (event) {
      event.preventDefault();
      jQuery(this).parent().children(".sub-menu").slideToggle();
    });
  };

  var init = function () {
    if (checkMediaQuery(devices.largeDevicesDown, "down")) {
      mobileMenu();
    }

    new WOW().init();
  };

  return {init: init};
})(window, jQuery, undefined);

jQuery(document).ready(function () {
  Main{{projecNamePascalCase}}.init();
});
