var ReviewImagesSection = ( function($) {

    ReviewImagesSection = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options["$wrapper"];
        that.$file_field = that.$wrapper.find(".js-file-field");
        that.$files_wrapper = that.$wrapper.find(".js-attached-files-section");
        that.$errors_wrapper = that.$wrapper.find(".js-errors-section");
        // CONST
        that.max_post_size = options["max_post_size"];
        that.max_file_size = options["max_file_size"];
        that.max_files = options["max_files"];
        that.templates = options["templates"];
        that.patterns = options["patterns"];
        that.locales = options["locales"];

        // DYNAMIC VARS
        that.post_size = 0;
        that.id_counter = 0;
        that.files_data = {};
        that.images_count = 0;

        // INIT
        that.init();
    };

    ReviewImagesSection.prototype.init = function() {
        var that = this,
            $document = $(document);

        that.$wrapper.data("controller", that);

        that.$file_field.on("change", function() {
            addFiles(this.files);
            that.$file_field.val("");
        });

        that.$wrapper.on("click", ".js-show-textarea", function(event) {
            event.preventDefault();
            $(this).closest(".s-description-wrapper").addClass("is-extended");
        });

        that.$wrapper.on("click", ".js-delete-file", function(event) {
            event.preventDefault();
            var $file = $(this).closest(".s-file-wrapper"),
                file_id = "" + $file.data("file-id");

            if (file_id && that.files_data[file_id]) {
                var file_data = that.files_data[file_id];
                that.post_size -= file_data.file.size;
                delete that.files_data[file_id];
                that.images_count -= 1;
            }

            $file.remove();

            that.renderErrors();
        });

        that.$wrapper.on("keyup change", ".js-textarea", function(event) {
            var $textarea = $(this),
                $file = $textarea.closest(".s-file-wrapper"),
                file_id = "" + $file.data("file-id");

            if (file_id && that.files_data[file_id]) {
                var file = that.files_data[file_id];
                file.desc = $textarea.val();
            }
        });

        var timeout = null,
            is_entered = false;

        $document.on("dragover", dragWatcher);
        function dragWatcher(event) {
            var is_exist = $.contains(document, that.$wrapper[0]);
            if (is_exist) {
                onDrag(event);
            } else {
                $document.off("dragover", dragWatcher);
            }
        }

        $document.on("drop", dropWatcher);
        function dropWatcher(event) {
            var is_exist = $.contains(document, that.$wrapper[0]);
            if (is_exist) {
                onDrop(event)
            } else {
                $document.off("drop", dropWatcher);
            }
        }

        $document.on("reset clear", resetWatcher);
        function resetWatcher(event) {
            var is_exist = $.contains(document, that.$wrapper[0]);
            if (is_exist) {
                that.reset();
            } else {
                $document.off("reset clear", resetWatcher);
            }
        }

        function onDrop(event) {
            event.preventDefault();

            var files = event.originalEvent.dataTransfer.files;

            addFiles(files);
            dropToggle(false);
        }

        function onDrag(event) {
            event.preventDefault();

            if (!timeout)  {
                if (!is_entered) {
                    is_entered = true;
                    dropToggle(true);
                }
            } else {
                clearTimeout(timeout);
            }

            timeout = setTimeout(function () {
                timeout = null;
                is_entered = false;
                dropToggle(false);
            }, 100);
        }

        function dropToggle(show) {
            var active_class = "is-highlighted";

            if (show) {
                that.$wrapper.addClass(active_class);
            } else {
                that.$wrapper.removeClass(active_class);
            }
        }

        function addFiles(files) {
            var errors_types = [],
                errors = [];

            $.each(files, function(i, file) {
                var response = that.addFile(file);
                if (response.error) {
                    var error = response.error;

                    if (errors_types.indexOf(error.type) < 0) {
                        errors_types.push(error.type);
                        errors.push(error);
                    }
                }
            });

            that.renderErrors(errors);
        }
    };

    ReviewImagesSection.prototype.addFile = function(file) {
        var that = this,
            file_size = file.size;

        var image_type = /^image\/(png|jpe?g|gif)$/,
            is_image = (file.type.match(image_type));

        if (!is_image) {
            return {
                error: {
                    text: that.locales["file_type"],
                    type: "file_type"
                }
            };

        } else if (that.images_count >= that.max_files) {
            return {
                error: {
                    text: that.locales["files_limit"],
                    type: "files_limit"
                }
            };

        } else if (file_size >= that.max_file_size) {
            return {
                error: {
                    text: that.locales["file_size"],
                    type: "file_size"
                }
            };

        } else if (that.post_size + file_size >= that.max_file_size) {
            return {
                error: {
                    text: that.locales["post_size"],
                    type: "post_size"
                }
            };

        } else {
            that.post_size += file_size;

            var file_id = that.id_counter,
                file_data = {
                    id: file_id,
                    file: file,
                    desc: ""
                };

            that.files_data[file_id] = file_data;

            that.id_counter++;
            that.images_count += 1;

            render();

            return file_data;
        }

        function render() {
            var $template = $(that.templates["file"]),
                $image = $template.find(".s-image-wrapper");

            $template.attr("data-file-id", file_id);

            getImageUri().then( function(image_uri) {
                $image.css("background-image", "url(" + image_uri + ")");
            });

            that.$files_wrapper.append($template);

            function getImageUri() {
                var deferred = $.Deferred(),
                    reader = new FileReader();

                reader.onload = function(event) {
                    deferred.resolve(event.target.result);
                };

                reader.readAsDataURL(file);

                return deferred.promise();
            }
        }
    };

    ReviewImagesSection.prototype.reset = function() {
        var that = this;

        that.post_size = 0;
        that.id_counter = 0;
        that.files_data = {};

        that.$files_wrapper.html("");
        that.$errors_wrapper.html("");
    };

    ReviewImagesSection.prototype.getSerializedArray = function() {
        var that = this,
            result = [];

        var index = 0;

        $.each(that.files_data, function(file_id, file_data) {
            var file_name = that.patterns["file"].replace("%index%", index),
                desc_name = that.patterns["desc"].replace("%index%", index);

            result.push({
                name: file_name,
                value: file_data.file
            });

            result.push({
                name: desc_name,
                value: file_data.desc
            });

            index++;
        });

        return result;
    };

    ReviewImagesSection.prototype.renderErrors = function(errors) {
        var that = this,
            result = [];

        that.$errors_wrapper.html("");

        if (errors && errors.length) {
            $.each(errors, function(i, error) {
                if (error.text) {
                    var $error = $(that.templates["error"].replace("%text%", error.text));
                    $error.appendTo(that.$errors_wrapper);
                    result.push($error);
                }
            });
        }

        return result;
    };

    return ReviewImagesSection;

})(jQuery);

