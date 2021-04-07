'use sctrict'

jQuery.cookie=function(e,n,o){if(arguments.length>1&&(null===n||"object"!=typeof n)){if(o=jQuery.extend({},o),null===n&&(o.expires=-1),"number"==typeof o.expires){var t=o.expires,r=o.expires=new Date;r.setDate(r.getDate()+t)}return document.cookie=[encodeURIComponent(e),"=",o.raw?String(n):encodeURIComponent(String(n)),o.expires?"; expires="+o.expires.toUTCString():"",o.path?"; path="+o.path:"",o.domain?"; domain="+o.domain:"",o.secure?"; secure":""].join("")}o=n||{};var i,p=o.raw?function(e){return e}:decodeURIComponent;return(i=new RegExp("(?:^|; )"+encodeURIComponent(e)+"=([^;]*)").exec(document.cookie))?p(i[1]):null};

$(function() {
    $.panelEdit = {
        csrf: '',
        action: '',
        colors: {},

        init: function(options) {
            this.csrf = options.csrf;
            this.action = options.action;
            this.colors = options.colors;
            this.start();
        },

        start: function() {
            this.saveSettings();
            this.removeImg();
            this.itemInfo();
            this.panelEdit();
            this.panelView();
            this.panelClose();
            this.settingItem();
            this.imageActive();
            this.sortable();
            this.colorPicker();
        },

        saveSettings: function() {
            $('.e-panel__item-save').click(function() {
                if(!$(this).hasClass('e-panel__item-save_loading')) {
                    const button = $(this);
                    const f = $('.e-panel__block_active form');
                    const data = getData(f);
                    button.addClass('e-panel__item-save_loading');

                    if(f.length && data) {
                        $.ajax({
                            url: f.attr('action'),
                            data: data,
                            cache: false,
                            contentType: false,
                            processData: false,
                            type: 'POST',
                            success: function (r) {
                                if (r.status === "fail") {
                                    console.error("Error", r.errors);
                                    button.removeClass('e-panel__item-save_loading');
                                } else {
                                    location.reload();
                                }
                            },
                            error: function (jqXHR, errorText) {
                                console.error("Error", errorText);
                                button.removeClass('e-panel__item-save_loading');
                            }
                        });
                    } else if(!data) {
                        button.removeClass('e-panel__item-save_loading');
                    } else {
                        alert('Не нашли активную форму');
                    }
                }
            });

            function getData(that) {
                let error = false;
                let fieldsData = that.serializeArray(),
                    formData = new FormData();

                $.each(fieldsData, function () {
                    const field = $(this)[0];
                    formData.append(field.name, field.value);
                });

                const images = that.find('.e-panel__images');
                if (images.length) {
                    $.each(images, function (i, fileData) {
                        const file = $(this)[0].files[0];
                        if(file)
                            if(!file.type.match(/(.png)|(.jpeg)|(.jpg)|(.gif)$/i)) {
                                alert('Поддерживаются только форматы (*.jpg, *.jpeg, *.png, *.gif)');
                                error = true;
                            } else if ((file.size / 1024).toFixed(0) > 1024) {
                                alert('Размер файла не должен быть больще 1МБ');
                                error = true;
                            } else {
                                formData.append(fileData.name, $(this)[0].files[0]);
                            }
                    });
                }
                if(error) return false;
                return formData;
            }
        },

        removeImg: function() {
            $('.e-panel__s-color-img-remove').click(function() {
                const parent = $(this).parent();
                parent.prev().find('.e-panel__images-hidden').val('');
                parent.remove();
            });
        },

        itemInfo: function() {
            const info = $('.e-panel__item-info');
            if(info.length) {
                info.click(function() {
                    $('body').toggleClass('show-block');
                });
            }
        },

        panelEdit: function() {
            const that = this;
            const type = {
                'site': 'left_site_blocks',
                'shop': 'left_shop_blocks',
                'category': 'left_category_blocks',
                'blog': 'left_blog_blocks',
                'category_right': 'category_right_blocks',
                'home': 'home_blocks',
                };

            $(document).on('click', '.e-panel-edit__block', function () {
                $('.e-panel__item-settings').trigger('click');
                $('.e-panel__settings').trigger('click');
                const element = $('[data-group="'+$(this).parent().data('group-edit')+'"]');
                const parent = element.parent();
                parent.find('.e-panel__level_active').removeClass('e-panel__level_active');
                element.addClass('e-panel__level_active');
                parent.closest('.e-panel__block').find('.e-panel__setting_active').removeClass('e-panel__setting_active');
                parent.parent().addClass('e-panel__setting_active');
            });

            $(document).on('click', '.e-panel-edit__up', function () {
                const leftRight = $(this).closest('.in-left,.in-right');
                const id = leftRight.find('[name="e-panel-edit-type"]').val();
                const parent = $(this).closest('.in-blocks__item,.in-left__item');
                parent.prev().before(parent.clone(true));
                parent.remove();

                if(type[id]) {
                    saveBloks(type[id], getBlocksLeft(leftRight));
                }
            });

            $(document).on('click', '.e-panel-edit__down', function () {
                const leftRight = $(this).closest('.in-left,.in-right');
                const id = leftRight.find('[name="e-panel-edit-type"]').val();
                const parent = $(this).closest('.in-blocks__item,.in-left__item');
                parent.next().after(parent.clone(true));
                parent.remove();

                if(type[id]) {
                    saveBloks(type[id], getBlocksLeft(leftRight));
                }
            });

            $(document).on('click', '.e-panel-edit__slach', function () {
                const leftRight = $(this).closest('.in-left,.in-right');
                const id = leftRight.find('[name="e-panel-edit-type"]').val();
                const parent = $(this).closest('.in-blocks__item,.in-left__item');

                if($(this).hasClass('e-panel-edit__slach_active')) {
                    parent.remove();
                    saveBloks(type[id], getBlocksLeft(leftRight));
                } else {
                    parent.removeClass('e-panel-edit-block-hidden').css('opacity','.5').find('.e-panel-edit').hide();
                    saveBloks(type[id], getBlocksLeft(leftRight));
                    setTimeout(()=>location.reload(),200);
                }
            });

            function getBlocksLeft(leftRight) {
                const blocks = [];
                leftRight.find('>.in-left__item,>.in-blocks__item ').not('.e-panel-edit-block-hidden').each(function() {
                    blocks.push($(this).find('.e-panel-edit').data('id'));
                });
                return blocks;
            }

            function saveBloks(type, blocks) {
                $('[name="settings['+type+']"]').val(blocks.join(','));

                let formData = new FormData();
                formData.append('_csrf', $(that.csrf).val());
                formData.append('settings['+type+']', blocks.join(','));
                save(formData);
            }

            function save(data) {
                $.ajax({
                    url: that.action,
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (r) {
                        if (r.status === "fail") {
                            console.error("Error", r.errors);
                        }
                    },
                    error: function (jqXHR, errorText) {
                        console.error("Error", errorText);
                    }
                });
            }
        },

        panelView: function() {
            const that = this;
            const bodyWidth = $('body').width();

            $('.e-panel__item-colors').click(function() {
                if(bodyWidth > '1700') {
                    if (!$('.e-panel__block-colors').hasClass('e-panel__block_active')) {
                        $('html').css({'padding-left': '406px', 'transition': 'all .2s ease-out'});
                        $('.h-fix').css({'padding-left': '406px', 'transition': 'all .2s ease-out'});
                        $('.f-panel').css({'padding-left': '406px', 'transition': 'all .2s ease-out'});
                    } else {
                        $('html').css({'padding-left': '0'});
                        $('.h-fix').css({'padding-left': '0'});
                        $('.f-panel').css({'padding-left': '0'});
                    }

                    setTimeout(function () {
                        $('html').scrollTop($('html').scrollTop() + 1);
                        $('html').scrollTop($('html').scrollTop() - 1);
                    }, 400);
                }

                $('.e-panel-bg').trigger('click');
                $('.e-panel__block-colors').toggleClass('e-panel__block_active');
                $('.e-panel__block-settings').removeClass('e-panel__block_active');

                if($('.e-panel__block_active').length) {
                    $('.e-panel__item-save').addClass('e-panel__item-save_active');
                } else {
                    $('.e-panel__item-save').removeClass('e-panel__item-save_active');
                }
            });

            $('.e-panel__item-settings').click(function() {
                $('html').css({'padding-left': '0'});
                $('.h-fix').css({'padding-left': '0'});
                $('.f-panel').css({'padding-left': '0'});

                $('.e-panel__block-settings').toggleClass('e-panel__block_active');
                $('.e-panel__block-colors').removeClass('e-panel__block_active');

                if($('.e-panel__block_active').length) {
                    $('.e-panel__item-save').addClass('e-panel__item-save_active');
                    $('html').css({'overflow':'hidden','margin-right': '16px','transition':'none'});
                    $('.e-panel-bg').addClass('e-panel-bg_active');
                } else {
                    $('.e-panel__item-save').removeClass('e-panel__item-save_active');
                    setTimeout(()=> {
                        $('html').css({'margin-right':'','overflow':''});
                        $('.e-panel-bg').removeClass('e-panel-bg_active');
                    }, 200);
                }
            });

            $('.e-panel-bg').click(function() {
                $(this).removeClass('e-panel-bg_active');
                $('.e-panel__block-settings').removeClass('e-panel__block_active');
                $('.e-panel__item-save').removeClass('e-panel__item-save_active');
                setTimeout(()=> {
                    $('html').css({'margin-right':'','overflow':''});
                    $('.e-panel-bg').removeClass('e-panel-bg_active');
                }, 200);
            });
        },

        panelClose: function() {
            $('.e-panel__item-close').click(function() {
                $('.e-panel__sidebar').removeClass('e-panel__sidebar_active');
                $('.e-panel__block').removeClass('e-panel__block_active');
                $('.e-panel__item-save').removeClass('e-panel__item-save_active');
                $('.e-panel__settings').addClass('e-panel__settings_active');
                $('.e-panel-bg').removeClass('e-panel-bg_active');
                $.cookie('sidebar_active', null, { expires: 30, path: '/'});
                $('html').css({'padding-left':'0'});
                $('.h-fix').css({'padding-left':'0'});
                $('.f-panel').css({'padding-left':'0'});
            });

            $('.e-panel__settings').click(function() {
                $('.e-panel__sidebar').addClass('e-panel__sidebar_active');
                $('.e-panel__settings').removeClass('e-panel__settings_active');
                $.cookie('sidebar_active', 'sidebar_active', { expires: 30, path: '/'});
            });
        },

        settingItem: function() {
            $('.e-panel__level-1').click(function() {
                const parent = $(this).closest('.e-panel__block');
                parent.find('.e-panel__setting').not($(this).parent()).removeClass('e-panel__setting_active');
                $(this).parent().toggleClass('e-panel__setting_active');
                $.cookie('panel__setting', $(this).data('group'), { expires: 30, path: '/'});


                if(!$(this).next().find('.e-panel__level_active').length && !$(this).closest('.e-panel__block-colors').length) {
                    $(this).next().find('.e-panel__level-2').first().trigger('click');
                }
            })

            $('.e-panel__level-2').click(function() {
                const parent = $(this).closest('.e-panel__setting');
                parent.find('.e-panel__level-2').not($(this)).removeClass('e-panel__level_active');
                $(this).toggleClass('e-panel__level_active');
                $.cookie('level_active', $(this).data('group'), { expires: 30, path: '/'});
            })
        },

        imageActive: function() {
            $('.e-panel__dop-image-value label').change(function() {
                const parent = $(this).parent();
                parent.find('.e-panel__dop-image-active').removeClass('e-panel__dop-image-active');
                $(this).addClass('e-panel__dop-image-active');
            });
        },

        sortable: function() {
            let that = this;

            try {
                sortable('.header__top-wrap .header__wrap', '.header__midd-wrap .header__wrap,.header__bott-wrap .header__wrap');
                sortable('.header__midd-wrap .header__wrap', '.header__top-wrap .header__wrap,.header__bott-wrap .header__wrap');
                sortable('.header__bott-wrap .header__wrap', '.header__top-wrap .header__wrap,.header__midd-wrap .header__wrap');
            } catch (err) {}

            function sortable(cl, connect) {
                $(cl).sortable({
                    connectWith: connect,
                    out: function(e,u) {
                        scrollTopBody();
                    },
                    update: function(e,u) {
                        scrollTopBody();

                        const topBloks = $('.header__top-wrap .header__wrap').sortable('toArray', {attribute: "data-id"});
                        const middBloks = $('.header__midd-wrap .header__wrap').sortable('toArray', {attribute: "data-id"});
                        const bottBloks = $('.header__bott-wrap .header__wrap').sortable('toArray', {attribute: "data-id"});

                        $('[name="settings[header_top_blocks]"]').val(topBloks.join(','));
                        $('[name="settings[header_midd_blocks]"]').val(middBloks.join(','));
                        $('[name="settings[header_bott_blocks]"]').val(bottBloks.join(','));

                        let formData = new FormData();
                        formData.append('_csrf', $(that.csrf).val());
                        formData.append('settings[header_top_blocks]', topBloks.join(','));
                        formData.append('settings[header_midd_blocks]', middBloks.join(','));
                        formData.append('settings[header_bott_blocks]', bottBloks.join(','));
                        save(formData);
                    }
                }).disableSelection();
            }

            function scrollTopBody() {
                $('html').scrollTop($('html').scrollTop() + 1);
                $('html').scrollTop($('html').scrollTop() - 1);
            }

            function save(data) {
                $.ajax({
                    url: that.action,
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (r) {
                        if (r.status === "fail") {
                            console.error("Error", r.errors);
                        }
                    },
                    error: function (jqXHR, errorText) {
                        console.error("Error", errorText);
                    }
                });
            }
        },

        colorPicker: function() {
            const that = this;

            $('.e-panel__s-color-picker').each(function() {
                const parent = $(this).parent();
                const input = parent.find('.e-panel__s-color-value input');
                const icon = parent.find('.color');

                let farbtastic = $.farbtastic($(this), function(color) {
                    icon.css('background', color);
                    input.val(color).change();
                });

                farbtastic.setColor(input.val());

                let timerChange;
                input.change(function() {
                    if (timerChange) {
                        clearTimeout(timerChange);
                    }
                    timerChange = setTimeout(function() {
                        setVarCss(input.data('key'), input.val());
                    }, 200);
                });

                let timer;
                input.unbind('keydown').bind('keydown', function() {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function() {
                        farbtastic.setColor(input.val());
                        setVarCss(input.data('key'), input.val());
                    }, 250);
                });
            });

            $('.e-panel__s-color-value input').focus(function(){
                const picker = $(this).parent().next();
                $('.e-panel__s-color-picker').not(picker).hide();
                picker.toggle();
            });

            $('.e-panel__s-color-replacer').click(function(){
                const picker = $(this).parent().next();
                $('.e-panel__s-color-picker').not(picker).hide();
                picker.toggle();
            });

            $(document).click(function(e) {
                if ($(e.target).closest('.e-panel__s-color-value').length || $(e.target).closest('.e-panel__s-color-picker').length)
                    return;
                $('.e-panel__s-color-picker').hide();
                e.stopPropagation();
            });

            function setVarCss(name, value) {
                document.documentElement.style.setProperty(that.colors[name], value);
            }
        }
    }
});