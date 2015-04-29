$(function() {

    var init = function() {
        var initDiv = $(document.getElementById('init'));
        soundManager.setup({url: 'static/swf/', onready: function() {
            soundManager.createSound({id: 'initSound', url: 'static/ogg/init.ogg', autoLoad: true, autoPlay: true, volume: 100});
        }});
        SC.initialize({client_id: "19a6c5e98aef00b45ab6d1ebdf3ca361"});
        setTimeout(function() {
            initDiv.css('top', '-84%');
            initDiv.css('color', '#222');
            $(document.getElementById('initimg')).css('-webkit-filter', 'invert(8%)');
            $(document.body).css('background-color', '#eee');
            setTimeout(function() {
                initDiv.remove();
            }, 1200);
        }, 4850);
        
    };
    
    init();
    
});
