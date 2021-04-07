$(function () {
    const product = $('.product');
    const linkName = product.find('.product__rating-link-name');
    const featuresAll = product.find('.product__features-all');


    scrollTab(linkName, "#reviews");
    scrollTab(featuresAll, "#features");

    function scrollTab(cl, tab) {
        cl.click(function(event) {
            let t = $('*[href="'+tab+'"]');
            let scrollTop;

            if(t.length) {
                scrollTop = t.offset().top - 30;

                if($('.h-fix').length) {
                    scrollTop -= $('.h-fix').innerHeight();
                }

                $('body,html').animate({scrollTop: scrollTop}, 400);
                t.trigger('click').addClass('h-menu__link_active-tab');

            } else {
                t = $(tab);
                if(t.length) {
                    scrollTop = t.offset().top - 30;
                    if($('.h-fix').length) {
                        scrollTop -= $('.h-fix').innerHeight();
                    }
                    $('body,html').animate({scrollTop: scrollTop}, 400);
                }
            }
        });
    }

    const pTab = $('.p-tabs');
    if(pTab.length) {
        pTab.find('.p-tabs__item').click(function() {
            if(!$(this).hasClass('p-tabs__item_active')) {
                const parent = $(this).closest('.p-tabs');
                const ind = $(this).index();

                parent.find('.p-tabs__item').removeClass('p-tabs__item_active');
                $(this).addClass('p-tabs__item_active');

                parent.find('.p-tabs__block').hide();
                parent.find('.p-tabs__block').eq(ind).fadeIn(300);
            }
            return false;
        });
    }

    const buttonProduct = $('.product__button');
    if(buttonProduct.length && MatchMedia("only screen and (max-width: 768px)")) {
        const topButton = buttonProduct.offset().top + 0;
        const topFooter = $('.footer').offset().top - $('body,html').innerHeight();
        $(window).scroll(function() {
            const fPanel = $('.f-panel');
            const fPanel2 = $('.f-panel-2');
            const parent = buttonProduct.closest('.product__cart');
            if($(this).scrollTop() > topButton && $(this).scrollTop() < topFooter) {
                parent.css({'height':+parent.innerHeight() + 'px'});
                buttonProduct.addClass('product__button-fix');
                if(fPanel.length) {
                    buttonProduct.css({'bottom':fPanel.innerHeight() + 10 + (fPanel2.length?10:0) + 'px'});
                }
            } else {
                parent.css({'height':''});
                buttonProduct
                    .removeClass('product__button-fix')
                    .css({'bottom':''});
            }
        }) ;
    }

    function MatchMedia(media_query) {
        var matchMedia = window.matchMedia,
            is_supported = (typeof matchMedia == 'function');
        if (is_supported && media_query) {
            return matchMedia(media_query).matches;
        } else {
            return false;
        }
    }

    $('.tooltip').tooltip({
        position: {
            my: "left top",
            at: "right+5 top-5",
            collision: "none"
        },
        items: "[data-title]",
        content: function() {
            var element = $( this );
            if ( element.is( "[data-title]" ) ) {
                return element.attr( "data-title" );
            }
        }
    });
});

