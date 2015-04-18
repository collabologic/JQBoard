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
    var ns = jqb.common.addNamespace(namespace);
    /**
     * Notifireオブジェクトの生成
     */
    ns.Notifier = function(){
        var obj = {};
        obj.observers = []; //通知先メソッドの配列
        /**
         * 通知先メソッドの追加
         * @@aram {function} func 追加するメソッドの参照
         */
        obj.addObserver = function( func ){
            obj.observers.push( func );
        };

        /**
         * オブザーバへの通知
         * @param {function} exclution 通知から除外するメソッドの参照
         */
        obj.notify = function( exclution ){
            for( var i=0 ; i<obj.observers.length ; i++ ){
                if( exclution != undefined && exclution == obj.observers[i]){
                    continue;
                }
                obj.observers[i](obj.get());
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
        obj.actions = {}; // イベントハンドラの保管場所
        /**
         * オブザーバ同期を設定する
         * @param {[[Notifier,observerMethod],...]} observelist 同期定義配列
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
     * @param {array} actions イベントメソッドの配列
     */
    ns.View = function( datas, actions ){
        var obj = ns.Notifier();
        obj.elements = {}; // 操作対象エレメントのセレクタを持つ連想配列
        obj.bindings = []; // データバインドに用いるイベントメソッドの配列

        obj.data = datas;  // Boardの持つバインド対象配列をセット
        obj.actions = actions // Boardの持つアクションメソッドをセット
        /**
         * エレメントのセット
         * @param {obj} elements {elementName: selector}
         */
        obj.useElements = function( elements ){
            for( var i in elements){
                obj.elements[i] = $(elements[i]);
            }
        }

        /**
         * バインド用イベントメソッドの生成
         * @param {str} element バインド対象エレメント
         * @param {data} element バインド対象データ
         * @return {function} 生成したメソッドの参照
         */
        obj.bindSetAction = function ( element, data ){
            var bindFunc = function(){
                element.off("change");
                element.val(data.get());
                element.on("change",eventFunc);
            };
            var eventFunc = function(){
                data.set(element.val(), bindFunc);
            };
            obj.bindings.push(bindFunc);

            element.on("change",eventFunc);
            return bindFunc;
        }

        /**
         * イベントの定義
         * @param events [["element", "event","methodName"]..]
         */
        obj.setEvents = function( events ){
            for(var i =0 ; i<events.length ; i++){
                obj.elements[events[i][0]].on(events[i][1], obj.actions[events[i][2]]);
            }
        }
        return obj;
    }
}(this, "jqb"));