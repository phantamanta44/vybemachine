$(function() {

    var init = function() {
        var initDiv = $(document.getElementById('init'));
        SC.initialize({client_id: "19a6c5e98aef00b45ab6d1ebdf3ca361"});
        setTimeout(function() {
            initDiv.css('top', '-84%');
            initDiv.css('color', '#1b1b1b');
            $(document.getElementById('initimg')).css('-webkit-filter', 'invert(8%)');
            $(document.body).css('background-color', '#eee');
            setTimeout(function() {
                initDiv.remove();
            }, 1200);
        }, 2718);
        
    };
    
    init();
    
});