function Product(form, options) {
    this.first = true;
    this.form = $(form);
    this.add2cart = this.form.find(".add2cart");
    this.button = this.add2cart.find(".product__button");
    for (var k in options) {
        this[k] = options[k];
    }

    var self = this;
    // add to cart block: services
    this.form.find(".services input[type=checkbox]").click(function () {
        var obj = $('select[name="service_variant[' + $(this).val() + ']"]');
        if (obj.length) {
            if ($(this).is(':checked')) {
                obj.removeAttr('disabled');
            } else {
                obj.attr('disabled', 'disabled');
            }
        }
        self.cartButtonVisibility(true);
        self.updatePrice();
    });

    this.form.find(".services .service-variants").on('change', function () {
        self.cartButtonVisibility(true);
        self.updatePrice();
    });

    this.form.find('.inline-select a').click(function () {
        var d = $(this).closest('.inline-select');
        d.find('a.selected').removeClass('selected');
        $(this).addClass('selected');
        d.find('.sku-feature').val($(this).data('value')).change();
        return false;
    });

    this.form.find(".skus input[type=radio]").click(function () {
        if ($(this).data('image-id')) {
            $('.p-images__dop-link[data-image-id="'+$(this).data('image-id')+'"]').trigger('click',$(this).data('image-id'));
            $('.p-images__dop-link[data-image-id="'+$(this).data('image-id')+'"]').click();
        }
        if ($(this).data('disabled')) {
            self.button.attr('disabled', 'disabled');
        } else {
            self.button.removeAttr('disabled');
        }
        var sku_id = $(this).val();
        self.updateSkuServices(sku_id);
        self.cartButtonVisibility(true);
        self.updatePrice();

        if(!self.first && self.product_sku_url) {
            self.updateURL(sku_id);
        }
        self.first = false;

        self.updateFeaturesSku(sku_id)
    });

    var $initial_cb = this.form.find(".skus input[type=radio]:checked:not(:disabled)");
    if (!$initial_cb.length) {
        $initial_cb = this.form.find(".skus input[type=radio]:not(:disabled):first").prop('checked', true).click();
    }

    setTimeout(()=>$initial_cb.click(), 300);

    if(this.form.find('*[name="sku_id"]')) {
        this.form.find(".art-" + this.form.find('*[name="sku_id"]').val()).show().parent().show();
    }

    this.form.find(".sku-feature").change(function () {
        var sku_id = null;
        var key = "";
        self.form.find(".sku-feature").each(function () {
            key += $(this).data('feature-id') + ':' + $(this).val() + ';';
        });

        var sku = self.features[key];
        if(sku) {
            sku_id = sku.id;
            if (sku.image_id) {
                $('.p-images__dop-link[data-image-id="' + sku.image_id + '"]').trigger('click',sku.image_id);
                $('.p-images__dop-link[data-image-id="' + sku.image_id + '"]').click();
            }
            self.updateSkuServices(sku.id);
            if (sku.available) {
                self.button.removeAttr('disabled');

                self.add2cart.find(".product__price").data('price', sku.price);
                self.cartButtonVisibility(true);
                self.updatePrice(sku.price, sku.compare_price);
            }
        }

        if(!sku || (sku && !sku.available)) {
            self.form.find("div.stocks div.stock__block").hide();
            self.form.find(".sku-no-stock").show();
            self.button.attr('disabled', 'disabled');
            self.add2cart.find(".compare-at-price").hide();
            self.add2cart.find(".product__price").hide();
            self.add2cart.find('.product__price-dis').hide();
        }

        if(!self.first && self.product_sku_url) {
            self.updateURL(sku_id);
        }
        self.first = false;

        self.updateFeaturesSku(sku_id)
    });

    setTimeout(()=>this.form.find(".sku-feature:first").change(), 300);

    if (!this.form.find(".skus input:radio:checked").length) {
        this.form.find(".skus input:radio:enabled:first").attr('checked', 'checked');
    }

    this.form.submit(function () {
        const f = $(this);
        const appUrl = f.data('app-url');
        const mod = f.data('modal');
        const button = f.find('.product__button');
        let delay = 0;

        if(self.modal_add && !mod) {
            $('.ss-modal__close').click();
            delay = 300;
        } else {
            delay = 0;
        }

        button.addClass('in-loading');

        setTimeout(function() {
            const modal = modalAdd();

            $.post(f.attr('action') + '?html=1', f.serialize(), function (response) {
                if (response.status == 'ok') {
                    if (response.data.error) {
                        alert(response.data.error);
                        button.removeClass('in-loading');
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
                        }, 1000);

                        $.get(appUrl + '?ajax=1', function (response) {
                            const content = $(response);
                            $('.mcart__items').html(content.html());
                        });

                        if (self.modal_add) {
                            $('html').css({'overflow': 'hidden', 'margin-right': '16px'});
                            modal.find('.ss-modal-wrap').addClass("ss-modal-wrap_active");

                            $.get(appUrl + '?item_id=' + response.data.item_id, function (response) {
                                const content = $(response);
                                modal.find('.ss-modal-loading').remove();
                                modal.find('.ss-modal').addClass("ss-modal_active");
                                modal.find('.ss-modal__popup').append(content);
                            });
                        }
                    }

                } else if (response.status == 'fail') {
                    alert(response.errors);
                    button.removeClass('in-loading');
                    modal.find('.ss-modal').remove();
                    modal.find('.ss-modal-wrap').remove();
                }
            }, "json");
        }, delay);

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

        return false;
    });

}
Product.prototype.getEscapedText = function( bad_string ) {
    return $("<div>").text( bad_string ).html();
};

