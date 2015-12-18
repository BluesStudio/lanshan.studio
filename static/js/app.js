var flow = (function() {
    var t = 0,
        clean = function(){
            t = 0;
        },
        up = function(e) {
            setTimeout(function() {
                $(e).addClass("up")
            }, t);
            t += 200;
        },
        down = function(e){
            $(e).removeClass("up");
        },
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
var Page = (function() {
    var config = {
            $bookBlock: $('#bb-bookblock'),
            $navNext: $('.next-btn'),
            $navPrev: $('.prev-btn'),
            $nav: $('.header-list li'),
            flowing: {
                up: function(i){
                    config.$bookBlock.find(".bb-item").eq(i).find(".willUp").each(function(i, e){
                        flow.up(e);
                    });
                    flow.clean();
                },
                down: function(i){
                    config.$bookBlock.find(".bb-item").eq(i).find(".willUp").each(function(i, e){
                        flow.down(e);
                    });
                    flow.clean();
                }
            }
        },
        init = function() {
            config.$bookBlock.bookblock({
                speed: 800,
                shadowSides: 0.8,
                shadowFlip: 0.7,
                /*autoplay: true,*/
                easing: 'ease-out',
                onBeforeFlip: function(before, after){
                    setTimeout(function(){
                        config.$nav.removeClass('active');
                        $(config.$nav[after]).addClass('active');
                    }, 250);
                    return false;
                },
                onEndFlip: function(before, after){
                    config.flowing.down(before);
                    config.flowing.up(after);
                    return false;
                }
            });
            initEvents();
            setTimeout(function(){
                config.flowing.up(0);
            }, 250);
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
        init: init
    };
})();
Page.init();
$(function() {
    var menu_change = (function(){
        var config = {
            index: 1,
            change: function(e, i){
                if(i){
                    config.index++;
                }else{
                    config.index--;
                }
                if(config.index >= 16 || config.index < 1){
                    config.index = config.index?config.index:1;
                    return 0;
                }else{
                    $(e).css({
                        "background-position": -31*(config.index-1) + "px 0"
                    });
                    setTimeout(function(){
                        config.change(e, i);
                    }, 30);
                }
            },
            toggle: function(e){
                console.log(config.index);
                if(config.index <= 1){
                    $(e).css({
                        "right": -60 + "px"
                    });
                    config.change(e, 1);
                }else if(config.index >= 16){
                    $(e).css({
                        "right": 80 + "px"
                    });
                    config.change(e, 0);
                }
            }
        };
        return config.toggle;
    })();
    $(".menu-btn").click(function(){
        $(".header").toggleClass("header-slide");
        $(".black-shadow").fadeToggle(300);
        menu_change(this);
    });
});