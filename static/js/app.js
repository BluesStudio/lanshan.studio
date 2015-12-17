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
                if(config.index > 17 || config.index < 1){
                    return 0;
                }else{
                    $(e).css({
                        "background-position": -29*(config.index-1)-1 + "px 0"
                    });
                    $(e).css({
                        "right": 70-8*(config.index-1) + "px"
                    });
                    setTimeout(function(){
                        config.change(e, i);
                    }, 25);
                }
            },
            toggle: function(e){
                if(config.index <= 1){
                    config.change(e, 1);
                }else if(config.index >= 15){
                    config.change(e, 0);
                }
            }
        };
        return config.toggle;
    })();
    var Page = (function() {
        var config = {
                $bookBlock: $('#bb-bookblock'),
                $navNext: $('.next-btn'),
                $navPrev: $('.prev-btn')
            },
            init = function() {
                config.$bookBlock.bookblock({
                    speed: 800,
                    shadowSides: 0.8,
                    shadowFlip: 0.7,
                    easing: 'ease-out'
                });
                initEvents();
            },
            initEvents = function() {
                var $slides = config.$bookBlock.children();
                // add navigation events
                config.$navNext.on('click touchstart',
                    function() {
                        config.$bookBlock.bookblock('next');
                        return false;
                    });
                config.$navPrev.on('click touchstart',
                    function() {
                        config.$bookBlock.bookblock('prev');
                        return false;
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
    $(".menu-btn").click(function(){
        $(".header").toggleClass("header-slide");
        $(".black-shadow").fadeToggle(300);
        menu_change(this);
    });
});