Product.prototype.currencyFormat = function (number, no_html) {
    // Format a number with grouped thousands
    //
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     bugfix by: Michael White (http://crestidg.com)

    var i, j, kw, kd, km;
    var decimals = this.currency.frac_digits;
    var dec_point = this.currency.decimal_point;
    var thousands_sep = this.currency.thousands_sep;

    // input sanitation & defaults
    if( isNaN(decimals = Math.abs(decimals)) ){
        decimals = 2;
    }
    if( dec_point == undefined ){
        dec_point = ",";
    }
    if( thousands_sep == undefined ){
        thousands_sep = ".";
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

    if( (j = i.length) > 3 ){
        j = j % 3;
    } else{
        j = 0;
    }

    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
    kd = (decimals && (number - i) ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


    var number = km + kw + kd;
    var s = no_html ? this.currency.sign : this.currency.sign_html;
    if (!this.currency.sign_position) {
        return s + this.currency.sign_delim + number;
    } else {
        return number + this.currency.sign_delim + s;
    }
};

Product.prototype.serviceVariantHtml= function (id, name, price) {
    return $('<option data-price="' + price + '" value="' + id + '"></option>').text(name + ' (+' + this.currencyFormat(price, 1) + ')');
};

Product.prototype.updateSkuServices = function (sku_id) {
    this.form.find("div.stocks div.stock__block").hide();
    this.form.find(".sku-" + sku_id + "-stock").show();


    this.form.find(".product__code").hide().find('span').hide();
    this.form.find(".art-" + sku_id).show().parent().show();

    for (var service_id in this.services[sku_id]) {
        var v = this.services[sku_id][service_id];
        if (v === false) {
            this.form.find(".service-" + service_id).hide().find('input,select').attr('disabled', 'disabled').removeAttr('checked');
        } else {
            this.form.find(".service-" + service_id).show().find('input').removeAttr('disabled');
            if (typeof (v) == 'string') {
                this.form.find(".service-" + service_id + ' .service-price').html(this.currencyFormat(v));
                this.form.find(".service-" + service_id + ' input').data('price', v);
            } else {
                var select = this.form.find(".service-" + service_id + ' .service-variants');
                var selected_variant_id = select.val();
                for (var variant_id in v) {
                    var obj = select.find('option[value=' + variant_id + ']');
                    if (v[variant_id] === false) {
                        obj.hide();
                        if (obj.attr('value') == selected_variant_id) {
                            selected_variant_id = false;
                        }
                    } else {
                        if (!selected_variant_id) {
                            selected_variant_id = variant_id;
                        }
                        obj.replaceWith(this.serviceVariantHtml(variant_id, v[variant_id][0], v[variant_id][1]));
                    }
                }
                this.form.find(".service-" + service_id + ' .service-variants').val(selected_variant_id);
            }
        }
    }
};

Product.prototype.updateFeaturesSku = function (sku_id) {
    var f = $('table.features-'+sku_id);
    var pF = $('.product__features-'+sku_id);

    if(f.length) {
        $('table.features').hide();
        $('table.features-' + sku_id).css({'display':'table'});
    }

    if(pF.length) {
        $('.product__features').hide();
        $('.product__features-' + sku_id).css({'display':'flex'});
    }
}

Product.prototype.updateURL = function (sku_id) {
    var key_name = "sku";
    var search_object = stringToObject(window.location.search.substring(1));

    if (sku_id) {
        search_object[key_name] = sku_id;
    } else {
        delete search_object[key_name];
    }

    var search_string = objectToString(search_object);
    var new_URL = location.origin + location.pathname + search_string + location.hash;

    if (typeof history.replaceState === "function") {
        history.replaceState(null, document.title, new_URL);
    }

    function stringToObject(string) {
        var result = {};

        string = string.split("&");

        $.each(string, function(i, value) {
            if (value) {
                var pair = value.split("=");
                result[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] ? pair[1] : "" );
            }
        });

        return result;
    }

    function objectToString(object) {
        var result = "",
            array = [];

        $.each(object, function(key, value) {
            array.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        });

        if (array.length) {
            result = "?" + array.join("&");
        }

        return result;
    }
}

Product.prototype.updatePrice = function (price, compare_price) {
    if (price === undefined) {
        var input_checked = this.form.find(".skus input:radio:checked");
        if (input_checked.length) {
            var price = parseFloat(input_checked.data('price'));
            var compare_price = parseFloat(input_checked.data('compare-price'));
        } else {
            var price = parseFloat(this.add2cart.find(".product__price").data('price'));
            var compare_price = parseFloat(this.add2cart.find(".compare-at-price").data('price'));
        }
    }

    if (compare_price) {
        if (!this.add2cart.find(".compare-at-price").length) {
            this.add2cart.find('.product__prices').prepend('<span class="compare-at-price nowrap product__price-old"></span>');
        }

        this.add2cart.find(".product__price-old").show();
        this.add2cart.find(".compare-at-price").html(this.currencyFormat(compare_price)).data('price',compare_price);
    } else {
        this.add2cart.find(".product__price-old").hide();
        this.add2cart.find(".compare-at-price").empty().data('price',0);
    }

    var self = this;
    this.form.find(".services input:checked").each(function () {
        var s = $(this).val();
        if (self.form.find('.service-' + s + ' .service-variants').length) {
            price += parseFloat(self.form.find('.service-' + s + ' .service-variants :selected').data('price'));

            if(compare_price)
                compare_price += parseFloat(self.form.find('.service-' + s + ' .service-variants :selected').data('price'));
        } else {
            price += parseFloat($(this).data('price'));

            if(compare_price)
                compare_price += parseFloat($(this).data('price'));
        }
    });

    if(compare_price) {
        this.add2cart.find(".compare-at-price").html(this.currencyFormat(compare_price));

        var disPrecent = (Math.round((compare_price - price)*100/compare_price * 100))/100;
        this.add2cart.find(".product__price-dis-percent").html(disPrecent+'%');
        this.add2cart.find(".product__price-dis-number").html('-'+this.currencyFormat((compare_price-price)));
        this.add2cart.find(".product__price-dis").show();
    }

    if(this.add2cart.find(".product__price").data('zero-text') && price == 0) {
        price = '<span class="products__zero-text">' + this.add2cart.find(".product__price").data('zero-text') + "</span>";
        self.button.attr('disabled', 'disabled');
        this.add2cart.find(".product__bonus").hide();
    } else {
        var credit = this.add2cart.find('.product__bonus-count-num').data('credit-rate');
        this.add2cart.find(".product__bonus").show();
        this.add2cart.find('.product__bonus-count-num').html((price/credit).toFixed(2));
        price = this.currencyFormat(price);
    }

    this.add2cart.find(".product__price").html(price);
}

Product.prototype.cartButtonVisibility = function (visible) {
    //toggles "Add to cart" / "%s is now in your shopping cart" visibility status
    if (visible) {
        this.add2cart.find('.compare-at-price').show();
        this.add2cart.find('input[type="submit"]').show();
        this.add2cart.find('.product__price').show();
        this.add2cart.find('.qty').show();
    }
}
