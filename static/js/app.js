/* Cong Min 于 2015.12.21 */
/* willUp添加up */
var flow = (function() {
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
var Page = (function() {
    var config = {
            $bookBlock: $('#bb-bookblock'),
            $navNext: $('.next-btn'),
            $navPrev: $('.prev-btn'),
            $nav: $('.header-list li'),
            flowing: {
                up: function(i){
                    /* 当页的每一个wiilUp添加up */
                    config.$bookBlock.find(".bb-item").eq(i).find(".willUp").each(function(i, e){
                        flow.up(e);
                    });
                    flow.clean();
                },
                down: function(i){
                    /* 当页的每一个wiilUp去除up */
                    config.$bookBlock.find(".bb-item").eq(i).find(".willUp").each(function(i, e){
                        flow.down(e);
                    });
                    flow.clean();
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
                easing: 'ease-out',
                onBeforeFlip: function(before, after){
                    /* 翻页前下方导航原点切换 */
                    setTimeout(function(){
                        config.$nav.removeClass('active');
                        $(config.$nav[after]).addClass('active');
                    }, 250);
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
            config.$bookBlock.bookblock("start");
        },
        stop = function() {
            config.$bookBlock.bookblock("stop");
        },
        initEvents = function() {
            var $slides = config.$bookBlock.children();
            // add navigation events
            config.$navNext.on('click touchstart', function() {
                config.$bookBlock.bookblock('next');
                return false;
            });
            config.$navPrev.on('click touchstart', function() {
                config.$bookBlock.bookblock('prev');
                return false;
            });
            config.$nav.each(function(i) {
                /* 下方导航圆点点击切换 */
                $(this).on('click touchstart', function() {
                    var $dot = $(this);
                    config.$nav.removeClass('active');
                    $dot.addClass('active');
                    config.$bookBlock.bookblock('jump', i + 1);
                    return false;
                });
            });
            // add swipe events
            $slides.on({
                'swipeleft': function(event) {
                    config.$bookBlock.bookblock('next');
                    return false;
                },
                'swiperight': function(event) {
                    config.$bookBlock.bookblock('prev');
                    return false;
                }
            });
        };
    return {
        init: init,
        stop: stop
    };
})();
/* 滚轮控制 */
var scrollControllers = (function(){
    /* 滚轮上下左右 */
    var keys = [37, 38, 39, 40];
    var functions = {
        preventDefault: function(e){
            e = e || window.event;
            if (e.preventDefault){
                e.preventDefault();
            }
            e.returnValue = false;
        },
        keydown: function(e){
            cosnole.log(e);
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
/* 滚轮移动 */
var scrollMove = (function(){
    var w = $(window);
    w.on("scroll", function(){
        /* 当页面无动画滚动时启用滚轮滚动 */
        if(!$("html, body").is(":animated")){
            scrollControllers.enable();
        }
    });
    return function(e, time){
        /* 当参数e为数字时,则scrollTop为e,当为字符串时,获取该元素到文档顶部的距离为scrollTop */
        var scrollTop = !isNaN(e)?e:$(e)[0].offsetTop;
        /* 执行动画滚动 */
        $("html, body").animate({scrollTop: scrollTop}, time);
        /* 当页面动画滚动时禁用滚轮滚动 */
        scrollControllers.disable();
    };
})();
/* 菜单按钮变换 */
var menu_change = (function(){
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
                config.change(e, 1);
            }else if(config.index >= 16){
                config.change(e, 0);
            }
        }
    };
    return config.toggle;
})();
$(function() {
    Page.init();
    $(".menu-btn").click(function(){
        scrollControllers.disable();
        /* body滑动menu滑出 */
        $("body").toggleClass("slide");
        /* 蒙层出现 */
        $(".black-shadow").fadeToggle(300);
        /* 菜单按钮背景变换 */
        menu_change(this);
    });
    (function(){
        var container = $(".container");
        var w = $(window);
        var hb = $("html, body");
        var scrollTop;
        var windowsHeight = w.height();
        w.scroll();
        w.on("scroll", function(){
            /* 滚动出首屏后,顶部菜单变化样式且固定 */
            scrollTop = w.scrollTop();
            if(scrollTop>=windowsHeight-60){
                $(".nav").attr("id", "fixed");
            }else{
                $(".nav").removeAttr("id");
            }
        });
        /* 首屏下滚,执行滚动动画至内容 */
        $('.header').bind('mousewheel', function(event, delta) {
            if(delta < 0 && !hb.is(":animated")){
                scrollMove(windowsHeight, 1200);
                Page.stop();
            }
        });
        /* 内容上滚,执行滚动动画至首页 */
        container.bind('mousewheel', function(event, delta) {
            if(delta > 0 && !hb.is(":animated") && windowsHeight >= document.body.scrollTop){
                scrollMove(0, 1200);
            }
        });
        /* 点击按钮,执行滚动动画至内容 */
        $(".down-btn").click(function(){
            scrollMove(windowsHeight, 1200);
        });
    })();
    var particles_config = {
        "particles": {
            "number": {
                "value": 20,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#e1e1e1"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                },
                "image": {
                    "src": "img/cloud.png",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": 0.22,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 0.1,
                    "opacity_min": 0.2,
                    "sync": true
                }
            },
            "size": {
                "value": 15,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 3,
                    "size_min": 10,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 400,
                "color": "#cfcfcf",
                "opacity": 0.18,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 0.2
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 1
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    };
    particlesJS("particles-js", particles_config);
    //bm-item, 部门介绍
    $(".bm-item").hover(function() {
        $(".bm-item").not($(this)).stop().animate({
            width: 178
        }).removeClass("on");
        $(this).stop().animate({
            width: 380
        }).addClass("on");
    });
});