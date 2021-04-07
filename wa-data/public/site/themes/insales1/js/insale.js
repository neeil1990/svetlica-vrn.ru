'use sctrict'

jQuery.cookie=function(e,n,o){if(arguments.length>1&&(null===n||"object"!=typeof n)){if(o=jQuery.extend({},o),null===n&&(o.expires=-1),"number"==typeof o.expires){var t=o.expires,r=o.expires=new Date;r.setDate(r.getDate()+t)}return document.cookie=[encodeURIComponent(e),"=",o.raw?String(n):encodeURIComponent(String(n)),o.expires?"; expires="+o.expires.toUTCString():"",o.path?"; path="+o.path:"",o.domain?"; domain="+o.domain:"",o.secure?"; secure":""].join("")}o=n||{};var i,p=o.raw?function(e){return e}:decodeURIComponent;return(i=new RegExp("(?:^|; )"+encodeURIComponent(e)+"=([^;]*)").exec(document.cookie))?p(i[1]):null};


(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = factory(root);
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.LazyLoad = factory(root);
    }
}) (typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    "use strict";

    if (typeof define === "function" && define.amd){
        root = window;
    }

    const defaults = {
        src: "data-src",
        srcset: "data-srcset",
        selector: ".lazyload",
        root: null,
        rootMargin: "0px",
        threshold: 0
    };

    /**
     * Merge two or more objects. Returns a new object.
     * @private
     * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
     * @param {Object}   objects  The objects to merge together
     * @returns {Object}          Merged values of defaults and options
     */
    const extend = function ()  {

        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        /* Check if a deep merge */
        if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
            deep = arguments[0];
            i++;
        }

        /* Merge the object into the extended object */
        let merge = function (obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    /* If deep merge and property is an object, merge properties */
                    if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        /* Loop through each object and conduct a merge */
        for (; i < length; i++) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    function LazyLoad(images, options) {
        this.settings = extend(defaults, options || {});
        this.images = images || document.querySelectorAll(this.settings.selector);
        this.observer = null;
        this.init();
    }

    LazyLoad.prototype = {
        init: function() {

            /* Without observers load everything and bail out early. */
            if (!root.IntersectionObserver) {
                this.loadImages();
                return;
            }

            let self = this;
            let observerConfig = {
                root: this.settings.root,
                rootMargin: this.settings.rootMargin,
                threshold: [this.settings.threshold]
            };

            this.observer = new IntersectionObserver(function(entries) {
                Array.prototype.forEach.call(entries, function (entry) {
                    if (entry.isIntersecting) {
                        self.observer.unobserve(entry.target);
                        let src = entry.target.getAttribute(self.settings.src);
                        let srcset = entry.target.getAttribute(self.settings.srcset);
                        if ("img" === entry.target.tagName.toLowerCase()) {
                            if (src) {
                                entry.target.src = src;
                                entry.target.classList.add('lazy-img-active');
                            }
                            if (srcset) {
                                entry.target.srcset = srcset;
                            }
                        } else {
                            entry.target.style.backgroundImage = "url(" + src + ")";
                        }
                    }
                });
            }, observerConfig);

            Array.prototype.forEach.call(this.images, function (image) {
                self.observer.observe(image);
            });
        },

        loadAndDestroy: function () {
            if (!this.settings) { return; }
            this.loadImages();
            this.destroy();
        },

        loadImages: function () {
            if (!this.settings) { return; }

            let self = this;
            Array.prototype.forEach.call(this.images, function (image) {
                let src = image.getAttribute(self.settings.src);
                let srcset = image.getAttribute(self.settings.srcset);
                if ("img" === image.tagName.toLowerCase()) {
                    if (src) {
                        image.src = src;
                        image.classList.add('lazy-img-active');
                    }
                    if (srcset) {
                        image.srcset = srcset;
                    }
                } else {
                    image.style.backgroundImage = "url('" + src + "')";
                }
            });
        },

        destroy: function () {
            if (!this.settings) { return; }
            this.observer.disconnect();
            this.settings = null;
        }
    };

    root.lazyload = function(images, options) {
        return new LazyLoad(images, options);
    };

    if (root.jQuery) {
        const $ = root.jQuery;
        $.fn.lazyload = function (options) {
            options = options || {};
            options.attribute = options.attribute || "data-src";
            new LazyLoad($.makeArray(this), options);
            return this;
        };
    }

    return LazyLoad;
});


