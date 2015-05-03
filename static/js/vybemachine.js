$(function() {
    
    var initialized = false;
    var paused = false;
    var currentSound;
    
    var QUERY_VAL = ["trap", "edm", "dubstep", "glitchhop", "dance", "trance", ""];
    var QUERY_TAG = "edm";
    var HUE_WHEEL = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    var urlRegex = new RegExp('https?://.{0,}soundcloud\.com/.*');
    
    var eqTop = [];
    var eqBot = [];
    
    var jDoc = $(document);
    var initDiv = $(document.getElementById('init'));
    var mainDiv = $(document.getElementById('main'));
    var eqDiv = $(document.getElementById('equalizer'));
    var eqSvg = SVG('equalizer').size('100%', '100%');
    var artworkDiv = $(document.getElementById('albumart'));
    var artworkImg = $(document.getElementById('albumartfg'));
    var trackLink = $(document.getElementById('sclink'));
    var skipBtn = $(document.getElementById('skipbtn'));
    var setupBtn = $(document.getElementById('setupbtn'));
    var pauseDiv = $(document.getElementById('pausescrn'));
    var hash = document.location.hash.replace('#', '');
    
    var preInit = function() {
        soundManager.setup({url: 'static/swf/', flashVersion: 9, preferFlash: true, flashPollingInterval: 10, useHighPerformance: true, onready: function() {
            currentSound =  soundManager.createSound({id: 'initSound', url: 'static/ogg/init.ogg', autoLoad: true, autoPlay: true, volume: 100});
            SC.initialize({client_id: "19a6c5e98aef00b45ab6d1ebdf3ca361"});
            setTimeout(init, 4800);
        }});
        soundManager.flash9Options.useEQData = true;
        prepareSvg();
        $(document).keypress(pauseMe);
        setupBtn.click(showSetup);
    };
    
    var init = function() {
        initDiv.css('top', '-84%');
        initDiv.css('color', '#222');
        setFilter($(document.getElementById('initimg')), 'invert(8%)');
        $(document.body).css('background-color', '#eee');
        setTimeout(function() {
            initDiv.remove();
            mainDiv.show();
            mainDiv.fadeTo(1200, 1.0, postInit());
        }, 1200);
    }
    
    var postInit = function() {
        initialized = true;
        if (hash.match(urlRegex)) {
            skipBtn.css('display', 'none');
            playTrack(hash);
        }
        else {
            if(!!hash) {
                var tagList = hash.split(',');
                QUERY_TAG = "";
                QUERY_VAL = [];
                for (var i = 0; i < tagList.length; i++) {
                    QUERY_VAL[i] = tagList[i].trim();
                }
                QUERY_VAL[tagList.length] = "";
            }
            randTrack();
        }
    }
    
    var randTrack = function() {
        retryAttempts = 0;
        setFilter(skipBtn, 'hue-rotate(' + randSel(HUE_WHEEL) + 'deg)');
        setFilter(eqDiv, 'hue-rotate(' + randSel(HUE_WHEEL) + 'deg)');
        SC.get("/tracks", {tags: QUERY_TAG, limit: 200, "duration[to]": 390000, filter: "public", q: randSel(QUERY_VAL)}, function(tracks) {
            var t = randInt(0, tracks.length);
            if (tracks[t].artwork_url != null) {
                setArtwork(tracks[t].artwork_url.replace('large.jpg', 't500x500.jpg'));
            }
            else {
                setTimeout(function() {retryArtworkUpdate(tracks[t]);}, 10000);
            }
            currentSound = SC.stream("/tracks/" + tracks[t].id, function(sound) {
                sound.play({onfinish: function() {this.destruct(); randTrack();}, onstop: function() {this.destruct(); randTrack();}, whileplaying: function() {updateEq(this); updateVol(this);}});
            });
            trackLink.attr('href', tracks[t].permalink_url);
            document.title = tracks[t].user.username + " - " + tracks[t].title;
            setTimeout(function() {document.title = "The Vybe Machine";}, 5000)
        });
    }
    
    var playTrack = function(uri) {
        setFilter(skipBtn, 'hue-rotate(' + randSel(HUE_WHEEL) + 'deg)');
        setFilter(eqDiv, 'hue-rotate(' + randSel(HUE_WHEEL) + 'deg)');
        SC.get("/resolve.json", {url: uri}, function(resolved) {
            if (resolved != null) {
                var track = resolved;
                if (track.artwork_url != null) {
                    setArtwork(track.artwork_url.replace('large.jpg', 't500x500.jpg'));
                }
                else {
                    setTimeout(function() {retryArtworkUpdate(track);}, 10000);
                }
                currentSound = SC.stream("/tracks/" + track.id, function(sound) {
                    sound.play({onfinish: function() {this.destruct(); mainDiv.fadeTo(1200, 0);}, onstop: function() {this.destruct(); mainDiv.fadeTo(1200, 0);}, whileplaying: function() {updateEq(this); updateVol(this);}});
                });
                trackLink.attr('href', track.permalink_url);
                document.title = track.user.username + " - " + track.title;
            }
            else {
                alert('Could not find specified track ' + uri + '!');
            }
        });
    }
    
    var updateEq = function(theSound) {
        try {
            var w = jDoc.width();
            var pos = w / 128;
            var h = jDoc.height();
            var left = theSound.eqData.left;
            var right = theSound.eqData.right;
            for (var i = 0; i < 128; i++) {
                eqTop[i].size(w * 0.006, 56 * left[256 - (i * 2)]).move(i * pos, 0);
                eqBot[i].size(w * 0.006, 56 * right[i * 2]).move((i * pos) + (pos / 4), h - (56 * right[i * 2]));
            }
        }
        catch (ex) { console.log(ex); }
    }
    
    var prepareSvg = function() {
        var w = jDoc.width();
        var pos = w / 128;
        var h = jDoc.height();
        for (var i = 0; i < 128; i++) {
            eqTop[i] = eqSvg.rect(w * 0.006, 0).attr({fill: '#0db'}).move((i * pos) + (pos / 2), 0);
            eqBot[i] = eqSvg.rect(w * 0.006, 0).attr({fill: '#0db'}).move((i * pos) + (pos / 2), h);
        }
    }
    
    var setArtwork = function(artUrl) {
        artworkDiv.css('background-image', "url(" + artUrl + ")");
        artworkImg.attr('src', artUrl);
    }
    
    var randInt = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    var randSel = function(list) {
        return list[Math.floor(Math.random() * list.length)]
    }
    
    var updateVol = function(theSound) {
        theSound.setVolume(Math.floor(document.getElementById('volslider').value));
    }
    
    var pauseMe = function(event) {
        if (initialized && event.keyCode == 32) {
            if (paused) {
                soundManager.resumeAll();
                paused = false;
                pauseDiv.fadeTo(400, 0, function() {pauseDiv.css('display', 'none');});
            }
            else {
                soundManager.pauseAll();
                paused = true;
                pauseDiv.css('display', 'block');
                pauseDiv.fadeTo(400, 1.0);
            }
        }
    }
    
    var retryArtworkUpdate = function(track) {
        if (track.artwork_url != null) {
            setArtwork(track.artwork_url.replace('large.jpg', 't500x500.jpg'));
        }
    }
    
    var showSetup = function() {
        if (initialized) {
            var curTags = "";
            for (var i = 0; i < QUERY_VAL.length; i++) {
                if (QUERY_VAL[i].trim() != '') {
                    curTags += QUERY_VAL[i];
                    if (i != QUERY_VAL.length - 1) {
                        curTags += ',';
                    }
                }
            }
            var tagStr = prompt('Input a comma-separated list of search queries.', curTags);
            if (tagStr == null) {
                return;
            }
            var tagList = tagStr.split(',');
            QUERY_TAG = "";
            QUERY_VAL = [];
            for (var i = 0; i < tagList.length; i++) {
                QUERY_VAL[i] = tagList[i].trim();
            }
            QUERY_VAL[tagList.length] = "";
            soundManager.stopAll();
        }
    }
    
    var setFilter = function(obj, filter) {
        obj.css('-webkit-filter', filter);
        obj.css('-moz-filter', filter);
        obj.css('filter', filter);
    }
    
    preInit();
});
