/* 
* Cong Min & Sudan
*/
$(function() {
    /* component组件 - begin */
    var component = {};
    /* willUp添加up */
    component.flow = (function() {
        var t = 0,
            /* 清除时间t */
            clean = function(){
                t = 0;
            },
            /* 添加up */
            up = function(e) {
                setTimeout(function() {
                    $(e).addClass("up")
                }, t);
                t += 200;
            },
            /* 除去up */
            down = function(e){
                $(e).removeClass("up");
            },
            /* 交替up */
            toggle = function(e){
                setTimeout(function() {
                    $(e).toggleClass("up")
                }, t);
                t += 200;
            };
        return {
            clean: clean,
            up: up,
            down: down,
            toggle: toggle
        }
    })();


    /* 翻页插件 */
    component.Page = (function() {
        var config = {
                $bookBlock: $('#bb-bookblock'),
                $navNext: $('.next-btn'),
                $navPrev: $('.prev-btn'),
                $nav: $('.header-list li'),
                status: false,
                flowing: {
                    up: function(i){
                        /* 当页的每一个wiilUp添加up */
                        config.$bookBlock.find(".bb-item").eq(i).find(".willUp").each(function(i, e){
                            component.flow.up(e);
                        });
                        component.flow.clean();
                    },
                    down: function(i){
                        /* 当页的每一个wiilUp去除up */
                        config.$bookBlock.find(".bb-item").eq(i).find(".willUp").each(function(i, e){
                            component.flow.down(e);
                        });
                        component.flow.clean();
                    }
                }
            },
            init = function() {
                config.$bookBlock.bookblock({
                    speed: 666,
                    shadowSides: 0.8,
                    shadowFlip: 0.7,
                    autoplay: true,
                    interval: 8000,
                    easing: 'ease-out-in',
                    onBeforeFlip: function(before, after){
                        /* 翻页前下方导航原点切换 */
                        setTimeout(function(){
                            config.$nav.removeClass('active');
                            $(config.$nav[after]).addClass('active');
                        }, 500);
                        /* 翻页后向前一页所有willUp去除up */
                        config.flowing.down(before);
                        return false;
                    },
                    onEndFlip: function(before, after){
                        /* 向后一页所有willUp添加up */
                        config.flowing.up(after);
                        return false;
                    }
                });
                initEvents();
                /* 向首屏的所有willUp添加up */
                setTimeout(function(){
                    config.flowing.up(0);
                }, 250);
            },
            start = function() {
                if(!config.status){
                    config.$bookBlock.bookblock("start");
                    config.status = true;
                }
            },
            stop = function() {
                if(config.status){
                    config.$bookBlock.bookblock("stop");
                    config.status = false;
                }
            },
            initEvents = function() {
                var $slides = config.$bookBlock.children();
                /* add navigation events */
                config.$navNext.on('click touchstart', function() {
                    config.$bookBlock.bookblock('next');
                    return false;
                });
                config.$navPrev.on('click touchstart', function() {
                    config.$bookBlock.bookblock('prev');
                    return false;
                });
                /* 下方导航圆点点击切换 */
                config.$nav.on('click touchstart', function() {
                    var $dot = $(this);
                    setTimeout(function(){
                        config.$nav.removeClass('active');
                        $dot.addClass('active');
                    }, 250);
                    config.$bookBlock.bookblock('jump', $dot.data('id'));
                    return false;
                });
                /* add swipe events */
                $slides.on({
                    'swipeleft': function(event) {
                        config.$bookBlock.bookblock('next');
                        config.$bookBlock.bookblock("stop");
                        config.$bookBlock.bookblock("start");
                        return false;
                    },
                    'swiperight': function(event) {
                        config.$bookBlock.bookblock('prev');
                        config.$bookBlock.bookblock("stop");
                        config.$bookBlock.bookblock("start");
                        return false;
                    }
                });
                config.status = true;
            };
        return {
            init: init,
            start: start,
            stop: stop
        };
    })();

    /* 滚轮控制 */
    component.scrollControllers = (function(){
        /* 滚轮上下左右 */
        var keys = [37, 38, 39, 40],
            functions = {
            preventDefault: function(e){
                e = e || window.event;
                if (e.preventDefault){
                    e.preventDefault();
                }
                e.returnValue = false;
            },
            keydown: function(e){
                for (var i = keys.length; i--;) {
                    if (e.keyCode === keys[i]) {
                        functions.preventDefault(e);
                        return;
                    }
                }
            },
            wheel: function(e){
                functions.preventDefault(e);
            },
            /* 禁用滚轮 */
            disable: function(){
                if (window.addEventListener) {
                    window.addEventListener('DOMMouseScroll', functions.wheel, false);
                }
                window.onmousewheel = document.onmousewheel = functions.wheel;
                document.onkeydown = functions.keydown;
            },
            /* 启用滚轮 */
            enable: function(){
                if (window.removeEventListener) {
                    window.removeEventListener('DOMMouseScroll', functions.wheel, false);
                }
                window.onmousewheel = document.onmousewheel = document.onkeydown = null;
            }

        };
        return {
            disable: functions.disable,
            enable: functions.enable
        }
    })();

    /* 菜单按钮 */
    component.menu_change = (function(){
        var config = {
            /* index表示当前帧序号 */
            index: 1,
            change: function(e, i){
                if(i){
                    /* 当i为1时,正向移动 */
                    config.index++;
                }else{
                    config.index--;
                }
                /* 当序号为16时,结束函数 */
                if(config.index >= 16 || config.index < 1){
                    /* 当序号为0时,令序号为1后结束函数 */
                    config.index = config.index?config.index:1;
                    return 0;
                }else{
                    /* 根据序号移动背景图 */
                    $(e).css({
                        "background-position": -31*(config.index-1) + "px 0"
                    });
                    /* 循环该函数,每30ms移动一次背景图 */
                    setTimeout(function(){
                        config.change(e, i);
                    }, 30);
                }
            },
            toggle: function(e){
                /* 当序号为1时,传入参数i=1正向移动;序号为16时,传入参数i=0反向移动 */
                if(config.index <= 1){
                    component.scrollControllers.disable();
                    component.Page.stop();
                    config.change(e, 1);
                }else if(config.index >= 16){
                    component.scrollControllers.enable();
                    component.Page.start();
                    config.change(e, 0);
                }
            },
            init: function(){
                $(".menu-btn").on("click", function(){
                    /* body滑动menu滑出，切换当前class名称 */
                    $("body").toggleClass("slide");
                    $(".black-shadow").fadeToggle(300);
                    /* 菜单按钮背景变换 */
                    config.toggle(this);
                });
            }
        };
        config.init();
        return config.toggle;
    })();

    /* 平滑滚动 */
    component.scroll = (function(){
        var config = {
            prefix: ".section-",    /* 选择器前缀 */
            speed: 1500,
            scrollTop: 0
        };
        var functions = {
            getTop: function(element) {
                if(element.nodeName === 'HTML'){
                    return -window.pageYOffset;
                }
                /* 偏移量(导航栏)为60 */
                return element.getBoundingClientRect().top - 60 + window.pageYOffset;
            },
            to: function(id){
                if($("body").hasClass("slide")){
                    $(".menu-btn").click();
                }
                if(id === 0){
                    smoothScroll(0, config.speed);
                }else{
                    smoothScroll(functions.getTop($(config.prefix + id)[0]), config.speed);
                }
            },
            bind:  function() {
                $("[data-scroll-to]").on('click', function(){
                    functions.to(parseInt($(this).data("scroll-to")));
                });
                var container = $(".container")[0];
                $(".goto-down").on('click', function(){
                    smoothScroll(container, 1200);
                });
                $(".goto-join").on('click', function(){
                    functions.to(6);
                });
                functions.scroll();
            },
            scroll: function() {
                var $w = $(window),
                    height = $w.height(),
                    $header = $('.header'),
                    $nav = $('.nav');
                $w.on('scroll', function(){
                    config.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                    if(height - 60 > config.scrollTop){
                        var opacity = 1 - 0.7 * config.scrollTop / height;
                        $header.css({
                            'filter': 'progid: DXImageTransform.Microsoft.Alpha(Opacity=' + opacity * 100 + ')',
                            'opacity': opacity
                        });
                        $nav.removeClass('fixed');
                        component.Page.start();
                    }else{
                        $nav.addClass('fixed');
                        component.Page.stop();
                    }
                });
            }

        };
        functions.bind();
    })();
    /* component组件 - end */

    /* 调用 */
    (function(){
        /* 翻页初始化 */
        component.Page.init();
        /* 首屏背景 */
        var particles_config = {"particles":{"number":{"value":20,"density":{"enable":true,"value_area":800}},"color":{"value":"#e1e1e1"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/cloud.png","width":100,"height":100}},"opacity":{"value":0.22,"random":true,"anim":{"enable":false,"speed":0.1,"opacity_min":0.2,"sync":true}},"size":{"value":15,"random":true,"anim":{"enable":true,"speed":3,"size_min":10,"sync":false}},"line_linked":{"enable":true,"distance":400,"color":"#cfcfcf","opacity":0.18,"width":1},"move":{"enable":true,"speed":1,"direction":"none","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.2}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":1},"remove":{"particles_nb":2}}},"retina_detect":true};
        particlesJS("particles-js", particles_config);
    })();

    /* url */
    var _url = "/blues/",
        _link = {
            department: _url + "index/getdepartmentall",
            history: _url + "index/gethistoryall",
            member: _url + "index/getmemberall",
            production: _url + "index/getproductionall",
            apply: _url + "index/addmenteesingroup/",
            group: _url + "index/getgroupall",
            vedio: _url + "index/getvideoall"
        };

    /* 首屏视频 */
    (function() {
        $("#video_play").on("click", function(e) {
            e.preventDefault();
            $(this).parents(".box-center").fadeOut();
            $(".video_box").fadeIn();
            $(".video_box video")[0].play();
        });
        $.get(_link.vedio, function(result){
            var video = result.data[0];
            var $video = $("<video>", {
                src: video.vi_url,
                controls: "controls"
            });
            $(".video_box").append($video);
            $("#video_description").text(video.vi_description);
        });
     })();

    /* 发展历史 */
    (function() {
        /* ajax获取数据 */
        $.get(_link.history, function(result){
            var ls = result.data.slice(0, 3);
            for(var i = 0, length = ls.length; i < length; i++){
                ls[i].h_img = "static/img/ls" + (i+1) + ".png";
            }
            var historyTpl = Handlebars.compile($("#history").html());
            $(".swiper-wrapper").html(historyTpl(result.data.slice(0, 3)));
            var mySwiper = new Swiper ('.swiper-container', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: 15,
                onSlideNextStart: function(swiper){
                    $(".time-node").removeClass("now").filter("[data-index='" + swiper.activeIndex + "']").addClass("now");
                },
                onSlidePrevStart: function(swiper){
                    $(".time-node").removeClass("now").filter("[data-index='" + swiper.activeIndex + "']").addClass("now");
                }
            });
            $(".time-node").on('click', function(){
                var index = $(this).data('index');
                mySwiper.slideTo(index);
            });
        });
    })();

    /* 部门介绍 */
    (function() {
        /* ajax获取数据 */
        $.get(_link.department, function(result) {
            var departmentTpl = Handlebars.compile($("#department").html());
            $(".bm-box ul").html(departmentTpl(result.data.slice(0, 5)));
            /* 展开效果 */
            $(".bm-box ul>li").eq(0).addClass("on");
            var $window = $(window);
            $(".bm-item").hover(function(){
                if($window.width() > 1000){
                    $(".bm-item").not($(this)).stop().animate({
                        width: 158
                    }).removeClass("on");
                    $(this).stop().animate({
                        width: 318
                    }).addClass("on");
                }else{
                    $(".bm-item").removeClass("on");
                    $(this).addClass("on");
                }
            });
        });
    })();


    /* 作品展示 */
    (function() {
        var showPro = function() {
            var $productsBtn = $(".pro-btn-group>.pro-btn"),
                $detail = $(".pro-detail"),
                $item = $(".pro-list>li"),
                $close = $(".pro-close"),
                length = $item.length,
                index = 0;
            /* 打开展示 */
            $productsBtn.on('click', function() {
                index = $productsBtn.index(this);
                $detail.addClass("pro-detail-show");
                $item.removeClass("show-current-li");
                $item.eq(index).addClass("show-current-li");
            });
            /* 关闭展示 */
            $close.on('click', function() {
                $detail.removeClass("pro-detail-show");
            });
            /* 下一张 */
            $(".pro-next").on('click', function() {
                console.log(index);
                if(index == length - 1){
                    index = 0;
                }else{
                    index++;
                }
                $close.click();
                setTimeout(function(){
                    $productsBtn.eq(index).click();
                }, 300);
            });
            /* 上一张 */
            $(".pro-prev").on('click', function() {
                if (index == 0) {
                    index = length - 1;
                } else {
                    index--;
                }
                $close.click();
                setTimeout(function(){
                    $productsBtn.eq(index).click();
                }, 300);
            });
        };
        /* ajax获取数据 */
        $.get(_link.production, function(result) {
            var showList = result.data.slice(0, 5);
            var proBtnTpl = Handlebars.compile($("#pro-btn").html());
            $(".pro-btn-group").prepend(proBtnTpl(showList));
            var productionTpl = Handlebars.compile($("#production").html());
            $(".pro-list").prepend(productionTpl(showList));
            var productionMoreTpl = Handlebars.compile($("#productionMore").html());
            $(".pro-more ul").prepend(productionMoreTpl(result.data));
            showPro();
        });
    })();

    /* 骨干团 ~ 毕业去向 */
    (function() {
        /* 骨干团-鼠标移动动画 */
        (function($, undefined) {
            $.HoverDir = function(options, element) {
                this.$el = $(element);
                this._init(options);
            };
            $.HoverDir.defaults = {
                hoverDelay: 0,
                reverse: false
            };
            $.HoverDir.prototype = {
                _init: function(options) {
                    this.options = $.extend(true, {}, $.HoverDir.defaults, options);
                    this._loadEvents();
                },
                _loadEvents: function() {
                    var _self = this;
                    this.$el.on('mouseenter.hoverdir, mouseleave.hoverdir', function(event) {
                        var $el = $(this), evType = event.type, $hoverElem = $el.find('.item-detail'), direction = _self._getDir($el, {
                            x: event.pageX,
                            y: event.pageY
                        }), hoverClasses = _self._getClasses(direction);
                        $hoverElem.removeClass().addClass('item-detail');
                        if (evType === 'mouseenter') {
                            $hoverElem.hide().addClass(hoverClasses.from);
                            clearTimeout(_self.tmhover);
                            _self.tmhover = setTimeout(function() {
                                $hoverElem.show(0, function() {
                                    $(this).addClass('da-animate').addClass(hoverClasses.to);
                                });
                            }, _self.options.hoverDelay);
                        } else {
                            $hoverElem.addClass('da-animate');
                            clearTimeout(_self.tmhover);
                            $hoverElem.addClass(hoverClasses.from);
                        }
                    });
                },
                _getDir: function($el, coordinates) {
                    var w = $el.width(), h = $el.height(), x = (coordinates.x - $el.offset().left - (w / 2)) * (w > h ? (h / w) : 1), y = (coordinates.y - $el.offset().top - (h / 2)) * (h > w ? (w / h) : 1), direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90 ) + 3 ) % 4;
                    return direction;
                },
                _getClasses: function(direction) {
                    var fromClass, toClass;
                    switch (direction) {
                        case 0:
                            (!this.options.reverse) ? fromClass = 'da-slideFromTop' : fromClass = 'da-slideFromBottom';
                            toClass = 'da-slideTop';
                            break;
                        case 1:
                            (!this.options.reverse) ? fromClass = 'da-slideFromRight' : fromClass = 'da-slideFromLeft';
                            toClass = 'da-slideLeft';
                            break;
                        case 2:
                            (!this.options.reverse) ? fromClass = 'da-slideFromBottom' : fromClass = 'da-slideFromTop';
                            toClass = 'da-slideTop';
                            break;
                        case 3:
                            (!this.options.reverse) ? fromClass = 'da-slideFromLeft' : fromClass = 'da-slideFromRight';
                            toClass = 'da-slideLeft';
                            break;
                    }
                    return {
                        from: fromClass,
                        to: toClass
                    };
                }
            };
            var logError = function(message) {
                if (this.console) {
                    console.error(message);
                }
            };
            $.fn.hoverdir = function(options) {
                if (typeof options === 'string') {
                    var args = Array.prototype.slice.call(arguments, 1);
                    this.each(function() {
                        var instance = $.data(this, 'hoverdir');
                        if (!instance) {
                            logError("cannot call methods on hoverdir prior to initialization; " + "attempted to call method '" + options + "'");
                            return;
                        }
                        if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                            logError("no such method '" + options + "' for hoverdir instance");
                            return;
                        }
                        instance[options].apply(instance, args);
                    });
                } else {
                    this.each(function() {
                        var instance = $.data(this, 'hoverdir');
                        if (!instance) {
                            $.data(this, 'hoverdir', new $.HoverDir(options, this));
                        }
                    });
                }
                return this;
            };
        })(jQuery);
        /* 毕业去向-瀑布流 */
        function waterfall(container){
            if(typeof(container) === 'string')
                container = document.querySelector(container);
            function style(el){ return window.getComputedStyle(el); }
            function margin(name, el){ return parseFloat(style(el)['margin' + name]) || 0; }
            function px(n){ return n + 'px'; }
            function y(el){ return parseFloat(el.style.top) ; }
            function x(el){ return parseFloat(el.style.left); }
            function width(el){ return parseFloat(style(el).width); }
            function height(el){ return parseFloat(style(el).height); }
            function bottom(el){ return y(el) + height(el) + margin('Bottom', el); }
            function right(el){ return x(el) + width(el) + margin('Right', el); }
            function padding(el){ return parseFloat(style(el).height); }
            function sort(l){
                l = l.sort(function(a, b){
                    var bottom_diff = bottom(b) - bottom(a);
                    return bottom_diff || x(b) - x(a);
                });
            }
            var boundary = {
                col: 2,
                els: [],
                add: function (el){
                    this.els.push(el);
                    sort(this.els);
                    this.els = this.els.slice(0, boundary.col);
                },
                min: function(){
                    return this.els[this.els.length - 1];
                },
                max: function(){
                    return this.els[0];
                }
            };
            function placeEl(el, top, left){
                el.style.position = 'absolute';
                el.style.top = top;
                el.style.left = left;
                boundary.add(el);
            }
            function placeFirstElement(el){
                placeEl(el, '0px', px(margin('Left', el)));
            }
            function placeAtTheFirstLine(prev, el){
                placeEl(el, prev.style.top, px(right(prev) + margin('Left', el)));
            }
            function placeAtTheSmallestColumn(minEl, el){
                placeEl(el, px(bottom(minEl) + margin('Top', el)), px(x(minEl)));
            }
            function adjustContainer(container, maxEl){
                container.style.position = 'relative';
                container.style.height = px(bottom(maxEl) + margin('Bottom', maxEl));
            }
            function thereIsSpace(els, i){
                return right(els[i - 1]) + width(els[i]) <= width(container) + parseFloat(style(container.parentNode).paddingLeft) + parseFloat(style(container.parentNode).paddingRight);
            }
            var els = container.children;
            if(els.length){
                placeFirstElement(els[0]);
            }
            for(var i = 1; i < els.length && thereIsSpace(els, i); i++){
                placeAtTheFirstLine(els[i - 1], els[i]);
            }
            boundary.col = i;
            for(; i < els.length; i++){
                placeAtTheSmallestColumn(boundary.min(), els[i]);
            }
            adjustContainer(container, boundary.max());
        }
        /* 随机排序 */
        var randomsort = function() {
            return Math.random() > .5 ? -1 : 1;
        };
        /* ajax获取数据 */
        $.get(_link.member, function(result) {
            /* 骨干团 */
            var mainMemberTpl = Handlebars.compile($("#main-member").html());
            $("#da-thumbs").html(mainMemberTpl(result.data.sort(randomsort)));
            /* 毕业去向 */
            var graduated = {},
                graduatedArr = [];
            for(var i = 0, len = result.data.length; i < len; i++){
                var e = result.data[i];
                if(e.m_out && e.m_grade){
                    if(!graduated[e.m_grade]){
                        graduated[e.m_grade] = [];
                    }
                    graduated[e.m_grade].push(e);
                }
            }
            /* 对象转换为数组,再按倒序排序 */
            for(var j in graduated){
                if(graduated.hasOwnProperty(j)){
                    graduatedArr.push({
                        grade: j,
                        list: graduated[j].sort(randomsort)
                    });
                }
            }
            graduatedArr.reverse(function (a, b) {
                var value1 = a[grade],
                    value2 = b[grade];
                if(value2 < value1){
                    return -1;
                }else if(value2 > value1) {
                    return 1;
                }else{
                    return 0;
                }
            });
            var graduatedMemberTpl = Handlebars.compile($("#graduated-member").html());
            $("#card").html(graduatedMemberTpl(graduatedArr));
            waterfall("#card");
            $(window).on('resize', function(){
                waterfall("#card");
            });
            /* 骨干团 */
            $(".da-thumbs > li").hoverdir();
        });
    })();

    /* 加入我们 */
    (function() {
        /* ajax获取分组 */
        $.get(_link.group, function(result) {
            var showList = result.data.slice(0, 5);
            var groupTpl = Handlebars.compile($("#group-tpl").html());
            $("#group_id").append(groupTpl(showList));
        });
        /* 表单效果 */
        var $input = $(".input-group input").add(".select select"),
            check = function(){
                $input.each(function(i, e){
                    if(!!e.value){
                        $(e).parent().addClass('complete');
                    }else{
                        $(e).parent().removeClass('complete');
                    }
                });
            };
        check();
        $input.on({
            focus: function(){
                $(this).parent().addClass('active');
            },
            blur: function(){
                $(this).parent().removeClass('active');
                check();
            }
        });
        /* 通过学号获取信息 */
        $("#me_sno").on("input propertychange", function(){
            var id = this.value;
            if(id.length >= 10){
                $.get("https://blues.congm.in/pubBjStu.php?searchKey=" + id, function(data){
                    var $html = $('<div>' + data + '</div>'),
                        $tr = $html.find("table tr:eq(1)"),
                        $a = $tr.find("td"),
                        message = [];
                    for(var i = 0, length = $a.length; i<length; i++){
                        message[i] = $a.eq(i).text().replace(/\s/g, "");
                    }
                    $("#me_name").val(message[1]);
                    $("#me_college").val(message[5]);
                    $("#me_major").val(message[4]);
                    check();
                });
            }else{
                $("#me_name").val('');
                $("#me_college").val('');
                $("#me_major").val('');
                check();
            }
        });
        /* 表单提交 */
        $("#join-us").on("submit", function(e) {
            e.preventDefault();
            var status = true;
            var formData = (function(form){
                var o = {},
                    arr = $(form).serializeArray();
                $.each(arr, function(i, e){
                    if(!e.value){
                        status = false;
                    }
                    if(o[e.name] !== undefined){
                        if(!o[e.name].push){
                            o[e.name] = [o[e.name]];
                        }
                        o[e.name].push(e.value || '');
                    }else{
                        o[e.name] = e.value || '';
                    }
                });
                return o;
            })(this);
            if(!status){
                alert("请填写完整！");
            }else{
                $.ajax({
                    type: "POST",
                    url: _link.apply + formData.group_id,
                    data: formData,
                    success: function(data){
                        if(!!data.meta){
                            if(!data.meta.success){
                                alert(data.meta.message);
                            }else{
                                alert("提交成功！");
                            }
                        }
                    },
                    error: function(){
                        alert("提交失败！");
                    }
                });
            }
        });
    })();

});