$(function() {
    $.inSale = {
        _svg: '',
        is_mobile: false,
        home_slider_auto: '',
        modal_add: false,
        lazy_load_false: false,
        product_images_arrow: false,
        filters_ajax: false,
        days: 'days',
        hours: 'hours',
        minutes: 'minutes',
        seconds: 'seconds',

        lazyLoad: function() {
            let insale = this;
            let images = document.querySelectorAll(".lazy-img");
            let lazyLoad = new LazyLoad(images);
            if(insale.lazy_load_false) {
                lazyLoad.loadImages();
            }
            return lazyLoad;
        },

        init: function(options) {
            let insale = this;
            insale._svg = options._svg;
            insale.is_mobile = !!options.is_mobile;
            insale.home_slider_auto = options.home_slider_auto;
            insale.modal_add = !!options.modal_add;
            insale.lazy_load_false = !!options.lazy_load_false;
            insale.product_images_arrow = !!options.product_images_arrow;
            insale.filters_ajax = !!options.filters_ajax;
            insale.days = options.days;
            insale.hours = options.hours;
            insale.minutes = options.minutes;
            insale.seconds = options.seconds;
            insale.sign = options.sign;
            insale.sign_position = options.sign_position;
            insale.sign_delim = options.sign_delim;
            insale.precision = options.precision;

            insale.lazyLoad();

            $('.h-slider').owlCarousel({
                autoHeight:false,
                nav:false,
                dots:true,
                loop:true,
                mouseDrag: true,
                items:1,
                autoplay: insale.home_slider_auto ? true : false,
                autoplayTimeout: insale.home_slider_auto? insale.home_slider_auto*1000 : 0,
                autoplayHoverPause:true,
                responsive:{
                    767:{
                        nav:true
                    }
                },
                onInitialized:function(event){
                    $('.h-slider').addClass('h-slider_active');
                }
            });

            $('.p-day_slider').owlCarousel({
                autoHeight:false,
                nav:true,
                dots:false,
                loop:true,
                mouseDrag: true,
                items:1,
                autoplay: false,
                onInitialized:function(event){
                    $('.p-day_slider').addClass('p-day_active');
                }
            });

            (function(window, document) {
                var file = insale._svg
                    , revision = 1;
                if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect)
                    return !0;
                var isLocalStorage = 'localStorage'in window && window.localStorage !== null, request, data, insertIT = function() {
                    document.body.insertAdjacentHTML('afterbegin', data)
                }, insert = function() {
                    if (document.body)
                        insertIT();
                    else
                        document.addEventListener('DOMContentLoaded', insertIT)
                };
                if (isLocalStorage && localStorage.getItem('inlineSVGrev') == revision) {
                    data = localStorage.getItem('inlineSVGdata');
                    if (data) {
                        insert();
                        return !0
                    }
                }
                try {
                    request = new XMLHttpRequest();
                    request.open('GET', file, !0);
                    request.onload = function() {
                        if (request.status >= 200 && request.status < 400) {
                            data = request.responseText;
                            insert();
                            if (isLocalStorage) {
                                localStorage.setItem('inlineSVGdata', data);
                                localStorage.setItem('inlineSVGrev', revision)
                            }
                        }
                    }
                    request.send()
                } catch (e) {}
            }(window, document));

            function MatchMedia(media_query) {
                var matchMedia = window.matchMedia,
                    is_supported = (typeof matchMedia == 'function');
                if (is_supported && media_query) {
                    return matchMedia(media_query).matches;
                } else {
                    return false;
                }
            }

            function resizeExecute() {
                if("function"==typeof Event)
                    window.dispatchEvent(new Event("resize"));
                else {
                    var evt=window.document.createEvent("UIEvents");
                    evt.initUIEvent("resize",!0,!1,window,0);
                    window.dispatchEvent(evt);
                }
            }

            window.stylerRadioChecbox = function() {
                $('input[type="radio"]').not('.in-radio input[type="radio"],.searchpro__page-sidebar input[type="radio"],.s-order-page input[type="radio"]').each(function(index, el) {
                    $(this).wrap('<div class="in-radio"></div>').parent().append('<div class="in-radio__element"></div>');
                    if(!$(this).closest('label').length) {
                        $(this).parent().wrap('<label></label>')
                    }
                });

                $('input[type="checkbox"]').not('.in-checkbox input[type="checkbox"],.searchpro__page-sidebar input[type="checkbox"],.s-order-page input[type="checkbox"]').each(function(index, el) {
                    $(this).wrap('<div class="in-checkbox"></div>').parent().append('<div class="in-checkbox__element"></div>');
                    if(!$(this).closest('label').length) {
                        $(this).parent().wrap('<label></label>')
                    }
                });
            }

            stylerRadioChecbox();

            $('.in-checkbox').on('click','.in-checkbox__element:not(label .in-checkbox__element)', function() {
                var inp = $(this).prev();
                if(inp.prop('checked')) {
                    inp.prop('checked', false);
                } else {
                    inp.prop('checked', true);
                }
            });

            $('.fan').fancybox();

            $("[data-fancybox]").fancybox({
                loop:true,
            });

            const search = $('.search');
            const searchRes = $('.search-res');
            if(searchRes.length && search.length){
                search.find('.search__input').on("keyup", function() {
                    const that = $(this);
                    const f = that.closest('form');
                    const url = f.attr('action');
                    if($(this).val().length < 3){
                        searchRes.removeClass('search-res_active').html("");
                        return ;
                    }

                    $.get(url + "?" + f.serialize() + '&ajax=1', function(html) {
                        const content = $(html);
                        search.find('.search__info').hide();
                        if(content.hasClass('search-res')){
                            that.closest('.search').find('.search-res').html(content.html()).addClass('search-res_active');
                        } else {
                            that.closest('.search').find('.search-res').html(content.html()).removeClass('search-res_active');
                        }
                    });
                });

                $(document).click(function(e) {
                    if ($(e.target).closest('.search').length)
                        return;
                    searchRes.removeClass('search-res_active');
                    e.stopPropagation();
                });
            }

            const searchMobile = $('.h-mobile__top-search');
            if(search.length && searchMobile.length) {
                searchMobile.find('.h-mobile__top-search-icon').click(function() {
                    searchMobile.find('.h-mobile__top-search-bl').addClass('h-mobile__top-search-bl_active');
                });
                searchMobile.find('.h-mobile__top-search-close').click(function() {
                    searchMobile.find('.h-mobile__top-search-bl').removeClass('h-mobile__top-search-bl_active');
                });
            }

            const mSearch = $('.m-search');
            const mHSearch = $('.m-header__search');
            if(mHSearch.length && mSearch.length) {
                mHSearch.click(function(event) {
                    mSearch.addClass('m-search_active');
                });

                mSearch.find('.m-search__close').click(function(event) {
                    mSearch.removeClass('m-search_active');
                });
            }

            const hFix = $('.h-fix');
            const hHeader = $('.header').innerHeight();
            if(hFix.length) {
                $(window).scroll(function() {
                    if($(this).scrollTop() > hHeader)
                        hFix.addClass('h-fix_active') ;
                    else
                        hFix.removeClass('h-fix_active');
                });
            }

            const hMenuLinkActive = $('.h-menu__link_active');
            if(hMenuLinkActive.length) {
                hMenuLinkActive.each(function() {
                    $(this).closest('.h-menu__item').find('.h-menu__link').first().addClass('h-menu__link_active');
                })
            }


            const cMainBg = $('.c-main-bg');
            if(cMainBg.length) {
                cMainBg.click(function() {
                    $(this).removeClass('c-main-bg_active');
                });
            }

            const hMenuHover = $('.h-menu_hover');
            if(hMenuHover.length) {
                hMenuHover
                    .mouseover(function() {
                        if(!$('.b-catalog_active').length) {
                            $(this).addClass('h-menu_open');
                            cMainBg.addClass('c-main-bg_active');
                        }
                    })
                    .mouseout(function() {
                        if(!$('.b-catalog_active').length) {
                            $(this).removeClass('h-menu_open');
                            cMainBg.removeClass('c-main-bg_active');
                        }
                    });
            }

            const bCatalog = $('.b-catalog');
            const bCatalogButton = $('.b-catalog__button');
            if(bCatalog.length && bCatalogButton.length) {
                bCatalogButton.click(function() {
                    const bCatalogParent = $(this).closest('.b-catalog');
                    let maxHeight = $('body,html').innerHeight() - $(this).innerHeight() - $(this).position().top - ($(this).offset().top - $(window).scrollTop()) - 22;

                    $(this).next().find('.c-menu__wrap').css('max-height', maxHeight > 360 ? maxHeight : 360);

                    if(bCatalogParent.hasClass('b-catalog_active')) {
                        $(this).parent().removeClass("b-catalog_active");
                        $(this).find('.bars').removeClass("bars_active");
                        $(this).next().removeClass("c-menu_active");
                        cMainBg.removeClass('c-main-bg_active');

                        $(this).closest('.header__top-wrap').css('zIndex','');
                        $(this).closest('.header__midd-wrap').css('zIndex','');
                        $(this).closest('.header__bott-wrap').css('zIndex','');
                    } else {
                        $(this).parent().addClass("b-catalog_active");
                        $(this).find('.bars').addClass("bars_active");
                        $(this).next().addClass("c-menu_active");
                        $(this).closest('.header__top-wrap').css('z-index','903');
                        $(this).closest('.header__midd-wrap').css('z-index','902');
                        $(this).closest('.header__bott-wrap').css('z-index','901');
                        cMainBg.addClass('c-main-bg_active');
                    }
                });

                $(document).click(function(e) {
                    if ($(e.target).closest('.b-catalog').length
                        || $(e.target).closest('.h-menu_catalog').length
                        || $(e.target).closest('.l-catalog').length)
                        return;

                    bCatalog.removeClass('b-catalog_active');
                    bCatalog.find('.bars').removeClass("bars_active");
                    bCatalog.find('.c-menu').removeClass("c-menu_active");
                    cMainBg.removeClass('c-main-bg_active');
                    $('.header__top-wrap').css('z-index','');
                    $('.header__midd-wrap').css('z-index','');
                    $('.header__bott-wrap').css('z-index','');
                    e.stopPropagation();
                });
            }

            const cMenuItem = $('.c-menu__item');
            const cMenuRight = $('.c-menu__right');
            if(cMenuItem.length) {
                let cMenuRightShow;
                cMenuItem
                    .mouseover(function() {
                        const that = $(this);
                        let id = that.data('id');
                        clearTimeout(cMenuRightShow);

                        cMenuRightShow = setTimeout(function() {
                            cMenuItem.removeClass('c-menu__item_active');
                            that.addClass('c-menu__item_active');
                            cMenuRight.find('.c-menu__items').removeClass('c-menu__items_active');
                            cMenuRight.find('.c-menu__items-'+id).addClass('c-menu__items_active');
                        }, 300);
                    });

                cMenuRight.mouseover(function() {
                    clearTimeout(cMenuRightShow);
                });
            }

            const lCatalogMenu = $('.l-catalog');
            if(lCatalogMenu.length) {
                lCatalogMenu
                    .mouseenter(function() {
                        lCatalogMenu.find('.c-menu__items').removeClass('c-menu__items_active');
                        const hLCatalog = lCatalogMenu[0].getBoundingClientRect().height;
                        const maxHeight = $('body,html').innerHeight() - ($(this).offset().top - $(window).scrollTop()) - 62;
                        lCatalogMenu.find('.c-menu__right-wrap').css('max-height', maxHeight > 360 ? maxHeight : 360);
                        lCatalogMenu.find('.c-menu__right-wrap').css('min-height', hLCatalog - 40);
                    })
                    .mouseleave(function() {
                        setTimeout(function() {
                            lCatalogMenu.find('.c-menu__item_active').removeClass('c-menu__item_active');
                        }, 300);
                    });

                $(window).resize(function(event) {
                    wMenu();
                });

                wMenu();
                function wMenu() {
                    const wMenuRight = $('.in-right')[0].getBoundingClientRect().width + 30;
                    lCatalogMenu.find('.c-menu__right').css({'width':wMenuRight});
                }
            }

            const hMenu = $('.h-menu');
            if(hMenu.length) {
                hMenu.each(function(index, el) {
                    const that = $(this);
                    const yet = that.find('.h-menu__yet');
                    const menuSub = yet.find('.h-menu__sub');
                    const sub = menuSub.length ? menuSub : yet.find('.h-menu__img-ul');
                    let widthThat = that.innerWidth();

                    that.find('.h-menu__item:not(.h-menu__yet)').each(function() {
                        let img = $(this).find('.h-menu__icon').html() || '';
                        let label = $('<div></div>').append($(this).find('.h-menu__link .label').clone());
                        const name = $(this).find('.h-menu__link .h-menu__name').text();
                        const link = $(this).find('.h-menu__link').attr("href");
                        const sel = $(this).find('.h-menu__link_active');

                        if(img) {
                            img = '<span class="h-menu__img-icon">' + img + '</span>';
                        }

                        if(menuSub.length) {
                            let subLink = $(this).find('>.h-menu__sub').html();
                            let corner = '';

                            if(subLink != undefined) {
                                subLink = '<ul class="h-menu__sub h-menu__sub-2">'+ subLink +'</ul>';
                                corner = '<svg class="icon8 i-angle-right"><use xlink:href="#i-angle-right"></use></svg>';
                            } else {
                                subLink = '';
                            }

                            let cl = '';
                            if(sel.length) cl = ' h-menu__link_active';

                            sub.append('<li class="h-menu__sub-item h-menu__sub-item-right"><a href="' + link + '" class="h-menu__sub-link' + cl + '">' + name + corner +'</a>' + subLink + '</li>');

                        } else {
                            let subLink = $(this).find('>.h-menu__sub').clone();
                            let subImg = $(this).find('.h-menu__img-ul').clone();
                            let cMenu = $(this).find('.c-menu__left').clone();

                            if(subLink.length) {
                                subLink.find('.h-menu__sub-item').removeClass('h-menu__sub-item').addClass('h-menu__img-li-1');
                                subLink.find('.h-menu__sub-link').removeClass('h-menu__sub-link').addClass('h-menu__img-link-1');
                                subLink.find('.h-menu__sub,.i-angle-right,.h-menu__icon').remove();
                                subLink = '<ul class="h-menu__img-ul-1">'+ subLink.html() +'</ul>';

                            } else if(subImg.length) {
                                subImg.find('.h-menu__img-li').removeClass('h-menu__img-li').addClass('h-menu__img-li-1');
                                subImg.find('.h-menu__img-link').removeClass('h-menu__img-link').addClass('h-menu__img-link-1');
                                subImg.find('.h-menu__img-name').removeClass('h-menu__img-name');
                                subImg.find('.h-menu__img-icon,.h-menu__img-ul-1').remove();
                                subLink = '<ul class="h-menu__img-ul-1">'+ subImg.html() +'</ul>';

                            } else if(cMenu.length) {
                                cMenu.find('.c-menu__item').removeClass('c-menu__item').addClass('h-menu__img-li-1');
                                cMenu.find('.c-menu__item-link').removeClass('c-menu__item-link').addClass('h-menu__img-link-1');
                                cMenu.find('.c-menu__item-icon,.i-angle-right').remove();
                                subLink = '<ul class="h-menu__img-ul-1">'+ cMenu.html() +'</ul>';

                            } else {
                                subLink = '';
                            }

                            sub.append('<li class="h-menu__sub-item-right h-menu__img-li"><a class="h-menu__img-link" href="' + link + '">' + img + '<span class="h-menu__img-name h-menu__name">' + name +'</span>' + label.html() + '</a> ' + subLink + '</li>');
                        }

                        insale.lazyLoad();
                    });

                    sub.find('.h-menu__sub-item-right').hide();

                    function changeMenu() {
                        const wMenu = that.innerWidth();
                        let wMenuNew = yet.innerWidth();
                        let yetAct = [];

                        that.addClass('h-menu_active');
                        yet.hide();

                        that.find('.h-menu__item:not(.h-menu__yet)').each(function(index, el) {
                            wMenuNew += $(this).innerWidth() + 3;

                            if(wMenuNew > wMenu) {
                                yetAct.push(index);
                                $(this).hide();
                            } else {
                                $(this).show();
                            }
                        });

                        if(wMenuNew > wMenu) {
                            that.find('.h-menu__yet').show();
                        }

                        sub.find('.h-menu__sub-item-right').hide();
                        if(yetAct.length > 0) {
                            yetAct.forEach(function(item, i, arr) {
                                sub.find('.h-menu__sub-item-right').eq(item).show();
                            });
                        }
                    }

                    let wStop = $(window).width();

                    $(window).resize(function(event) {
                        const w = $(this).width();
                        if(w != wStop) {
                            changeMenu();
                            wStop = w;
                        }
                    });

                    changeMenu();

                    $(window).bind("load", function() {
                        changeMenu();
                        that.removeClass('h-menu_over');
                        widthThat = that.innerWidth();

                        $(window).scroll(function() {
                            if(widthThat != that.innerWidth()) changeMenu();
                        });
                    });
                });

                $('.h-menu__link_active').each(function() {
                    if(!$(this).closest('.h-menu__sub-item').is(":visible"))
                        $(this).closest('.h-menu__item').find('.h-menu__link').addClass('h-menu__link_active');
                });
            }

            const hMenuItem = $('.h-menu__link, .m-brands__link');
            if(hMenuItem.length) {
                hMenuItem.mouseenter(function() {

                    const parent = $(this).parent()
                    let maxHeight = $('body,html').innerHeight() - parent.innerHeight() - parent.position().top - (parent.offset().top - $(window).scrollTop()) - 20;
                    const hMenuImg = parent.find('.h-menu__img-ul');
                    const hMenuCatalog = parent.find('.c-menu__wrap');

                    if(parent.find('.h-menu__img-title').length) {
                        maxHeight = maxHeight - (parent.find('.h-menu__img-title').innerHeight() +20);
                    }

                    if(hMenuImg.length) {
                        hMenuImg.css('max-height', maxHeight > 360 ? maxHeight - 40 : 360);
                    }

                    if(hMenuCatalog.length) {
                        hMenuCatalog.css('max-height', maxHeight > 360 ? maxHeight : 360);
                    }
                });
            }

            let timerOver;
            let timerOut;
            const menuLink = $('.h-menu__link');
            if(menuLink.length) {
                menuLink
                    .mouseover(function() {
                        const that = $(this);
                        clearTimeout(timerOver);
                        clearTimeout(timerOut);
                        menuLink.removeClass('tab-hover');
                        timerOver = setTimeout(function() {
                            that.addClass('tab-hover');
                        }, 200);
                    })
                    .mouseout(function() {
                        const that = $(this);
                        clearTimeout(timerOver);
                        clearTimeout(timerOut);
                        timerOut = setTimeout(function() {
                            that.find('.h-menu__link').removeClass('tab-hover');
                        }, 300);
                    });

                if(MatchMedia("only screen and (min-width: 768px)")) {
                    $(document).on('click touch', '.h-menu__link', function () {
                        if(($(this).find('.i-angle-down').length) && !$(this).hasClass('tab-hover')) {
                            return false;
                        }
                    });
                }
            }

            const lMenu = $('.l-menu');
            if(lMenu.length) {
                lMenu.find('.l-menu__angle').click(function() {
                    $(this).toggleClass('l-menu__angle_active').next().slideToggle();
                });

                $('.l-menu__active').parents('.l-menu__dop').show().prev().addClass('l-menu__angle_active');
            }

            const currency = $(".f-currency select");
            if(currency.length) {
                currency.change(function () {
                    let url = location.href;
                    if (url.indexOf('?') == -1) {
                        url += '?';
                    } else {
                        url += '&';
                    }
                    location.href = url + 'currency=' + $(this).val();
                });
            }

            const mobileBars = $('.bars_mobile');
            const mMenu = $('.m-menu');
            const mClose = $('.m-menu__close');
            if(mobileBars.length) {
                mobileBars.click(function(event) {
                    $(this).addClass('bars_active');
                    mMenu.addClass('m-menu_active');
                });
                mClose.click(function(event) {
                    $('.bars').removeClass('bars_active');
                    mMenu.removeClass('m-menu_active');
                });
            }

            if(mMenu.length && !$('.m-menu-catalog').length) {
                mMenu.find('.m-menu__down:not(.m-menu-links .m-menu__down)').click(function() {
                    const p = $(this).closest('.m-menu__info').next();

                    $(this).toggleClass('m-menu__down_active');

                    if(!$(this).closest('.m-menu__ul-2').length) {
                        mMenu.find('.m-menu__down').not($(this)).removeClass('m-menu__down_active');
                        mMenu.find('.m-menu__li-1').not($(this).closest('.m-menu__li-1')).removeClass('m-menu__li-1_active');
                        mMenu.find('.m-menu__ul-2').not(p).slideUp();
                        $(this).closest('.m-menu__li-1').toggleClass('m-menu__li-1_active')
                    }

                    $(this).closest('.m-menu__info').next().slideToggle();
                });
            }

            const hYetShow = $('.h-yet__show');
            const hYetHide = $('.h-yet__hide');
            if(hYetShow.length && hYetHide.length) {
                hYetShow.click(function(event) {
                    $(this).parent().prev().addClass('h-hidden-show');
                    $(this).hide().next().show();
                });
                hYetHide.click(function(event) {
                    $(this).parent().prev().removeClass('h-hidden-show');
                    $(this).hide().prev().show();
                });
            }

            const fMobile = $('.f-mobile');
            if(fMobile.length) {
                $(document).on('click', '.f-filter-bar', function () {
                    fMobile.addClass('f-mobile_active');
                });
                $(document).on('click', '.f-mobile__close,.filter__button', function () {
                    fMobile.removeClass('f-mobile_active');
                    return false;
                });
            }

            if(insale.is_mobile) {
                const fItemTitle = $('.footer__item-title');
                if(fItemTitle.length) {
                    fItemTitle.click(function() {
                        $(this).find('.footer__item-down').toggleClass('footer__item-down_active');
                        $(this).next().slideToggle();
                    });
                }
            }

            if(insale.is_mobile) {
                const phoneHome = $('.h-phone__home');
                if(phoneHome.length) {
                    phoneHome.click(function() {
                        $(this).toggleClass('h-phone__home_active');
                    });

                    $(document).click(function(e) {
                        if($(e.target).closest('.h-mobile__top-phone').length) {
                            return;
                        }
                        phoneHome.removeClass('h-phone__home_active');
                        e.stopPropagation();
                    });
                }
            }

            $('.h-categ__slider').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:30,
                loop:false,
                responsive:{
                    0:{
                        margin:10,
                        items:2
                    },
                    580:{
                        margin:20,
                        items:3
                    },
                    767:{
                        margin:20,
                        items:4,
                    },
                    1280:{
                        items:5,
                    }
                },
                onInitialized:function(event){
                    $(event.currentTarget).addClass('h-categ__slider_active');
                },
            });

            $('.c-categ__slider').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:30,
                loop:false,
                responsive:{
                    0:{
                        margin:10,
                        items:2
                    },
                    580:{
                        margin:20,
                        items:3
                    },
                    1280:{
                        items:4,
                    }
                },
                onInitialized:function(event){
                    $(event.currentTarget).addClass('c-categ__slider_active');
                },
            });

            $('.r-reviews__sl-2').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                loop:false,
                responsive:{
                    0:{
                        items:1
                    },
                    680:{
                        items:2
                    }
                }
            });

            $('.r-reviews__sl-3').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                loop:false,
                responsive:{
                    0:{
                        items:1
                    },
                    680:{
                        items:2
                    },
                    980:{
                        items:3
                    }
                }
            });

            $('.r-reviews__sl-4').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                loop:false,
                responsive:{
                    0:{
                        items:1
                    },
                    680:{
                        items:2
                    },
                    980:{
                        items:3
                    },
                    1280:{
                        items:4
                    },
                }
            });

            $('.h-stock__slider').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:0,
                loop:true,
                responsive:{
                    0:{
                        margin:0,
                        items:1,
                    },
                    1180:{
                        margin:$('.in-left').length ? 0 : 20,
                        items: $('.in-left').length ? 1 : 2,
                    },
                }
            });

            $('.products_slider.h-products_col-2').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                autoHeight:false,
                responsive:{
                    0:{
                        items:1,
                        margin:10,
                    },
                    760:{
                        items:2
                    },
                    1400:{
                        margin:30,
                        items:2
                    }
                },
                onInitialized:function(event){
                    $(event.currentTarget).addClass('products_slider_active');
                },
            });

            $('.products_slider.h-products_col-3').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                autoHeight:false,
                responsive:{
                    0:{
                        items:1,
                        margin:10,
                    },
                    760:{
                        items:2
                    },
                    920:{
                        items:3
                    },
                    1080:{
                        items:2
                    },
                    1400:{
                        margin:30,
                        items:3
                    }
                },
                onInitialized:function(event){
                    $(event.currentTarget).addClass('products_slider_active');
                },
            });

            $('.products_slider.h-products_col-4').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                autoHeight:false,
                responsive:{
                    0:{
                        items:1,
                        margin:10,
                    },
                    760:{
                        items:2
                    },
                    920:{
                        items:3
                    },
                    1400:{
                        margin:30,
                        items:4
                    }
                },
                onInitialized:function(event){
                    $(event.currentTarget).addClass('products_slider_active');
                },
            });

            $('.products_slider.products_col-3').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                autoHeight:false,
                responsive:{
                    0:{
                        items:2,
                        margin:10
                    },
                    580:{
                        items:2
                    },
                    760:{
                        items:3
                    },
                    1400:{
                        margin:30,
                        items:3
                    }
                },
                onInitialized:function(event){
                    $(event.currentTarget).addClass('products_slider_active');
                },
            });

            $('.products_slider.products_col-4').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                autoHeight:false,
                responsive:{
                    0:{
                        items:2,
                        margin:10
                    },
                    580:{
                        items:2
                    },
                    760:{
                        items:3
                    },
                    920:{
                        items:4
                    },
                    1080:{
                        items:3
                    },
                    1400:{
                        margin:30,
                        items:4
                    }
                },
                onInitialized:function(event){
                    $(event.currentTarget).addClass('products_slider_active');
                },
            });

            $('.products_slider.products_col-5').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                autoHeight:false,
                responsive:{
                    0:{
                        items:2,
                        margin:10
                    },
                    580:{
                        items:2
                    },
                    760:{
                        items:3
                    },
                    920:{
                        items:4
                    },
                    1300:{
                        margin:30,
                        items:5
                    }
                },
                onInitialized:function(event){
                    $(event.currentTarget).addClass('products_slider_active');
                },
            });

            $('.products_slider.products_col-6').owlCarousel({
                lazyLoad: true,
                dots:false,
                nav:true,
                margin:20,
                autoHeight:false,
                responsive:{
                    0:{
                        items:2,
                        margin:10
                    },
                    500:{
                        items:3
                    },
                    760:{
                        items:4
                    },
                    920:{
                        items:5
                    },
                    1300:{
                        margin:30,
                        items:6
                    }
                },
                onInitialized:function(event){
                    $(event.currentTarget).addClass('products_slider_active');
                },
            });


            const upTop = $('.upTop') ;
            if(upTop.length) {
                $(window).scroll(function() {
                    if($(this).scrollTop() > 110)
                        upTop.addClass('upTop_active') ;
                    else
                        upTop.removeClass('upTop_active');
                }) ;
                upTop.click(function() {
                    $('body,html').scrollTop(100)
                    $('body,html').animate({scrollTop: 0}, 300);
                    return false ;
                }) ;
            }

            const getProducts = function(url, type, filterFun) {
                $(".c-products").addClass('c-products_loading');
                url = ~url.indexOf('?') ? url : location.pathname+'?';
                $.get(url+'&_=_', function (response) {
                    const content = $('<div>'+response+'</div>');
                    const products = content.find('.c-products');
                    $('.filter__sr').html(content.find('.filter__sr').html());

                    if(type) {
                        $(type).html(content.find(type).html());
                        filterFun();
                        stylerRadioChecbox();
                    }

                    $(".c-products")
                        .removeClass('c-products_loading')
                        .html(products.html());

                    if (!!(history.pushState && history.state !== undefined)) {
                        window.history.pushState({}, '', url);
                    }

                    //Lazy loading for filterings
                    insale.lazyLoad();
                    pTileSkusOptions();
                });
            };

            $(document).on('click', '.sorting__page-item', function () {
                $('.sorting__page-item').removeClass('sorting__page-item_sel');
                $(this).addClass('sorting__page-item_sel');

                $.cookie('products_per_page', +$(this).text());

                const url = location.href.split('?')[1];
                getProducts(url === undefined ? '?' : '?' + url);
            });

            $(document).on('click', '.sorting__switch', function () {
                $('.sorting__switch').removeClass('sorting__switch_active');
                $(this).addClass('sorting__switch_active');

                const sortingSswitch = $(this).data('view');
                $.cookie("sorting__switch", sortingSswitch, { expires: 30, path: '/'});

                const url = location.href.split('?')[1];
                getProducts(url === undefined ? '?' : '?' + url);
            });


            $(document).on('click', '.sorting__sort-name', function () {
                $(this).toggleClass('sorting__sort-name_active').next().toggleClass('sorting__sort-block_active');
            });

            $(document).on('click','.sorting__sort-list a', function(e) {
                e.preventDefault();
                getProducts($(this).attr('href'));
                $(document).click();
                return false;
            });

            $(document).click(function(e) {
                if ($(e.target).closest('.sorting__sort').length)
                    return
                $('.sorting').find('.sorting__sort-name').removeClass('sorting__sort-name_active').next().removeClass('sorting__sort-block_active');
                e.stopPropagation();
            });

            $('.filters-title').click(function() {
                $(this).toggleClass('filters-title_active');
            });

            window.filterSlider = function(cl) {
                $('.'+cl).find('.'+cl+'__sliders').each(function () {
                    if (!$(this).find('.'+cl+'-slider').length) {
                        $(this).append('<div class="'+cl+'-slider"></div>');
                    } else {
                        return;
                    }
                    const fParam = $(this).closest('.d-filter__param');
                    const min = $(this).find('.min');
                    const max = $(this).find('.max');
                    const minValue = parseFloat(min.attr('placeholder'));
                    const maxValue = parseFloat(max.attr('placeholder'));

                    let step = 1;
                    const slider = $(this).find('.'+cl+'-slider');

                    if (slider.data('step')) {
                        step = parseFloat(slider.data('step'));
                    } else {
                        const diff = maxValue - minValue;
                        if (Math.round(minValue) != minValue || Math.round(maxValue) != maxValue) {
                            var tail_length = 0;
                            try {
                                if (minValue > 0) {
                                    var min_tail = (minValue + "").split(".")[1];
                                    if (min_tail && min_tail.length) {
                                        tail_length = min_tail.length;
                                    }
                                }

                                if (maxValue > 0) {
                                    var max_tail = (maxValue + "").split(".")[1];
                                    if (max_tail && max_tail.length && max_tail.length > tail_length) {
                                        tail_length = max_tail.length;
                                    }
                                }
                            } catch(error) {
                                (console && console.log(error.message));
                            }

                            if (tail_length > 0) {
                                step = 1 / Math.pow(10, tail_length);
                            }
                        }
                    }

                    slider.slider({
                        create: function(event, ui) {},
                        range: true,
                        min: parseFloat(min.attr('placeholder')),
                        max: parseFloat(max.attr('placeholder')),
                        step: step,
                        values: [parseFloat(min.val().length ? min.val() : min.attr('placeholder')),
                            parseFloat(max.val().length ? max.val() : max.attr('placeholder'))],
                        slide: function( event, ui ) {
                            let minVal = ui.values[0] == $(this).slider('option', 'min') ? $(this).slider('option', 'min') : ui.values[0];
                            let maxVal = ui.values[1] == $(this).slider('option', 'max') ? $(this).slider('option', 'max') : ui.values[1];

                            if(minVal == minValue && maxVal == maxValue) {
                                min.val('');
                                max.val('');
                                fParam.removeClass('d-filter__param_active');
                            } else {
                                min.val(minVal);
                                max.val(maxVal);

                                fParam.addClass('d-filter__param_active');
                            }

                            if(minVal != minValue && maxVal != maxValue) {
                                fParam.find('.d-filter__name-v').text(2);

                            } else if(minVal != minValue || maxVal != maxValue) {
                                fParam.find('.d-filter__name-v').text(1);
                            }
                        },
                        change: function(event, ui) {},
                        stop: function (event, ui) {
                            min.change();
                        }
                    });
                    min.add(max).change(function () {
                        let v_min =  min.val() === '' ? slider.slider('option', 'min') : parseFloat(min.val());
                        let v_max = max.val() === '' ? slider.slider('option', 'max') : parseFloat(max.val());
                        if (v_max >= v_min) {
                            slider.slider('option', 'values', [v_min, v_max]);
                        }

                        if(v_min == minValue && v_max == maxValue) {
                            min.val('');
                            max.val('');
                            fParam.removeClass('d-filter__param_active');
                        } else {
                            min.val(v_min);
                            max.val(v_max);

                            fParam.addClass('d-filter__param_active');
                        }

                        if(v_min != minValue && v_max != maxValue) {
                            fParam.find('.d-filter__name-v').text(2);

                        } else if(v_min != minValue || v_max != maxValue) {
                            fParam.find('.d-filter__name-v').text(1);
                        }
                    });
                });
            }

            const ajaxFormCallback = function (f, type, filterFun) {
                const fields = f.serializeArray();
                const params = [];
                for(let i = 0; i < fields.length; i++) {
                    if (fields[i].value !== '') {
                        params.push(fields[i].name + '=' + fields[i].value);
                    }
                }
                let url = '?' + params.join('&');
                getProducts(url, type, filterFun);

                const dFilterFix = $('.d-filter-fix');
                if(dFilterFix.length && type != '.d-filter') {
                    let scrollTop = 0;
                    let prevParent = dFilterFix.prev();

                    if(!prevParent.length) {
                        prevParent = dFilterFix.parent();
                        scrollTop = prevParent.offset().top - 35;
                    } else {
                        scrollTop = prevParent.offset().top + prevParent.innerHeight();
                    }

                    if ($('.h-fix').length) {
                        scrollTop = scrollTop - $('.h-fix').innerHeight();
                    }

                    $('body,html').animate({scrollTop: scrollTop}, 200);
                }
            };

            $(document).on('click', '.f-finds__list', function() {
                const type = $(this).data('type');
                const code = $(this).data('code');

                if(type == 'price') {
                    $('.filter__param_price,.d-filter__param_price').find('input').val('');
                    $('.filter__param_price,.d-filter__param_price').find('input').first().change();

                } else if(type == 'checkbox') {
                    const val = $(this).data('value');
                    const inp = $('.filter,.d-filter').find('input[name="'+code+'[]"][value="'+val+'"]');
                    const lab = inp.closest('.filter__label,.d-filter__label');
                    if(inp.length && lab.length) {
                        inp.prop('checked', false);
                        lab.removeClass('filter__label_active d-filter__label_active');
                        ajaxFormCallback(inp.closest('form'));
                        labelChange(lab.closest('.d-filter__values'));
                    }

                } else if(type == 'slider') {
                    const inpMin = $('.filter,.d-filter').find('input[name="'+code+'[min]"]');
                    const inpMax = $('.filter,.d-filter').find('input[name="'+code+'[max]"]');
                    inpMin.val('');
                    inpMax.val('');
                    inpMin.change();
                    inpMin.closest('.d-filter__param').removeClass('d-filter__param_active');

                } else if(type == 'radio') {
                    const inp = $('.filter,.d-filter').find('input[name="'+code+'"][value=""]');
                    const lab = inp.closest('.filter__check,.d-filter__check').find('.filter__label,.d-filter__label');
                    if(inp.length && lab.length) {
                        inp.prop('checked', true);
                        lab.removeClass('filter__label_active d-filter__label_active');
                        ajaxFormCallback(inp.closest('form'));
                        labelChange(lab.closest('.d-filter__values'));
                    }
                }
            });

            $(document).on('click', '.f-finds__button', function (e) {
                e.preventDefault();
                filterReset($('.filter'));
                filterReset($('.d-filter'));
                getProducts($(this).data('url'));
                return false;
            });

            const filterFun = function() {
                const filter = $('.filter');
                if (filter.length) {
                    filter.find('.filter__bar').click(function () {
                        $(this).next().slideToggle();
                    });

                    filter.find('.filter__label').on('change', function () {
                        $(this).toggleClass('filter__label_active');
                        if(insale.filters_ajax)
                            ajaxFormCallback($(this).closest('form'), '.d-filter', dFilterFun);
                    });

                    filter.find('.filter__inp').on('change', function () {
                        if(insale.filters_ajax)
                            ajaxFormCallback($(this).closest('form'), '.d-filter', dFilterFun);
                    });

                    filter.find('form').on('submit', function () {
                        ajaxFormCallback($(this).closest('form'), '.d-filter', dFilterFun);
                        return false;
                    });

                    filter.find('.filter__label_active').each(function () {
                        $(this).closest('.filter__check').show().prev().addClass('filter__name_active');
                    })

                    filter.find('.filter__check-dop').each(function () {
                        $(this).find('label').each(function () {
                            if ($(this).hasClass('filter__label_active')) {
                                const filterCheckDop = $(this).closest('.filter__check-dop');
                                filterCheckDop.prev().hide();
                                filterCheckDop.show();
                            }
                        });
                    })

                    filter.find('.filter__check-all').click(function () {
                        $(this).hide();
                        $(this).next().show();
                    });

                    filter.find('.filter__check-all-no').click(function () {
                        $(this).parent().hide();
                        $(this).parent().prev().show();
                    });

                    filter.find('.filter__name').click(function () {
                        $(this).toggleClass('filter__name_active');
                        $(this).next().slideToggle(200);
                    });

                    filterSlider('filter');
                }
            };
            filterFun();

            const dFilterFun = function() {
                const dFilter = $('.d-filter');
                if(dFilter.length) {
                    dFilter.find('.d-filter__name').on('click', function() {
                        let parent = $(this).parent();
                        dFilter.find('.d-filter__param_click').not(parent).removeClass('d-filter__param_click');
                        parent.toggleClass('d-filter__param_click');
                    });

                    dFilter.find('.d-filter__label:not(.d-filter__label-r)').on('change', function() {
                        $(this).toggleClass('d-filter__label_active');
                        ajaxFormCallback($(this).closest('form'), '.filter', filterFun);
                        labelChange($(this).closest('.d-filter__values'));
                    });

                    dFilter.find('.d-filter__label-r').on('change', function() {
                        $(this).parent().find('.d-filter__label-r').removeClass('d-filter__label_active');

                        if($(this).find('input').val() != '') {
                            $(this).addClass('d-filter__label_active');
                        }
                        ajaxFormCallback($(this).closest('form'), '.filter', filterFun);
                        labelChange($(this).closest('.d-filter__values'));
                    });

                    dFilter.find('.d-filter__inp').on('change', function() {
                        ajaxFormCallback($(this).closest('form'), '.filter', filterFun);
                    });

                    dFilter.find('.d-filter__clear').on('click', function() {
                        const parent = $(this).closest('.d-filter__param').removeClass('d-filter__param_active');
                        const label = parent.find('.d-filter__label').removeClass('d-filter__label_active');
                        const fInput = parent.find('.d-filter__inp');
                        label.find('input').prop('checked', false);
                        fInput.val('');

                        if(fInput.length) {
                            fInput.change();
                        } else {
                            ajaxFormCallback($(this).closest('form'), '.filter', filterFun);
                        }
                    });

                    filterSlider('d-filter');
                }
            };
            dFilterFun();

            $(document).click(function(e) {
                if($(e.target).closest('.d-filter__param').length) {
                    return;
                }

                $('.d-filter__param_click').removeClass('d-filter__param_click');
                e.stopPropagation();
            });

            function labelChange(that) {
                const fParam = that.closest('.d-filter__param');

                if(that.find('.d-filter__label_active').length) {
                    fParam.addClass('d-filter__param_active');
                }

                let countActive = 0;
                that.find('label').each(function() {
                    if($(this).hasClass('d-filter__label_active'))
                        countActive = countActive + 1;
                });

                if(countActive == 0) {
                    fParam.removeClass('d-filter__param_active');
                } else {
                    fParam.find('.d-filter__name-v').text(countActive);
                }
            }

            function filterReset(filter) {
                if(filter.length) {
                    filter.find('input[type=checkbox]').removeAttr('checked');
                    filter.find('input[type=radio]').removeAttr('checked');
                    filter.find('.min').val('');
                    filter.find('.max').val('');
                    filter.find('.filter__label_active').removeClass('filter__label_active');
                    filter.find('.d-filter__label_active').removeClass('d-filter__label_active');
                    filter.find('.d-filter__param').removeClass('d-filter__param_active');

                    filter.find('.ui-slider').each(function () {
                        var options = $(this).slider('option');
                        $(this).slider('values', [options.min, options.max]);
                    });
                }
            }

            $(document).on('click', '.filter__reset', function (e) {
                e.preventDefault();
                filterReset($('.filter'));
                filterReset($('.d-filter'));
                getProducts($(this).data('url'));
                return false;
            });

            function currencyFormat(number) {
                let j,km,kw;
                let i = parseInt(number = (+number || 0).toFixed(insale.precision)) + "";

                if( (j = i.length) > 3 ){
                    j = j % 3;
                } else{
                    j = 0;
                }

                km = (j ? i.substr(0, j) + " " : "");
                kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + " ");
                kd = (insale.precision && number - i) ? "," + Math.abs(number - i).toFixed(insale.precision).replace(/-/, 0).slice(2) : "";

                let num =  km + kw + kd;

                if(insale.sign_delim == undefined ){
                    insale.sign_delim = ".";
                }

                if(!insale.sign_position)
                    return insale.sign + insale.sign_delim + num;

                return num + insale.sign_delim + insale.sign
            };


            $('body').on('click', '.products__yet:not(.in-loading)', function () {
                $(this).addClass('in-loading');

                const parent = $(this).closest('.in-blocks__item-s');
                const blockButton = $(this).closest('.in-blocks__item');
                const paginUrl = $('.pagin .selected').next().find('a').attr('href');

                $.get(paginUrl, function (response) {
                    const content = $('<div>'+response+'</div>');
                    const products = content.find('.c-products__dop');

                    blockButton.remove();
                    parent.append(products.children());

                    if (!!(history.pushState && history.state !== undefined)) {
                        window.history.pushState({}, '', paginUrl);
                    }

                    //Lazy loading for filterings
                    insale.lazyLoad();
                    pTileSkusOptions();
                });

            });


            $('body').on('click', '.mcart__item-delete', function () {
                const mcartItems = $(this).closest('.mcart__items');
                const mcartItem = $(this).closest('.mcart__item');
                const url = mcartItems.data('url');
                const id = $(this).data('id');

                mcartItem.fadeOut();

                $.post(url+'delete/', {html: 1, id: id}, function (rp) {
                    if (rp.data.count == 0) {
                        mcartItems.find('.mcart__h-f').show();
                        mcartItems.find('.mcart__content').hide();

                        $('.s-mcart_active').removeClass('s-mcart_active');
                        $('.mcart_active').removeClass('mcart_active');
                        $('.hicon__cart').removeClass('hicon__cart_active');
                        $('.hcount_active').removeClass('hcount_active');
                    }

                    $('.cart-count').text(rp.data.count).addClass('a-pulse');
                    $('.cart-price').html(rp.data.total);

                    setTimeout(function() {
                        $('.a-pulse').removeClass('a-pulse');
                    }, 600);

                }, "json");

            });

            const timer = $('.timer');
            if($.fn.countdowntimer && timer.length) {
                timer.each(function () {
                    $(this).html('');
                    const id = ($(this).attr('id') || 'js-promo-countdown' + ('' + Math.random()).slice(2));
                    $(this).attr('id', id);
                    const start = $(this).data('start').replace(/-/g, '/');
                    const end = $(this).data('end').replace(/-/g, '/');
                    $(this).countdowntimer({
                        startDate: start,
                        dateAndTime: end,
                        size: 'lg',
                        regexpMatchFormat: '([0-9]{1,3}):([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})',
                        regexpReplaceWith: ''+
                        '<div class="timer__item"><div class="timer__num">$1</div><div class="timer__name">'+insale.days+'</div></div>'+
                        '<div class="timer__item"><div class="timer__num">$2</div><div class="timer__name">'+insale.hours+'</div></div>'+
                        '<div class="timer__item"><div class="timer__num">$3</div><div class="timer__name">'+insale.minutes+'</div></div>'+
                        '<div class="timer__item"><div class="timer__num">$4</div><div class="timer__name">'+insale.seconds+'</div></div>'
                    });

                    if(start > end) {
                        $(this).remove();
                    }
                });
            }

            const timerLow = $('.timer-low');
            if($.fn.countdowntimer && timerLow.length) {
                timerLow.each(function () {
                    $(this).html('');
                    const id = ($(this).attr('id') || 'js-promo-countdown' + ('' + Math.random()).slice(2));
                    $(this).attr('id', id);
                    const start = $(this).data('start').replace(/-/g, '/');
                    const end = $(this).data('end').replace(/-/g, '/');
                    $(this).countdowntimer({
                        startDate: start,
                        dateAndTime: end,
                        size: 'lg',
                        regexpMatchFormat: '([0-9]{1,3}):([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})',
                        regexpReplaceWith: ''+
                        '<div class="timer-low__item">$1:</div>'+
                        '<div class="timer-low__item">$2:</div>'+
                        '<div class="timer-low__item">$3:</div>'+
                        '<div class="timer-low__item">$4</div>'
                    });

                    if(start > end) {
                        $(this).remove();
                    }
                });
            }

            function removeWrap() {
                $('.ss-modal').removeClass('ss-modal_active');
                $('.ss-modal-wrap').removeClass('ss-modal-wrap_active');
                $(".s-form-wrapper .show-write-form").removeClass("is-active");
                $('.m-bars').removeClass('m-bars_sel');
                $('.m-cMenu').removeClass('m-cMenu_active');
                setTimeout(function(){
                    $('html').css({
                        'margin-right':'',
                        'overflow':''
                    });
                    $('.ss-modal,.ss-modal-wrap').remove();
                }, 300);
            }

            $(document).on('click', '.ss-modal__close,.addCart__close', function() { removeWrap() });

            $(document).click(function(e) {
                if($(e.target).hasClass('ss-modal__content') || $(e.target).hasClass('ss-modal-wrap')) removeWrap();
            });

            $('.in-modal').click(function(){
                const id = $(this).attr('href');
                const modal = modalAdd();

                $('html').css({'overflow':'hidden'});

                if(!insale.is_mobile) {
                    $('html').css({'margin-right': '16px'});
                }

                modal.find('.ss-modal-wrap').addClass("ss-modal-wrap_active");

                setTimeout(function() {
                    commonModale(modal, $(id).clone().children());
                },100);
            })

            function modalAdd() {
                const modal = "" +
                    "    <div class=\"ss-modal-wrap\">" +
                    "      <div class=\"ss-modal-loading\">" +
                    "        <svg class=\"icon30 i-loading\"><use xlink:href=\"#i-loading\"></use></svg>" +
                    "      </div>" +
                    "    </div>" +
                    "    <div class=\"ss-modal\">" +
                    "      <div class=\"ss-modal__content\">" +
                    "        <div class=\"ss-modal__popup\">" +
                    "          <div class=\"ss-modal__close\">" +
                    "            <svg class=\"icon12 i-remove\"><use xlink:href=\"#i-remove\"></use></svg>" +
                    "          </div>" +
                    "        </div>" +
                    "      </div>" +
                    "    </div>";

                return $('body').prepend(modal);
            }

            function imagesProduct() {
                const pImages = $('.p-images');
                if(pImages.length) {
                    pImages.find('.p-images__dop-link').click(function(e, imgId) {
                        e.preventDefault;
                        pImages.find('.p-images__dop-link').removeClass('p-images__dop-link_active');
                        $(this).addClass('p-images__dop-link_active');

                        imgSlider.trigger("to.owl.carousel", [$(this).data('index'), 300]);

                        if(imgId && dopSlider) {
                            const ind = $('.p-images__dop-link[data-image-id="' + imgId + '"]').data('index');
                            const preview = dopSlider.find("[data-index='" + ind + "']");

                            dopSlider.find('.p-images__dop-link_active').removeClass('p-images__dop-link_active');
                            preview.addClass('p-images__dop-link_active');

                            if (!preview.parent().is(".active")) {
                                dopSlider.trigger("to.owl.carousel", [ind, 300]);
                            }
                        }

                        return false;
                    });

                    pImages.find('.p-images__slider-item').fancybox({
                        mobile : { clickSlide : "close"},
                        loop:true,
                    });

                    let dopSlider;

                    const imgSlider = $('.p-images__slider').owlCarousel({
                        dots:false,
                        nav:insale.product_images_arrow,
                        margin:10,
                        loop:true,
                        items:1,
                        onTranslated: function(event){
                            insale.lazyLoad().loadImages();
                            const ind = $('.p-images__slider .owl-item.active .p-images__slider-item').data('index');
                            const dopImg = dopSlider ? dopSlider : $('.p-images__dop-block');
                            const preview = dopImg.find("[data-index='" + ind + "']");

                            dopImg.find('.p-images__dop-link_active').removeClass('p-images__dop-link_active');
                            preview.addClass('p-images__dop-link_active');

                            if(dopSlider && !preview.parent().is(".active")) {
                                dopSlider.trigger("to.owl.carousel", [ind, 300]);
                            }
                        }
                    });



                    if($('.p-images__dop-slider-2').length) {
                        dopSlider = $('.p-images__dop-slider-2').owlCarousel({
                            lazyLoad: true,
                            dots:false,
                            margin:10,
                            loop:false,
                            nav:true,
                            responsive:{
                                0:{
                                    items:4
                                },
                                680:{
                                    items:5
                                },
                                767:{
                                    items:4
                                }
                            }
                        });
                    }

                    if($('.p-images__dop-slider').length) {
                        dopSlider = $('.p-images__dop-slider').owlCarousel({
                            lazyLoad: true,
                            dots:false,
                            margin:10,
                            loop:false,
                            nav:true,
                            responsive:{
                                0:{
                                    items:4
                                },
                                680:{
                                    items:5
                                },
                                767:{
                                    items:3
                                },
                                1084:{
                                    items:4
                                },
                                1280:{
                                    items:5
                                }
                            }
                        });
                    }
                }
            }

            imagesProduct();

            function commonModale(modal, content) {
                modal.find('.ss-modal-loading').remove();
                modal.find('.ss-modal').addClass("ss-modal_active");
                modal.find('.ss-modal__popup').append(content);
                stylerRadioChecbox();

                lazyImg = document.getElementsByClassName('lazy-loading-img');
                insale.lazyLoad().loadImages();

                imagesProduct();
            }

            function pTileSkusOptions() {
                const pCartOptions = $('.products__cart-options');
                if (pCartOptions.length) {
                    pCartOptions.find('select').on('change', function () {
                        const that = $(this).find("option:selected");
                        const p = $(this).closest('.products__item');
                        const pPriceNew = p.find('.products__price-new');
                        const pPriceOld = p.find('.products__price-old');
                        const pPriceOldP = p.find('.products__price-old-p');
                        const stock = p.find('.stock-label__price');
                        const percent = p.find('.stock-label__percent');

                        const price = that.data('price');
                        const comparePrice = that.data('compare-price');

                        pPriceNew.html(currencyFormat(price));
                        p.find('.products__code-v').text(that.data('code'));

                        if(comparePrice) {
                            pPriceOld.show();
                            pPriceOldP.html(currencyFormat(comparePrice));
                            if(stock.length) {
                                stock.html("-" + (currencyFormat(comparePrice - price)));
                                percent.html(Math.round((comparePrice - price)*100/comparePrice) + '%');
                            }
                        } else {
                            pPriceOld.hide();
                        }
                    });
                }

                const pCartSkus = $('.products__cart-skus');
                if (pCartSkus.length) {
                    pCartSkus.find('input').on('change', function () {
                        $(this).closest('.products__item').find('.products__code-v').text($(this).data('code'));
                    });
                }

                const pTile = $('.products__item');
                const pTileImg = $('.p-tile-img');
                if (pTile.length && pTileImg.length) {
                    pTile.on('mouseenter', function () {
                        $(this).find('.p-tile-img').addClass('p-tile-img_active');
                    });
                    pTile.on('mouseleave', function () {
                        pTileImg.removeClass('p-tile-img_active');
                    });
                }


                const pTileItem = pTile.find('.p-tile__item');
                if (pTile.length && pTileItem.length) {
                    pTile.on('mouseleave', function () {
                        const pImg = $(this).find('.products__img');
                        pImg.removeClass('products__img_active').eq(0).addClass('products__img_active');
                        $(this).find('.p-tile__item').removeClass('p-tile__item_active').eq(0).addClass('p-tile__item_active');
                    });

                    pTileItem.on('mouseenter', function () {
                        const ind = $(this).index();
                        const pTile = $(this).closest('.p-tile');
                        const pImg = pTile.find('.products__img');
                        pImg.removeClass('products__img_active').eq(ind).addClass('products__img_active');

                        pTile.find('.p-tile__item').removeClass('p-tile__item_active');
                        $(this).addClass('p-tile__item_active');
                    });
                }
            }

            pTileSkusOptions();

            $(document).on('click', '.p-view', function() {
                const button = $(this);
                const url = $(this).data('href');
                const modal = modalAdd();

                $('html').css({'overflow':'hidden'});

                if(!insale.is_mobile) {
                    $('html').css({'margin-right': '16px'});
                }

                modal.find('.ss-modal-wrap').addClass("ss-modal-wrap_active");

                $.get(url + '?ajax=1', function (response) {
                    const content = $(response);
                    commonModale(modal, content.find('.product__wrap_modal'));
                    resizeExecute();
                });

                return false;
            });

            $(document).on('submit', '.addtocart', function() {
                const f = $(this);
                const button = f.find('button[type=submit]');
                const appUrl = f.data('app-url');
                const getUrl = f.data('get');
                const url = f.data('url');
                const modal = modalAdd();

                if(getUrl) {
                    if(insale.is_mobile) {
                        location.href=url;
                        return false;
                    }

                    $('html').css({'overflow':'hidden'});

                    if(!insale.is_mobile) {
                        $('html').css({'margin-right': '16px'});
                    }

                    modal.find('.ss-modal-wrap').addClass("ss-modal-wrap_active");

                    $.get(url + '?ajax=1', function (response) {
                        const content = $(response);
                        commonModale(modal, content.find('.product__wrap_modal'));
                        resizeExecute();
                    });

                } else {
                    button.addClass('in-loading');

                    $.post(f.attr('action'), f.serialize(), function (response) {
                        if (response.status == 'ok') {
                            if (response.data.error) {
                                alert(response.data.error);
                                modal.find('.ss-modal').remove();
                                modal.find('.ss-modal-wrap').remove();

                            } else {
                                const mcartCount = $(".cart-count");
                                const mcartPrice = $(".cart-price");

                                button.removeClass('in-loading');

                                mcartPrice.html(response.data.total);
                                mcartCount.addClass('a-pulse hcount_active').html(response.data.count);

                                $('.s-mcart').addClass('s-mcart_active');
                                $('.mcart').addClass('mcart_active');
                                $('.hicon__cart').addClass('hicon__cart_active');

                                setTimeout(function () {
                                    mcartCount.removeClass('a-pulse');
                                }, 600);

                                $.get(appUrl + '?ajax=1', function (response) {
                                    const content = $(response);
                                    $('.mcart__items').html(content.html());
                                });

                                if(insale.modal_add) {
                                    $('html').css({'overflow': 'hidden'});

                                    if(!insale.is_mobile) {
                                        $('html').css({'margin-right': '16px'});
                                    }

                                    modal.find('.ss-modal-wrap').addClass("ss-modal-wrap_active");

                                    $.get(appUrl + '?item_id=' + response.data.item_id, function (response) {
                                        const content = $(response);
                                        commonModale(modal, content);
                                    });
                                }
                            }
                        } else if (response.status == 'fail') {
                            button.find('.i-loading').remove();
                            alert(response.errors);
                            modal.find('.ss-modal').remove();
                            modal.find('.ss-modal-wrap').remove();
                        }
                    }, "json");
                }

                return false;
            });

            $(document).on('click', '.s-last_count-remove-all', function () {
                $.cookie('viewed', null, {path: '/'});
                location.reload()
            });

            $(document).on('click', '.s-favorite_count-remove-all', function () {
                $.cookie('shop_favorite', null, {path: '/'});
                location.reload()
            });

            $(document).on('click', '.products__item-fav-remove', function () {
                let parent = $(this).closest('.products__item');
                parent.find('.p-favorit').click();
                parent.remove();
            });

            $(document).on('click', '.p-favorit', function () {
                const favCount = $(".favorits__count");
                let favorite = $.cookie('shop_favorite');

                if(favorite) {
                    favorite = favorite.split(',');
                } else {
                    favorite = [];
                }

                if($(this).hasClass('p-favorit_active')) {
                    $(this).removeClass('p-favorit_active');
                    var i = $.inArray($(this).data('product-id') + '', favorite);
                    if (i != -1) {
                        favorite.splice(i, 1);
                        if (favorite.length > 0) {
                            $.cookie('shop_favorite', favorite.join(','), {expires: 999, path: '/'});
                        } else {
                            $.cookie('shop_favorite', null, {path: '/'});
                        }
                    }

                } else {
                    $(this).addClass('p-favorit_active');
                    favorite.push($(this).data('product-id'));
                    $.cookie('shop_favorite', favorite.join(","), {expires: 999, path: '/'});
                }

                favCount.addClass('a-pulse hcount_active').text(favorite.length);
                $('.s-favorite_count').text(favorite.length);

                if(favorite.length == 0) {
                    favCount.removeClass('hcount_active');
                }

                setTimeout(function () {
                    favCount.removeClass('a-pulse');
                }, 600);

                return false;
            });

            $(document).on('click', '.p-compare', function () {
                const comCount = $('.compare__count,.m-compareCount');
                const favPanel = comCount.closest('.f-panel__item').find('.f-panel__add');
                let compare = $.cookie('shop_compare');
                let count;

                if($(this).hasClass('p-compare_active')) {
                    $(this).removeClass('p-compare_active');
                    if (compare) {
                        compare = compare.split(',');
                    } else {
                        compare = [];
                    }
                    const i = $.inArray($(this).data('product-id') + '', compare);

                    if (i != -1) {
                        compare.splice(i, 1)
                    }
                    if (compare.length > 0) {
                        $.cookie('shop_compare', compare.join(','), {expires: 30, path: '/'});
                        const url = $('.compare').attr('href');
                        $('.compare').attr('href', url);
                    } else {
                        $.cookie('shop_compare', null, {path: '/'});
                    }
                    count = compare.length;
                } else {
                    $(this).addClass('p-compare_active');
                    if (compare) {
                        compare += ',' + $(this).data('product-id');
                    } else {
                        compare = '' + $(this).data('product-id');
                    }
                    if (compare.split(',').length > 0) {
                        const url = $('.compare').attr('href').replace(/compare\/.*$/, 'compare/' + compare + '/');
                        $('.compare').attr('href', url);
                        count = compare.split(',').length;
                    }
                    $.cookie('shop_compare', compare, {expires: 30, path: '/'});

                    if(favPanel.length) {
                        favPanel.addClass('f-panel__add_active');
                        setTimeout(function () {
                            favPanel.removeClass('f-panel__add_active');
                        }, 800);
                    }
                }

                comCount.addClass('a-pulse hcount_active').text(count);

                if(count == 0) {
                    comCount.removeClass('hcount_active');
                }

                setTimeout(function () {
                    comCount.removeClass('a-pulse');
                }, 600);

                return false;
            });

            $(document).on('click', '.auth-type-wrapper a', function() {
                onProviderClick( $(this) );
                return false;
            });

            var onProviderClick = function( $link ) {
                var $li = $link.closest("li"),
                    provider = $li.data("provider");

                if (provider != 'guest' && provider != 'signup') {
                    var left = (screen.width-600)/ 2,
                        top = (screen.height-400)/ 2,
                        href = $link.attr("href");

                    if ( ( typeof require_authorization !== "undefined" ) && !require_authorization) {
                        href = href + "&guest=1";
                    }

                    window.open(href, "oauth", "width=600,height=400,left="+left+",top="+top+",status=no,toolbar=no,menubar=no");
                }
            };


            $('.subscribe form').submit(function () {
                var form = $(this);
                var email = form.find('input[name="subscriber[email]"]');
                var rules = form.find('input[name="rules"]');

                email.change(function() {
                    email.removeClass('subscribe_error');
                });

                rules.change(function() {
                    rules.closest('label').removeClass('subscribe_error');
                });

                if(!email.val() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.val())) {
                    email.addClass('subscribe_error');
                    return false;
                }

                if(!rules.prop("checked")) {
                    rules.closest('label').addClass('subscribe_error');
                    return false;
                }

                $.post(form.attr('action'), form.serialize(), function (rp) {
                    if(rp.status == 'fail') {
                        alert(rp.errors);
                    } else if(rp.status == 'ok') {
                        form.hide();
                        $('.subscribe__thank').show();
                        email.val('');
                    }
                }, "json");

                return false;
            });

            $(document).on('submit','.p-form form', function(e) {
                const f = $(this);

                f.find('.p-form__button')
                    .prepend("<svg class=\"icon16 i-loading\"><use xlink:href=\"#i-loading\"></use></svg> ")
                    .attr('disabled','disabled');

                $.ajax({
                    type: 'post',
                    dataType: 'html',
                    url: f.attr('action'),
                    data: f.serialize(),
                    beforeSend: function(){},
                    success: function(response){
                        const content = $(response);
                        $('.p-form').html(content.find('.p-form').html());
                        stylerRadioChecbox();
                    }
                });

                return false;
            });

            const promoClose = $('.h-promo__close');
            if(promoClose.length) {
                promoClose.click(function() {
                    $(this).closest('.h-promo').slideUp();
                    $.cookie("banner-hash", $(this).data('banner-hash'), {expires: 30, path: '/'});
                    console.log($(this).data('banner-hash'));
                    console.log($.cookie("banner-hash"));
                });
            }

            const pCookies = $('.f-cookies');
            if(pCookies.length) {
                pCookies.find('button').click(function () {
                    pCookies.fadeOut();
                    $.cookie("f-cookies", 'f-cookies', {expires: 30, path: '/'});
                });
            }

            $(document).on('click', '.counter__minus', function () {
                const parent = $(this).closest('.counter');
                let count = +parent.find('input').val()-1;
                if(count <= 1) count = 1;
                parent.find('input').val(count);
                return;
            });
            $(document).on('click', '.counter__plus', function () {
                const parent = $(this).closest('.counter');
                let count = +parent.find('input').val()+1;
                parent.find('input').val(count);
                return;
            });
            $(document).on('click', '.counter__count input', function () {
                const parent = $(this).closest('.counter');
                let count = +$(this).val();
                if(count < 1 || !isNumeric(count)) {
                    parent.find('input').val(1);
                }
                return;
            });

            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            const baseBanner = $('.baseBanner');
            if(baseBanner.length) {
                const time = baseBanner.data("time");
                const expires = baseBanner.data("expires");

                function bannerView() {
                    const baseBannerC = $.cookie('baseBanner');
                    const time = baseBanner.data("time");

                    if (baseBanner.length && !baseBannerC) {
                        const modal = modalAdd();

                        $('html').css({'overflow': 'hidden'});

                        if(!insale.is_mobile) {
                            $('html').css({'margin-right': '16px'});
                        }

                        modal.find('.ss-modal-wrap').addClass("ss-modal-wrap_active");

                        setTimeout(function () {
                            modal.find('.ss-modal-loading').remove();
                            modal.find('.ss-modal').addClass("ss-modal_active");
                            modal.find('.ss-modal__popup').prepend(baseBanner.html());
                        }, 300);

                        stylerRadioChecbox();

                        if (expires) {
                            $.cookie('baseBanner', 'true', {expires: expires, path: '/'});
                        }
                    }

                    if (!expires) {
                        $.cookie('baseBanner', null, {path: '/'});
                    }
                }

                setTimeout(bannerView, time ? time * 1000 : 10000);
            }

            const stCompare = $('.st-compare');
            if(stCompare.length) {
                let comapreSlPr, comapreSl;

                comapreSlPr = $('.st-compare__f-sl-pr').owlCarousel({
                    autoplay:false,
                    loop:false,
                    dots:false,
                    nav:true,
                    margin:0,
                    autoHeight:false,
                    responsive:{
                        0:{
                            items:1,
                            autoWidth:true
                        },
                        580:{
                            items:3
                        },
                        980:{
                            items:4
                        },
                        1200:{
                            items:5
                        }
                    },
                    onInitialized: heightFix,
                    onChanged: function(event) {
                        if(comapreSl)
                            comapreSl.trigger("to.owl.carousel", [event.item.index, 250]);
                    }
                });

                comapreSl = $('.st-compare__f-sl').owlCarousel({
                    autoplay:false,
                    loop:false,
                    dots:false,
                    nav:false,
                    margin:0,
                    autoHeight:false,
                    responsive:{
                        0:{
                            items:1,
                            autoWidth:true
                        },
                        580:{
                            items:3
                        },
                        980:{
                            items:4
                        },
                        1200:{
                            items:5
                        }
                    },
                    onInitialized: heightCol,
                    onChanged: function(event) {
                        if(comapreSlPr)
                            comapreSlPr.trigger("to.owl.carousel", [event.item.index, 250]);
                    },
                });

                function heightFix() {
                    $('.st-compare__fix-wrap').css({'height':$('.st-compare__fix').height() + 'px'});
                }

                $(window).resize(function(event) {
                    heightFix();
                });

                function heightCol() {
                    for(let i=0; i<999; i++) {
                        const item = $('.st-compare__ind-'+i);
                        let maxHeight = 50;
                        if(item.length) {
                            item.each(function() {
                                const heightItem = $(this).innerHeight();
                                if(heightItem > maxHeight) {
                                    maxHeight = heightItem;
                                }
                            });
                            item.css({'height':maxHeight+'px'});
                        } else {
                            break;
                        }
                    }
                }

                $(window).scroll(function() {
                    if($(this).scrollTop() > $('.st-compare').offset().top)
                        $('.st-compare__fix').addClass('st-compare__fix_active');
                    else
                        $('.st-compare__fix').removeClass('st-compare__fix_active');
                });
            }

            $(document).on('click','.review-block .pagin a', function(e) {
                e.preventDefault();
                let hFix = 0;
                let url = $(this).attr("href");

                if($('.h-fix').length) {
                    hFix = $('.h-fix').innerHeight();
                }

                $(".p-reviews__items").addClass('p-reviews__items_loading');
                $.get(url, function (response) {
                    const content = $('<div>'+response+'</div>');
                    const reviews = content.find('.p-reviews__items-wrap');
                    $(".p-reviews__items").removeClass('p-reviews__items_loading');
                    $(".p-reviews__items-wrap").html(reviews.html());
                });

                $('body,html').animate({scrollTop: $('.p-reviews').offset().top - hFix - 30}, 200) ;
                $(document).click();
                return false;
            });

            $(document).on('click','.products__img-yet-item', function(e) {
                const srcImg = $(this).data('src');
                const parent = $(this).closest('.products__img-yet');
                parent.find('.products__img-yet-item').removeClass('products__img-yet-item_active');
                $(this).addClass('products__img-yet-item_active');
                parent.prev().find('img').attr('src', srcImg);
            });

            (function() {
                const mLinks = $('.m-menu-links');
                const mCatalog = $('.m-menu-catalog');

                mCatalog.click(function () {
                    $(this).next().children().show();
                });

                mLinks.find('.m-menu-links__close').click(() => {
                    mLinks.find('.m-menu-links__dop').hide();
                    $('.bars').removeClass('bars_active');
                    $('.m-menu').removeClass('m-menu_active');
                });

                mLinks.find('.m-menu__info').click(function (e) {
                    if ($(this).find('.m-menu__down').length) {
                        e.stopPropagation();
                        $(this).next().show();
                        return false;
                    }
                });

                mLinks.find('.m-menu-links__prev').click(function () {
                    $(this).closest('.m-menu-links__dop').hide();
                });

                mLinks.find('.m-menu-links__title').click(function () {
                    $(this).closest('.m-menu-links__dop').hide();
                });
            })();

            const tab = $('.tab');
            if(tab.length) {
                tab.find('.h-menu__link:not(.h-menu__yet .h-menu__link),.h-menu__sub-link').click(function() {
                    const parent = $(this).closest('.tab');
                    const t = $(this).attr('href');
                    parent.find('.h-menu__link_active-tab').removeClass('h-menu__link_active-tab');
                    $(this).addClass('h-menu__link_active-tab');
                    parent.find('.tab__block').hide();
                    $(t).fadeIn();

                    parent.find('.h-menu__sub').hide();
                    return false;
                });

                tab.find('.h-menu__yet .h-menu__link').click(function() {
                    const parent = $(this).closest('.tab');
                    parent.find('.h-menu__sub').fadeIn();
                });

                $(document).click(function(e) {
                    if ($(e.target).closest('.tab__names .h-menu__yet').length)
                        return;
                    $('.tab__names .h-menu__sub').hide();
                    e.stopPropagation();
                });
            }

            const pMapsShow = $('.p-shops__maps-show');
            const pMapsHide = $('.p-shops__maps-hide');
            if(pMapsShow.length && pMapsShow.length) {
                pMapsShow.click(function () {
                    const parent = $(this).closest('.p-shops__item');
                    $(this).hide();
                    parent.find('.p-shops__maps').show();
                    parent.find('.p-shops__maps-hide').css('display', 'flex');
                });

                pMapsHide.click(function () {
                    const parent = $(this).closest('.p-shops__item');
                    $(this).hide();
                    parent.find('.p-shops__maps').hide();
                    parent.find('.p-shops__maps-show').show();
                });
            }

            const pAccordionTitle = $('.p-accordion__title');
            if(pAccordionTitle.length) {
                pAccordionTitle.click(function () {
                    const parent = $(this).closest('.p-accordion');
                    parent.find('.p-accordion__content').not($(this).next()).slideUp();
                    parent.find('.p-accordion__title').not($(this)).removeClass('p-accordion__title_active');

                    $(this).toggleClass('p-accordion__title_active');
                    $(this).next().stop(true).slideToggle();
                });
            }

            const pLAccordionTitle = $('.p-l-accordion__title');
            if(pLAccordionTitle.length) {
                $('.p-l-accordion__title-mobile').first().addClass('p-l-accordion__title_active');
                pLAccordionTitle.first().addClass('p-l-accordion__title_active');
                pLAccordionTitle.closest('.p-l-accordion').find('.p-l-accordion__item').first().addClass('p-l-accordion__item_active');

                pLAccordionTitle.not($('.p-l-accordion__title-mobile')).click(function () {
                    const parent = $(this).closest('.p-l-accordion');
                    parent.find('.p-l-accordion__title').removeClass('p-l-accordion__title_active');
                    $(this).addClass('p-l-accordion__title_active');

                    parent.find('.p-l-accordion__item').removeClass('p-l-accordion__item_active');
                    parent.find('.p-l-accordion__item').eq($(this).index()).addClass('p-l-accordion__item_active');
                });

                $('.p-l-accordion__title-mobile').click(function () {
                    const parent = $(this).closest('.p-l-accordion');
                    parent.find('.p-l-accordion__title').removeClass('p-l-accordion__title_active');
                    $(this).addClass('p-l-accordion__title_active');

                    parent.find('.p-l-accordion__item').removeClass('p-l-accordion__item_active');
                    $(this).parent().addClass('p-l-accordion__item_active');
                });
            }

            $(document).ajaxSuccess(function (event, jqXHR, ajaxOptions, response) {
                insale.lazyLoad().loadImages();
            });
        }
    }
});