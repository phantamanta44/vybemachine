$(function() {
    
    var currentSound;
    var QUERY_VAL = ["trap", "edm", "dubstep", "glitchhop", "dance", "trance", ""];
    var HUE_WHEEL = [50, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    
    var initDiv = $(document.getElementById('init'));
    var mainDiv = $(document.getElementById('main'));
    var artworkDiv = $(document.getElementById('albumart'));
    var artworkImg = $(document.getElementById('albumartfg'));
    var skipBtn = $(document.getElementById('skipbtn'));
    
    var preInit = function() {
        soundManager.setup({url: 'static/swf/', onready: function() {
            soundManager.createSound({id: 'initSound', url: 'static/ogg/init.ogg', autoLoad: true, autoPlay: true, volume: 100});
            SC.initialize({client_id: "19a6c5e98aef00b45ab6d1ebdf3ca361"});
            setTimeout(init, 4800);
        }});
    };
    
    var init = function() {
        initDiv.css('top', '-84%');
        initDiv.css('color', '#222');
        $(document.getElementById('initimg')).css('-webkit-filter', 'invert(8%)');
        $(document.body).css('background-color', '#eee');
        setTimeout(function() {
            initDiv.remove();
            mainDiv.show();
            mainDiv.fadeTo(1200, 1.0, postInit());
        }, 1200);
    }
    
    var postInit = function() {
            randTrack();
    }
    
    var randTrack = function() {
        skipBtn.css('-webkit-filter', 'hue-rotate(' + randSel(HUE_WHEEL) + 'deg)');
        SC.get("/tracks", {tags: "edm", limit: 200, filter: "public", q: randSel(QUERY_VAL)}, function(tracks) {
            var t = randInt(0, 200);
            if (tracks[t].artwork_url != null) {
                setArtwork(tracks[t].artwork_url.replace('large.jpg', 't500x500.jpg'));
            }
            currentSound = SC.stream("/tracks/" + tracks[t].id, function(sound) {
                sound.play({onfinish: function() {randTrack();}, onstop: function() {randTrack();}});
            });
        });
    }
    
    var setArtwork = function(artUrl) {
        artworkDiv.css('background-image', "url(" + artUrl + "deg)");
        artworkImg.attr('src', artUrl);
    }
    
    var randInt = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    var randSel = function(list) {
        return list[Math.floor(Math.random() * list.length)]
    }
    
    preInit();
    
});