$(function() {
    $(document).on("click", ".p-reviews_button", function() {
        const reviewsForm = $(".p-reviews__form");

        reviewsForm.find(".p-reviews__form-item-rates").show();
        reviewsForm.find("form").trigger("reset");
        reviewsForm.find("input[name=\"parent_id\"]").val(0);
        reviewsForm.find(".p-reviews__form-title_add").show();
        reviewsForm.find(".p-reviews__form-title_reply").hide();
        reviewsForm.find(".p-reviews__form-good_add").show();
        reviewsForm.find(".p-reviews__form-good_reply").hide();
        reviewsForm.find(".p-reviews__form-button-add").show();
        reviewsForm.find(".p-reviews__form-button-reply").hide();

        showForm(reviewsForm);

        return false;
    });

    $(document).on("click", ".p-reviews__form-rates .star", function() {
        const parent = $(this).parent();
        const rateCount = $(this).data("rate-count");
        const input = parent.find("input[name=\"rate\"]");
        const stars = parent.find('.star');

        if (rateCount && rateCount > 0) {
            stars.addClass('star-empty');

            for ( var i = 0; i < rateCount; i++ ) {
                $(stars[i]).removeClass('star-empty');
            }

            input.val(rateCount);
        }

        return false;
    });

    $('.p-reviews__form form').submit( function() {
        const that = $(this);
        const url = that.data('url');
        const formData = getData(that)

        $.ajax({
            url: url,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(r) {
                if (r.status === "fail") {
                    showErrors(that, r.errors);
                    refreshCaptcha(that);
                } else {
                    // Save new review ID to sStorage
                    if (sessionStorage) { sessionStorage.setItem("review-id", r.data.id); }

                    that.next().show();
                    that.remove();
                }
            },
            error: function(jqXHR, errorText) {
                console.error("Error", errorText);
            }
        });

        function getData(that) {
            let fieldsData = that.serializeArray(),
                formData = new FormData();

            $.each(fieldsData, function () {
                var field = $(this)[0];
                formData.append(field.name, field.value);
            });

            let imageSection = that.find(".js-review-images-section");
            if (imageSection.length) {
                let controller = imageSection.data("controller"),
                    data = controller.getSerializedArray();

                $.each(data, function(i, fileData) {
                    formData.append(fileData.name, fileData.value);
                });
            }

            return formData;
        }

        return false;
    });

    $(document).on("click", ".p-reviews__item-reply-name", function() {
        const reviewItem = $(this).closest(".p-reviews__item");
        const parentId = reviewItem.data("id");
        const reviewsForm = $(".p-reviews__form");

        reviewsForm.find(".p-reviews__form-item-rates").hide();
        reviewsForm.find("form").trigger("reset");
        reviewsForm.find("input[name=\"parent_id\"]").val(parentId);
        reviewsForm.find(".p-reviews__form-title_add").hide();
        reviewsForm.find(".p-reviews__form-title_reply").show();
        reviewsForm.find(".p-reviews__form-good_add").hide();
        reviewsForm.find(".p-reviews__form-good_reply").show();
        reviewsForm.find(".p-reviews__form-button-add").hide();
        reviewsForm.find(".p-reviews__form-button-reply").show();

        showForm(reviewsForm);

        return false;
    });

    var showForm = function(reviewsForm) {
        const modal = modalAdd();

        setTimeout(function(){
            $('html').css({'overflow':'hidden'});

            if(!reviewsForm.data('is-mobile')) {
                $('html').css({'margin-right': '16px'});
            }

            modal.find('.ss-modal-wrap').addClass("ss-modal-wrap_active");
            modal.find('.ss-modal').addClass("ss-modal_active");
            modal.find('.ss-modal__popup').append(reviewsForm.clone().show());

            refreshCaptcha(modal.find('.p-reviews__form form'));

            if(window.ReviewImagesSectionOption) {
                ReviewImagesSectionOption.$wrapper = $(".ss-modal__popup .js-review-images-section");
                new ReviewImagesSection(window.ReviewImagesSectionOption);
            }

            modal.find('.p-reviews__form form').submit( function() {
                const that = $(this);
                const url = that.data('url');
                const formData = getData(that)

                $.ajax({
                    url: url,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function(r) {
                        if (r.status === "fail") {
                            showErrors(that, r.errors);
                            refreshCaptcha(that);
                        } else {
                            // Save new review ID to sStorage
                            if (sessionStorage) { sessionStorage.setItem("review-id", r.data.id); }

                            that.next().show();
                            that.remove();
                        }
                    },
                    error: function(jqXHR, errorText) {
                        console.error("Error", errorText);
                    }
                });

                function getData(that) {
                    let fieldsData = that.serializeArray(),
                        formData = new FormData();

                    $.each(fieldsData, function () {
                        var field = $(this)[0];
                        formData.append(field.name, field.value);
                    });

                    let imageSection = that.find(".js-review-images-section");
                    if (imageSection.length) {
                        let controller = imageSection.data("controller"),
                            data = controller.getSerializedArray();

                        $.each(data, function(i, fileData) {
                            formData.append(fileData.name, fileData.value);
                        });
                    }

                    return formData;
                }

                return false;
            });
        }, 100);
    }

    var showErrors = function(f, errors) {
        let errorsForm = f.find(".p-reviews__form-errors");
        errorsForm.html("");

        for (var name in errors) {
            let error = $("<div class=\"error\" />");
            error.text(errors[name]);
            errorsForm.append(error);
        }
    };

    var modalAdd = function() {
        const modal = "" +
            "    <div class=\"ss-modal-wrap\"></div>\n" +
            "    <div class=\"ss-modal\">\n" +
            "      <div class=\"ss-modal__content\">\n" +
            "        <div class=\"ss-modal__popup\">\n" +
            "          <div class=\"ss-modal__close\"><svg class=\"icon12 i-remove\"><use xlink:href=\"#i-remove\"></use></svg></div>" +
            "        </div>" +
            "      </div>" +
            "    </div>";

        return $('body').prepend(modal);
    }

    var refreshCaptcha = function($form) {
        if (window.grecaptcha) {
            $form.find('.g-recaptcha.initialized').after('<div class="g-recaptcha"></div>');
            $form.find('.g-recaptcha.initialized').remove();
            window.onloadWaRecaptchaCallback();

        } else {
            $form.find('div.wa-captcha .wa-captcha-refresh').click(function () {
                var div = $(this).parents('div.wa-captcha');
                var captcha = div.find('.wa-captcha-img');
                if (captcha.length) {
                    captcha.attr('src', captcha.attr('src').replace(/\?.*$/, '?rid=' + Math.random()));
                    captcha.one('load', function () {
                        div.find('.wa-captcha-input').focus();
                    });
                }
                ;
                div.find('input').val('');
                return false;
            });
            $form.find(".wa-captcha-refresh").trigger("click");
        }
    };

    $('.p-reviews__images-slider').owlCarousel({
        dots:false,
        loop:$('.p-reviews__images-slider a').length > 10 ? true: false,
        nav:true,
        margin:5,
        autoWidth:true,
        autoHeight:false,
        items:10,
        onInitialized:function(event){
            $(event.currentTarget).addClass('p-reviews__images-slider_active');
        },
    });
});