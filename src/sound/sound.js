/*
 * sound.js
 */

tm.sound = tm.sound || {};


(function() {
    
    /**
     * @class
     * サウンドクラス
     */
    tm.sound.Sound = tm.createClass({
        
        element     : null,
        loaded      : false,
        isPlay      : false,
        
        /**
         * 初期化
         */
        init: function(src) {
            this.element = new Audio();
            this.element.src = src;
            this.element.load();
            this.element.setAttribute("preload", "auto");
            
            var self = this;
            this.element.addEventListener("canplaythrough", function(){
                self.loaded = true;
            });
            this.element.addEventListener("ended", function(){
                self.isPlay = false;
            });
            this.element.addEventListener("error", function(){
                console.warn(this.src + "の読み込みに失敗しました");
            });
            
            this.element.volume = 1.0;
        },
        
        /**
         * 再生
         */
        play: function() {
            this.element.play();
            this.isPlay = true;
            return this;
        },
        
        /**
         * 停止
         */
        stop: function() {
            this.element.stop();
            this.isPlay = false;
            return this;
        },
        
        /**
         * クローン
         */
        clone: function() {
            return TM.App.Sound( this.element.src );
        },
        
    });
    
    
    
    /**
     * @property    volume
     * ボリューム
     */
    tm.sound.Sound.prototype.accessor("volume", {
        "get": function() { return this.element.volume; },
        "set": function(v){ this.element.volume = v; }
    });
    
    
    if ((new Audio()).loop !== undefined) {
    
        /**
         * @property    loop
         * ループフラグ
         */
        tm.sound.Sound.prototype.accessor("loop", {
            "get": function() { return this.element.loop; },
            "set": function(v){ this.element.loop = v; }
        });
    }
    // firefox 対応
    else {
        var onLoopFunc = function() {
            this.play();
        }
        tm.sound.Sound.prototype.accessor("loop", {
            "get": function() { return this.element.loop; },
            "set": function(v){
                // ループが false の状態で ture が来た場合ループ用関数を登録する
                if (this.element.loop != true && v == true) {
                    this.element.addEventListener("ended", onLoopFunc, false);
                }
                // 関数が登録されていて false が設定された場合ループ用関数を解除する
                else if (this.element.loop == true && v == false) {
                    this.element.removeEventListener("ended", onLoopFunc, false);
                }
                this.element.loop = v;
            }
        });
    }
    
    
    /**
     * @static
     * @property    SUPPORT_EXT
     * サポートしている拡張子
     */
    tm.sound.Sound.SUPPORT_EXT = (function(){
        var ext     = "";
        var audio   = new Audio();
        
        if      (audio.canPlayType("audio/ogg") == 'maybe') { ext="ogg"; }
        else if (audio.canPlayType("audio/mp3") == 'maybe') { ext="mp3"; }
        else if (audio.canPlayType("audio/wav") == 'maybe') { ext="wav"; }
        
        return ext;
    })();
    
})();


(function(){
    
    /**
     * @class   サウンドマネージャクラス
     * サウンドを管理するクラス
     */
    tm.sound.SoundManager = {
        sounds: {}
    };
    
    /**
     * @static
     * @method
     * サウンドを追加
     */
    tm.sound.SoundManager.add = function(name, src, cache) {
        cache = cache || 4;
        
        // 拡張子チェック
        if (src.indexOf('.') == -1) {
            src += "." + tm.sound.Sound.SUPPORT_EXT;
        }
        
        var cacheList = this.sounds[name] = [];
        for (var i=0; i<cache; ++i) {
            var sound = tm.sound.Sound(src);
            cacheList.push( sound );
        }
        
        return this;
    };
    

    
    /**
     * @static
     * @method
     * サウンドを取得
     */
    tm.sound.SoundManager.get = function(name) {
        var cacheList = this.sounds[name];
        for (var i=0,len=cacheList.length; i<len; ++i) {
            if (cacheList[i].isPlay == false) {
                return cacheList[i];
            }
        }
        // 仕方なく0番目を返す
        return cacheList[0];
    };
    
    
    /**
     * @static
     * @method
     * サウンドを取得(index 指定版)
     */
    tm.sound.SoundManager.getByIndex = function(name, index) {
        return this.sounds[name][index];
    };
    
    /**
     * @static
     * @method
     * サウンドを削除
     */
    tm.sound.SoundManager.remove = function(name) {
        // TODO:
        
        return this;
    };
    
    /**
     * @static
     * @method
     * ボリュームをセット
     */
    tm.sound.SoundManager.setVolume = function(name, volume) {
        // TODO:
        
        return this;
    };
    
    
})();
