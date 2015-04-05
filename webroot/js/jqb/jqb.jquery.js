/**
 * jQueryによるViewとRequesterの定義
 */
(function(global, namespace){
    var ns = jqb.common.addNamespace(namespace);
    /**
     * Viewオブジェクトの生成
     * @param {array} datas オブザーバ同期するデータの連想配列
     * @param {array} actions イベントメソッドの配列
     */
    ns.View = function( datas, actions ){
        var obj = jqb.View(datas, actions);
        obj.renderers = {};// 書き込みメソッドを保持する連想配列
        /**
         * val()による埋め込みを登録する
         * @param {str} name レンダリング名称
         * @param {str} element エレメント
         */
        obj.setFormValueRenderer = function(name, element){
            var func = function(val){
                element.val(val);
            };
            obj.renderers[name] = func;
        };
        /**
         * InnerHTMLへの埋め込みメソッドを登録する
         * @param {str} name レンダリング名称
         * @param {str} element エレメント
         */
        obj.setHtmlRenderer = function(name, element){
            var func = function(html){
                element.html(html);
            };
            obj.renderers[name] = func;
        }
        /**
         * JQueryテンプレートレンダリングを登録する
         * @param {str} name レンダリング名称 
         * @param element {str} element エレメント
         * @param template {str} template jQueryテンプレートID
         */
        obj.setJQueryTmplRenderer = function(name, element, template){
            var func = function(data){
                $(template).tmpl(data).appendTo(element);
            };
            obj.renderers[name] = func;
        }
        /**
         * 書き出しメソッドの一括登録
         * @param {array} list {name:[type, element|function, [params...]]...]
         */
        obj.setRenderers = function (list){
            for( var i in list ) {
                switch( list[i][0] ){
                    case "val": 
                        obj.setFormValueRenderer( i, list[i][1]);
                        break;
                    case "html":
                        obj.setHtmlRenderer( i, list[i][1]);
                        break;
                    case "tmpl":
                        obj.setJQueryTemplRenderer( i, list[i][1], list[i][2]);
                        break;
                    case "func":
                        obj.renderers[i] = list[i][1];
                        break;
                    default:
                        break;
                }
            }
        }
        return obj;
    }
}(this, "jqb.jquery"));