/**
 * サンプルアプリケーション
 */
(function(global, namespace){
    var ns = jqb.common.addNamespace(namespace);

    // view
    ns.view = function( datas, actions ){
    	var obj = jqb.View(datas, actions);
    	// elements
    	obj.useElements({
    		messagelist: "#message",
    		submit: "#submit",
    		content: "#content"
    	});
    	// events
    	obj.elements.submit.on("click", obj.actions.submit);

    	obj.write = function( data ){
    		obj.elements.messagelist.html(data);
    	}
    	return obj;
    };

    // board
    ns.appBoard = function(){
    	var obj = jqb.Board();
    	// === datas =======================================
    	obj.datas = {
    		messagelist : jqb.Data(),
    		content : jqb.Data()
    	};

    	// === requesters ==================================
    	obj.reuesters = [];

    	// === logics ======================================
    	obj.logics = [];

    	// === actions =====================================
    	obj.actions.submit = function(){
    		obj.datas.messagelist.set(obj.datas.content.get());
    	}

    	// view
    	obj.view = sample.view(obj.datas, obj.actions);


    	// === data bind ===================================
    	obj.bind([
    		[obj.view.elements.content, obj.datas.content]
    	]);
    	// === observe =====================================
    	obj.observe([
    		[obj.datas.messagelist, obj.view.write]
    	]);
    	return obj;
    }

}(this, "sample"));

$(function(){
	sample.appBoard();
});