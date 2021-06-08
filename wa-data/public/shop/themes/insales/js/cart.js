var Cart = ( function($) {

    Cart = function(options) {

        var that = this;

        // DOM
        that.$wrapper = ( options["$wrapper"] || false );
        that.$url = ( options["$url"] || false );
        that.$appUrl = ( options["$appUrl"] || false );
        that.$products = that.$wrapper.find(".s-cart-products");
        that.$services = that.$products.find(".s-product-services");
        that.$cartAffiliateHint = $("#s-affiliate-hint-wrapper p");
        that.$cartDiscount = $("#s-cart-discount");
        that.$cartDiscountWrapper = $("#cart-discount-wrapper");
        that.$cartTotal = $("#cart-total");
        that.$cartTotalProd = $("#s-cart-prod");

        // VARS
        that.error_class = "has-error";

        // INIT
        this.bindEvents();
    };

    // Events
    Cart.prototype.bindEvents = function() {
        var that = this,
            $wrapper = that.$wrapper,
            $product = that.$products,
            $productServices = that.$services;

        $product.on("click", ".counter__plus", function() {
            var $currentProduct = $(this).closest(".c-item");
            that.changeProductQuantity("positive", $currentProduct);
            return false;
        });

        $product.on("click", ".counter__minus", function() {
            var $currentProduct = $(this).closest(".c-item");
            that.changeProductQuantity("negative", $currentProduct);
            return false;
        });

        $product.on("change", ".counter__count input", function() {
            that.onChangeProductQuantity( $(this) );
            return false;
        });

        $product.on("click", ".c-item__remove", function() {
            that.deleteProduct( $(this).closest(".c-item") );
            return false;
        });

        $productServices.on("change", "select", function() {
            that.onServiceChange( $(this) );
            return false;
        });

        $productServices.on("change", "input[type=\"checkbox\"]", function() {
            that.onServiceCheck( $(this) );
            return false;
        });

        $("#cancel-affiliate").on("click", function () {
            that.cancelAffiliate( $(this) );
            return false;
        });

        $("#use-coupon").on("click", function () {
            that.useCoupon( $(this) );
            return false;
        });

        $(window).bind("load", function() {
            $('.counter__count input').trigger('change');
        });
    };

    Cart.prototype.onServiceCheck = function($input) {
        var that = this,
            $product = $input.closest(".c-item"),
            $deferred = $.Deferred(),
            product_id = $product.data("id"),
            is_checked = $input.is(":checked"),
            input_val = $input.val(),
            $field = $('[name="service_variant[' + product_id + '][' + input_val + ']"]'),
            $service = $input.closest(".s-service"),
            request_data = {};

        // Toggle service <select>
        if ($field.length) {
            if (is_checked) {
                $field.removeAttr('disabled');
            } else {
                $field.attr('disabled', 'disabled');
            }
        }

        if (is_checked) {
            request_data = {
                html: 1,
                parent_id: product_id,
                service_id: input_val
            };

            // If variants exits, adding to request_data
            if ($field.length) {
                request_data["service_variant_id"] = $field.val();
            }

            $.post('add/', request_data, function(response) {
                $deferred.resolve(response);
            }, "json");

            $deferred.done( function(response) {
                // Set ID
                $service.data("id", response.data.id);

                // Set Product Total
                var $productTotal = $product.find(".c-item__price");
                $productTotal.html(response.data.item_total);

                // Update Cart Total
                that.updateCart($product, response.data);
            });

        } else {

            request_data = {
                html: 1,
                id: $service.data('id')
            };

            $.post('delete/', request_data, function (response) {
                $deferred.resolve(response);
            }, "json");

            $deferred.done( function(response) {
                // Set ID
                $service.data('id', null);

                // Set Product Total
                var $productTotal = $product.find(".c-item__price");
                $productTotal.html(response.data.item_total);

                // Update Cart Total
                that.updateCart($product, response.data);
            });
        }

    };

    Cart.prototype.useCoupon = function($target ) {
        var that = this,
            $discountWrapper = that.$cartDiscountWrapper;

        // Hide link
        $target.hide();

        // Render Discount
        $discountWrapper.show();

        // Render Coupon Field
        $("#apply-coupon-code").show();
    };

    Cart.prototype.cancelAffiliate = function($link) {
        var that = this,
            $form = $link.closest('form');

        // Adding Affiliate Field
        $form.append("<input type=\"hidden\" name=\"use_affiliate\" value=\"0\">");

        // Submit
        $form.submit();
    };

    Cart.prototype.onServiceChange = function($select) {
        var that = this,
            $product = $select.closest(".c-item"),
            $deferred = $.Deferred(),
            $service = $select.closest(".s-service"),
            request_data = {
                html: 1,
                id: $service.data("id"),
                service_variant_id: $select.val()
            };

        $.post(that.$url + "save/", request_data, function (response) {
            $deferred.resolve(response);
        }, "json");

        $deferred.done( function(response) {

            // Render Product Total
            $product.find('.c-item__price').html(response.data.item_total);

            // Render Cart Total
            that.updateCart($product, response.data);
        });
    };

    Cart.prototype.updateCart = function($product, data ) {
        var that = this,
            $cartTotal = that.$cartTotal,
            $cartDiscountWrapper = that.$cartDiscountWrapper,
            $cartAffiliateBonus = that.$cartAffiliateHint,
            $cartDiscount = that.$cartDiscount,
            text = data["total"],
            affiliate = data["add_affiliate_bonus"],
            count = data["count"];

        // Render Total
        $.get(location.href, function (response) {
            const content = $(response);
            $('#s-cart-prod').html(content.find('#s-cart-prod').html());

            $cartTotal.html(text);
            $cartAffiliateBonus.html(affiliate);
        });

        $('.cart-count').text(count).addClass('a-pulse');
        $('.cart-price').html(text);

        $.get(that.$appUrl + '?ajax=1', function (response) {
            const content = $(response);
            $('.mcart__items').html(content.html());
        });

        setTimeout(function() {
            $('.a-pulse').removeClass('a-pulse');
        }, 600);

        // Render Discount
        if (data.discount) {
            $cartDiscountWrapper.show();
            $cartDiscount.html('&minus; ' + data.discount);
        } else {
            $cartDiscountWrapper.hide();
        }

        // Render Affiliate Bonus
        if (data.add_affiliate_bonus) {
            $cartAffiliateBonus
                .show()
                .html(data.add_affiliate_bonus);
        } else {
            $cartAffiliateBonus
                .hide();
        }
    };

    Cart.prototype.changeProductQuantity = function(type, $product) {
        var that = this,
            $quantityInput = $product.find(".counter__count input"),
            current_val = parseInt( $quantityInput.val() ),
            is_disabled = ( $quantityInput.attr("disabled") === "disabled"),
            disable_time = 800,
            new_val;

        if (type === "positive") {
            new_val = current_val + 1;
        } else if (type === "negative") {
            new_val = current_val - 1;
        }

        // Set new value
        if (!is_disabled) {

            if ( new_val > 0 ) {
                $quantityInput.attr("disabled","disabled");

                $quantityInput.val(new_val);

                // Recalculate Price
                $quantityInput.change();

                setTimeout( function() {
                    $quantityInput.attr("disabled", false)
                }, disable_time);

                // If volume is zero => remove item from basket
            } else {

                this.deleteProduct($product);
            }
        }
    };

    Cart.prototype.onChangeProductQuantity = function( $input ) {
        var that = this,
            $product = $input.closest(".c-item"),
            $deferred = $.Deferred(),
            $sum_wrapper = $product.find(".c-item__price"),
            product_quantity = parseInt( $input.val() ),
            request_data;

        // Check for STRING Data at Quantity Field
        if ( isNaN( product_quantity ) ) {
            product_quantity = 1;
        }
        $input.val( product_quantity );

        // Data for Request
        request_data  = {
            html: 1,
            id: $product.data('id'),
            quantity: product_quantity
        };

        // If Quantity 1 or more
        if (product_quantity > 0) {

            $.post(that.$url + "save/", request_data, function (response) {
                $product.find(".c-item__p-count").text(product_quantity);

                $deferred.resolve(response);
            }, "json");


            $deferred.done( function(response) {
                $sum_wrapper.html( response.data.item_total );

                if (response.data.q) {
                    $input.val( response.data.q );
                    $product.find(".c-item__p-count").text(response.data.q);
                }

                if (response.data.error) {
                    $input.addClass(that.error_class);

                    // at Future make it better ( renderErrors(errors) )
                    alert(response.data.error);

                } else {

                    $input.removeClass(that.error_class);

                }

                that.updateCart($product, response.data);
            });

        // Delete Product
        } else if (product_quantity == 0) {
            that.deleteProduct($product );
        }
    };

    Cart.prototype.deleteProduct = function($product ) {
        var that = this,
            $deferred = $.Deferred(),
            request_data = {
                html: 1,
                id: $product.data('id')
            };

        $.post("delete/", request_data, function (response) {
            $deferred.resolve(response);
        }, "json");

        $deferred.done( function(response) {
            if (response.data.count == 0) {
                location.reload();
            } else {
                $product.parent().remove();
                that.updateCart($product, response.data);
            }
        });

    };

    // Initialize
    return Cart;

})(jQuery);