window.addEventListener('load', function(){
    var player = null,
        seekBar = document.getElementById('seekpos');


    function initState(){
        seekBar.value = 0;
        var elm = document.getElementById('sv_pl_scan');
        elm.setAttribute('data-state', 'scanmode');
        elm.setAttribute('title', 'Scan Mode');
        
        elm = document.getElementById('sv_pl_play');
        elm.setAttribute('data-state', 'pause');

        elm = document.getElementById('sv_pl_mute');
        elm.setAttribute('data-state', 'mute');
    }

    function initPlayer(p){
        var seekBar = document.getElementById('seekpos');
        p.onopened = function(info){
            // document.getElementById('playMode').value = 'Normal Mode';
            // var fi = document.getElementById('fileInfo');
            seekBar.setAttribute('title', 'Size: ' + hi5.tool.bytesToSize(info.size) + ', Video length: ' + (info.length / (1000 * 60)).toFixed(2) + ' minutes');
            // document.getElementById('seekbar').style.width = info.width + 'px';
            var elm = document.getElementById('openFile');
            if (elm){
                elm.style.display = 'none';
            }
    
            elm = document.getElementById('sessionZone');
            elm.style.display = 'block';
            
            elm = document.getElementById('video-controls');
            if (elm){
                elm.style.display = 'none';
            }
    
            elm = document.getElementById('sv_pl_play');
            if (elm){
                elm.setAttribute('data-state', 'pause');
            }
        };
        p.onprogress = function(played, total){
            seekBar.value = (played / total * 100); 
        };
        
        p.onend = function(){
            var elm = document.getElementById('openFile');
            if (elm){
                elm.style.display = "block";
            }
            elm = document.getElementById('sessionZone');
            elm.style.display = 'none';
            initState();
        };
        var displayTimeout = 0;
        document.addEventListener('click', function(){
            var elm = document.getElementById('video-controls');
            if (elm){
                elm.style.display = 'block';
                clearTimeout(displayTimeout);
                displayTimeout = setTimeout(function(){
                    elm.style.display = 'none';
                }, 8000);
            }
            
        }, false);
    }
    //播放
    function broadcast(file) {
        var protocol = 'ws://192.168.7.110:1336';
        var playtype = "VNC";
        // var url = protocol + '/PLAY?f=' + file + '&width=1024&height=768';
        var url = protocol + '/PLAY?f=' + file;
        if (player) {
            player.close();
        }

        //alert(url);
        if (playtype == "RDP") {
            player = new Rdp(url);
        } else if (playtype == "VNC") {
            player = new svGlobal.Vnc(url);
        } else if (playtype == "SSH") {
            player = new svGlobal.SSH(url);
        } else {
            player = new svGlobal.TELNET(url);
        }
        initPlayer(player);
        player.addSurface(new svGlobal.LocalInterface());
        player.run();
        //重新定义页面title，因为rdp回放会讲title设置为undefined
        document.title = "信息回放";
    }
    broadcast(path);

    var handler = {};
    handler.addFile = function(f, path){
        if (player){
            player.close();
            player = null;
        }
        var surface = new svGlobal.LocalInterface();
        surface.setAutoScale(true);
        player = new svGlobal.Player(surface);
        initPlayer(player);
        player.setSource(f); 
        player.play();
    };
    initPlayer(player);
    var c = document.getElementById('playerZone');
    svGlobal.util.initMapDisk(c, handler);
    
    function handleFileSelect(e){
        handler.addFile(e.target.files[0]);
    }
    document.getElementById('recordFile').addEventListener('change', handleFileSelect, false);



    var elm = document.getElementById('sv_pl_play');
    elm.addEventListener('click', function(e){
        if (!player) return;
        var state = e.target.getAttribute('data-state');
        if (state == 'pause'){
            player.pause();
            e.target.setAttribute('data-state', 'play');
        }else{
            player.play();
            e.target.setAttribute('data-state', 'pause');
        }
    }, false);

    elm = document.getElementById('sv_pl_stop');
    elm.addEventListener('click', function(){
        if (!player) return;
        player.close();
        initState();
    }, false);

    seekBar.addEventListener('click', function(e){
        if (!player) return;
        var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth * 100;
        console.log('pos:' + pos);
        player.seek(pos);
    }, false);

    elm = document.getElementById('sv_pl_scan');
    elm.addEventListener('click', function(e){
        if (!player) return;
        var state = e.target.getAttribute('data-state');
        if (state == 'scanmode'){
            player.scan(true);
            e.target.setAttribute('data-state', 'normalmode');
            e.target.setAttribute('title', 'Normal Mode');
        }else{
            player.scan(false);
            e.target.setAttribute('data-state', 'scanmode');
            e.target.setAttribute('title', 'Scan Mode');
        }
    }, false);

    elm = document.getElementById('sv_pl_mute');
    elm.addEventListener('click', function(e){
        if (!player) return;
        var state = e.target.getAttribute('data-state');
        if (state == 'mute'){
            player.setVolume(0);
            e.target.setAttribute('data-state', 'unmute');
        }else{
            player.setVolume(1);
            e.target.setAttribute('data-state', 'mute');
        }
    }, false);
    

    
}, false);

