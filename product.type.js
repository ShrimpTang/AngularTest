$(function() {
	$.post(contextPath + "/product_ajaxGetProductTypeJsonList.yk",function(data){
		data = $.parseJSON(data);
		var html = createContent('-1', data);
		$("#productTypeDiv").append(html);
		 $("#productTypeDiv").data('isEdit', false);
	        $("#productTypeDiv li").each(function () {
	            if ($("#" + this.id + " ~ li").length == 0) {
	                $(this).css("background-color", "white");
	            }
	            if ($(this).find('li').length == 0) {
	                $(this).find('em').remove();
	            }
	        });
	        $("#productTypeDiv em").each(function () {
	            $(this).click(function () {
	                if ($(this).hasClass('off')) {
	                    $(this).removeClass('off');
	                    $(this).siblings('ul').hide();
	                } else {
	                    $(this).addClass('off');
	                    $(this).siblings('ul').show();
	                }
	            });
	        });
	        var sptbClickCount = 0;
	        $('#searchProductType').keyup(function(e){
	            if(e.keyCode==13){
	                $("#searchProductTypeBtn").click();
	            }
	        });
	        $("#searchProductTypeBtn").click(function () {
	            var sval = $.trim($("#searchProductType").val());
	            if (sval == '')return;
	            var oldValue = $('#searchProductType').data('oldValue');
	            if (sval == oldValue) {
	                sptbClickCount++;
	            } else {
	                sptbClickCount = 1;
	                $('#searchProductType').data('oldValue', sval);
	            }

	            var eqindex = 0;
	            var eqlength = $('#productTypeDiv a[data="' + sval + '"]').length;
	            $("#productTypeDiv a").each(function () {
	                if ($(this).text() == sval) {
	                    eqindex++;
	                    if (sptbClickCount % eqlength == eqindex % eqlength) {
	                        $(this).click();
	                        var pids = $(this).attr('parentids').split(',');

	                        for (var i = 0; i < pids.length; i++) {
	                            if(pids[i]!=''){
	                                $("#li_"+pids[i]).parent().show();
	                                $("#li_"+pids[i]+" > em").addClass('off');

	                            }
	                        }
	                        $(this).parent().parent().show();
	                    }
	                }
	            });
	        });
	});
    function createContent(parentids, json) {
        var ht = $('<ul>');
        if (parentids.split(",").length > 1) {
            // ht.hide();
        }
        for (var i = 0; i < json.length; i++) {
            var obj = json[i];
            if (obj.parentids == parentids) {
                var li = $('<li id="li_' + obj.ID + '"></li>');
                var name = $('<a data="' + obj.name + '" parentids="' + obj.parentids + '" id="a_' + obj.ID + '">' + obj.name + '</a>');
                name.click(function () {
                    if ($("#productTypeDiv").data('isEdit')) {

                    } else {
                        $("#productTypeDiv a").css('background-color', 'white');
                        $(this).css('background-color', '#ADD6ED');

                    }
                });
                var em = $('<em id="em_' + obj.ID + '" class="off"></em>');
                var newName = $('<input  type="text" name="cptList['+i+'].name" value="' + obj.name + '" >').hide();
                var oldName = $('<input type="hidden" name="cptList['+i+'].oldName" value="' + obj.name + '" >');
                var $id = $('<input type="hidden" name="cptList['+i+'].id" value="' + obj.ID + '" >');
                var $parentids = $('<input type="hidden" style="width:100px" name="cptList['+i+'].parentids" value="' + obj.parentids + '" >');
                var $addBtn = $('<input type="button" value="添加" onclick="productTypeOp.aa()">');
                li.append(em).append(name).append(oldName).append($id).append($parentids).append(newName).append($addBtn);
                ht.append(li);
                if (obj.parentids == -1) {
                    li.append(createContent(obj.ID, json));
                } else {
                    li.append(createContent(obj.parentids + "," + obj.ID, json));
                }
            }
        }
        return ht;
    }
   
});


var productTypeOp={
		aa:function(){
			console.info('ccc');
		}
}