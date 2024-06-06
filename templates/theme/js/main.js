var Main{{PROJECT_NAME_PASCAL_CASE}} = (function (window, jQuery, undefined) {
  var devices = {
    smallDevices: 576,
    mediumDevices: 768,
    largeDevices: 992,
    extraLargeDevices: 1200,
    smallDevicesDown: 576 - 1,
    mediumDevicesDown: 768 - 1,
    largeDevicesDown: 992 - 1,
    extraLargeDevicesDown: 1200 - 1,
  };

  var leftArrowSlide = function () {
    return '<div class="arrow-left-slick"><i class="icon-arrow-left"></i></div>';
  };

  var rightArrowSlide = function () {
    return '<div class="arrow-right-slick"><i class="icon-arrow-right"></i></div>';
  };

  var GenerateSlickSlide = function (target) {
    this.slide = jQuery(target);

    return {
      slide: this.slide,
      options: {
        lazyLoad: 'ondemand',
      },
      init(target) {
        this.slide = jQuery(target);
        return this;
      },
      imagesPerPage(quantity) {
        this.options.slidesToShow = quantity;
        return this;
      },
      setProperty(property, value) {
        this.options[property] = value;
        return this;
      },
      automatic(speedInSeconds) {
        this.options.autoplay = true;
        this.options.autoplaySpeed = speedInSeconds * 1000;

        return this;
      },
      centerMode(itemsPerPage, padding) {
        this.options.centerMode = true;
        this.options.slidesPerRow = 1;
        this.options.slidesToShow = itemsPerPage;
        this.options.slidesToScroll = 1;

        if (padding) {
          this.options.centerPadding = padding;
        }

        return this;
      },
      run() {
        this.slide.slick(this.options);
        return this;
      },
    };
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
  Main{{PROJECT_NAME_PASCAL_CASE}}.init();
});
