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
         * @param {str} outtype 書き出し方法（over, append, prepend)
         */
        obj.setHtmlRenderer = function(name, element, outtype){
            var func = function(html){
                switch( outtype ){
                    case "over":
                        element.html(html);
                        break;
                    case "append":
                        element.append(html);
                        break;
                    case "prepend":
                        element.prepend(html);
                        break;
                    default:
                        element.html(html);
                        break;
                }
            };
            obj.renderers[name] = func;
        }
        /**
         * JQueryテンプレートレンダリングを登録する
         * @param {str} name レンダリング名称 
         * @param element {str} element エレメント
         * @param template {str} template jQueryテンプレートID
         * @param {str} outtype 書き出し方法（over, append, prepend)
         */
        obj.setJQueryTmplRenderer = function(name, element, template, outtype){
            var func = function(data){
                switch( outtype ){
                    case "over":
                        element.html($(template.tmpl(data).html()));
                        break;
                    case "append":
                        $(template).tmpl(data).appendTo(element);
                        break;
                    case "prepend":
                        $(template).tmpl(data).prependTo(element);
                        break;
                    default:
                        element.html($(template.tmpl(data).html()));
                        break;
                }
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
                        obj.setHtmlRenderer( i, list[i][1], list[i][2]);
                        break;
                    case "tmpl":
                        obj.setJQueryTemplRenderer( i, list[i][1], list[i][2], list[i][3]);
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
    /**
     * HTTPリクエストを行うモデルを生成
     * @param method POST/GETなどのHTTPメソッド
     * @param url URL
     */
    ns.requester = function( method, url ) {
        var obj = jqb.Notifier();
        obj.method = method;
        obj.url = url;

        /**
         * Ajaxリクエストを行い、結果を自データにセットする
         * @param data リクエストに含めるデータ
         * @param addUrl URLに追記するディレクトリなど
         * @param options $.ajax()のオプション
         */
        obj.request = function( data, addUrl, options ){
            var ajax_params = {
                type : obj.method,
                url : obj.url + addUrl,
                data : data,
                success : function( res ){
                    obj.set(res);
                }
            };
            if( url !== undefined ) {
                $.extend( ajax_params, options);
            }
            $.ajax( ajax, params );
        }
    }
}(this, "jqb.jquery"));