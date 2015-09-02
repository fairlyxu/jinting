define(function (require) {
    function MusicVisualizer(obj) {
        this.size = obj.size || 128;
        this.ac = new(window.AudioContext || window.webkitAudioContext)();
        // 声音控制器
        this.gainNode = this.ac[this.ac.createGain ? 'createGain' : 'createGainNode']();
        this.gainNode.connect(this.ac.destination);
        // 音乐分析器
        this.analyser = this.ac.createAnalyser();
        this.analyser.fftSize = this.size * 2;
        this.analyser.connect(this.gainNode);
        // 音乐数据源
        this.bufferSource = obj.bufferSource;
        // xhr 请求
        this.xhr = new XMLHttpRequest();
        //画图放法
        this.draw = obj.draw;
        this.visualize();

    }

    /**
     * 加载音乐
     * @param url 音乐url 
     */
    MusicVisualizer.prototype.load = function (url, fun) {
        var obj = this;
        obj.xhr.abort();
        var url = 'src/music/media/countingstars.mp3'
        obj.xhr.open('GET', url, true); //建立一个请求
        obj.xhr.responseType = 'arraybuffer'; //配置数据返回类型
        //  一旦获取完成，对音频进行进一步操作，比如解码
        obj.xhr.onload = function () {
            fun(obj.xhr.response);
        }
        obj.xhr.send();

    };
    MusicVisualizer.prototype.decode = function (arraybuffer, fun) {
            
            var obj = this;
            obj.ac.decodeAudioData(arraybuffer, function (buffer) {
                fun(buffer);
            }, function (err) {
                console.log('err', err);
            });

        }
        // 
    MusicVisualizer.prototype.play = function (url) {
        var obj = this;

        /*  var deferred = new AsyncQueue();
        
        deferred.then(function () {

            // 挂起等待。
            deferred.suspend();

            // 使用 setTimeout 模拟异步执行的操作。
            setTimeout(function () {

                // 恢复执行、
                deferred.resume(1);
            }, 1000);
        });

        // 添加一个异步任务。
        deferred.then(function (data) {

            // 挂起等待。
            deferred.suspend();

            // 使用 setTimeout 模拟异步执行的操作。
            setTimeout(function () {

                // 恢复执行、
                deferred.resume(data + 1);
            }, 1000);
        });

        // 添加一个同步任务。
        deferred.then(function (data) {
            alert('所有异步操作完成。返回的数据：' + data);
        });
*/

        /* obj.load(url).then(obj.decode).then(function(){
             obj.bufferSource = obj.ac.createBufferSource(); // 内存中的一段音频资源
                obj.bufferSource.buffer = buffer;
                //bufferSource.connect(ac.destination);
                obj.bufferSource.connect(obj.analyser);
                obj.bufferSource.connect(obj.gainNode);
                obj.bufferSource[obj.bufferSource.start ? 'start' : 'noteOn'](0); //开始播放音乐
        });*/
        obj.load(url, function (arraybuffer) {
            obj.decode(arraybuffer, function (buffer) {
                obj.bufferSource = obj.ac.createBufferSource(); // 内存中的一段音频资源
                obj.bufferSource.buffer = buffer;
                //bufferSource.connect(ac.destination);
                obj.bufferSource.connect(obj.analyser);
                obj.bufferSource.connect(obj.gainNode);
                obj.bufferSource[obj.bufferSource.start ? 'start' : 'noteOn'](0); //开始播放音乐

                //obj.visualize();

            })
        });
    };

    MusicVisualizer.prototype.stopMusic = function () {
        var obj = this;
        obj.bufferSource[obj.bufferSource.start ? 'stop' : 'start'](); //开始播放音乐
    }
    MusicVisualizer.prototype.changeVolume = function (percent) {

        var obj = this;
        obj.gainNode.gain.value = percent * percent;
    };

    MusicVisualizer.prototype.visualize = function () {
        var obj = this;
        var arr = new Uint8Array(obj.analyser.frequencyBinCount); //创建一个数组  
        requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame;
        //播放的回调函数                       
        function v() {
            //console.log(1);
            obj.analyser.getByteFrequencyData(arr);
            obj.draw(arr);
            requestAnimationFrame(v);
        }
        requestAnimationFrame(v);
    }

    return MusicVisualizer;

})