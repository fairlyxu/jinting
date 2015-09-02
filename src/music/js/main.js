define(function (require) {
    
  
    var MusicVisualizer = require('/music/js/MusicVisualizer');
    var size = 64;
    var mv = new MusicVisualizer({
        size: size,
        draw: draw
    });
    var box = $('#box')[0];
    var height, width;
    var canvas = $('#myCanvas')[0];
    var ctx = canvas.getContext('2d');
    var Dots = [];
    var random = function (min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }
        // 得到原点
    var getDots = function () {
        Dots = [];
        for (var i = 0; i < size; i++) {
            var x = random(0, width);
            var y = random(0, height);
            var color = 'rgba(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ',' +
                random(0, 1) +
                ')';
            Dots.push({
                x: x,
                y: y,
                dx: random(1, 4),
                color,
                color
            });
        }
    };
    var resize = function () {
        height = box.clientHeight;
        width = box.clientWidth;

        canvas.height = height;
        canvas.width = width;
        getDots();
    }
    resize();
    window.onresize = resize;

    // 在canvas上面畫圖
    var draw = function (arr) {
        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < size; i++) {
            ctx.beginPath();
            var o = Dots[i];

            var r = 10 + arr[i] / 256 * (height > width ? width : height) / 20; // 半徑
            ctx.arc(o.x, o.y, r, 0, Math.PI * 2, true);

            // 創建漸變色
            var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
            g.addColorStop(0, '#fff');
            g.addColorStop(1, o.color);
            ctx.fillStyle = g;
            ctx.fill();
            o.x += (o.dx); //o.x += (o.dx * r/size) ;
            o.x = (o.x >= width ? 0 : o.x);

        }
    };


    var requestAnimationFrame;


    // 需要修复的BUG ： 因为是异步获取，当出现正在播放时，要停止原来歌曲的播放
    function init() {}

    var changeVolume = function () {
        var percent = this.value / this.max;
        gainNode.gain.value = percent * percent;

    };

    $('#volume').on('change', function () {
        mv.changeVolume(this.value / this.max);
    });
    $('#stopBtn').on('click', function () {
        mv.stopMusic()
    });
    mv.play();
})