/**
 * 共通ユーティリティ
 */
(function(global, namespace) {
  
    /**
     * ドットで区切られた文字列を展開し、グローバル領域に定義していきます。
     * @param {string} str 名前空間用の文字列。
     * @return {object} 最後に定義されたオブジェクト。
     */ 
    function Namespace(str) {
        var ns = str.split('.');
        var here = global;
        for (var i = 0, l = ns.length; i < l; i++){
            if (typeof(here[ns[i]]) == 'undefined') here[ns[i]] = {};
            here = here[ns[i]];
        }
        return here;
    };
       
    var ns = Namespace(namespace);
    ns.addNamespace = Namespace;

}(this, "jqb.common"));

/**
 * プロトタイプオブジェクト
 */
(function(global, namespace){
    var ns = addNamespace(namespace);
    /**
     * 同期オブジェクトの生成
     */
    ns.SyncObject = function(){
        var obj = {};
        obj.observers = []; //通知先メソッドの配列
        /**
         * 通知先メソッドの追加
         * @@aram {function} func 追加するメソッドの参照
         */
        obj.addObserver = function( func ){
            obj.observers.push( funct );
        };
        /**
         * 
        return obj;
    };
    /**
     * Notifireオブジェクトの生成
     */
    ns.Notifier = function(){
        var obj = ns.SyncObject();
        /**
         * オブザーバへの通知
         */
        obj.notifiy = function(){
            for( var i=0 ; i<obj.observers.length ; i++ ){
                obj.observers[i]();
            }
        };
        return obj;
    };
    /**
     * Dataオブジェクトの生成
     */
    ns.Data = function(){
        var obj = ns.Notifier();
        obj.data = {}; // 保持するデーダ
        /**
         * データをセットし、通知を行う
         * @param {mix} val セットするデータ
         */
        obj.set = function( val ){
            obj.data = val;
            obj.notify();
        };
        /**
         * データを取得する
         * @return {mix} 保持しているデータ
         */
        obj.get = function(){
            return obj.data;
        };
        return obj;
    };
    /**
     * Boardオブジェクトの生成
     */
    ns.Board = function(){
        var obj = ns.Notifier();
        obj.view = {}; // ビューオブジェクトの保管場所
        /**
         * オブザーバ同期を設定する
         * @param {[[syncObject,observerMethod],...]} observelist 同期定義配列
         */
        obj.observe = function( observelist ){
            for(var i=0 ; i<observelist.length ; i++){
                observelist[i][0].addObserver(observelist[i][1]);
            }
        }
        /**
         * データバインドを設定する
         * @param {[[viewElement, data]...]} binderlist データバインド定義配列
         */
        obj.bind = function( binderlist ){
            for( var i=0 ; i<binderlist.length ; i++){
                var viewSetAction = obj.view.bindSetAction(binderlist[i][0],binderlist[i][1]);
                obj.observe([[binderlist[i][1], viewSetAction]]);
            }
        }
        return obj;
    };

    /**
     * Viewオブジェクトの生成
     * @param {array} datas オブザーバ同期するデータの連想配列
     */
    ns.View = function( datas ){
        var obj = ns.Notifier();
        obj.elements = {}; // 操作対象エレメントのセレクタを持つ連想配列
        obj.bindings = []; // データバインドに用いるイベントメソッドの配列

        obj.data = datas;  // Boardの持つバインド対象配列をセット
        /**
         * バインド用イベントメソッドの生成
         * @param {str} element バインド対象エレメント
         * @param {dataName} element バインド対象データ
         * @return {function} 生成したメソッドの参照
         */
        obj.bindSetAction = function ( element, dataName ){
            var bindFunc = function(){
                $(obj.elements[element]).val(obj.data[dataName].get());
            }
            obj.bindings.push(bindFunc);
            $(obj.elements[element]).on("change",function(){
                data[dataName].data = $(obj.elements[element]).val();
            });
            return bindFunc;
        }
        return obj;
    }
}(this, "jqb.mvc"));