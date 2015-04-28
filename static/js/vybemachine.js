$(function() {

    var init = function() {
        var initDiv = $(document.getElementById('init'));
        SC.initialize({client_id: "b45b1aa10f1ac2941910a7f0d10f8e28"});
        setTimeout(function() {
            initDiv.css('top', '-110%');
            initDiv.css('color', '#1b1b1b');
            $(document.body).css('background-color', '#eee');
            setTimeout(function() {
                initDiv.remove();
            }, 1200);
        }, 2718);
        
    };
    
    init();
    
});