/**
 *

 UPDATE `t_news` SET `imgsrc`=( case
 when   locate('dd,',imgsrc)>0 then  replace(imgsrc,'dd,','')
 when  locate(',dd',imgsrc)>0 then replace(imgsrc,',dd','')
 when  locate('dd',imgsrc)>0 then  replace(imgsrc,'dd','')
 end
 )



 */
$(function() {
    productTypeOp.loadProductType();
    $("#productTypeForm").ajaxForm(function(data){
        productTypeOp.parseData(data);
        $("#productTypeDiv a.select").click();
    });
    $("#editProductType").click(function() {
        if ($("#editProductType").data('isEdit')) {// 是编辑的时候点击就保存
            productTypeOp.hideVisibleBtn();
            $("#productTypeForm").submit();
            $("#editProductType").data('isEdit', false);
            $("#editProductType").val('编辑分类');
        } else {// 不是编辑的时候点击变成编辑状态
            $("#productTypeDiv a.select").removeClass('select');
            $("#editProductType").data('isEdit', true);
            $("#editProductType").val('编辑完成');
            $("#pTypeli_-1").myTip({text:'提示：点击分类可编辑、添加、删除分类！',isTop:true,closeBtnIsRight:false});
        }
    });
    var sptbClickCount = 0;
    $('#searchProductType').keyup(function(e) {
        if (e.keyCode == 13) {
            $("#searchProductTypeBtn").click();
        }
    });
    $("#searchProductTypeBtn").click(function() {
        var sval = $.trim($("#searchProductType").val());
        if (sval == '')
            return;
        var oldValue = $('#searchProductType').data('oldValue');
        if (sval == oldValue) {
            sptbClickCount++;
        } else {
            sptbClickCount = 1;
            $('#searchProductType').data('oldValue', sval);
        }
        var eqindex = 0;
        var eqlength = $('#productTypeDiv a[data="' + sval + '"]').length;
        if (eqlength==0) {
            //if ($("#searchProductTypeTip").length==0) {
            $("#searchProductTypeBtn").myTip({text:'无法定位分类，请确认分类名是否正确！',id:'searchProductTypeTip'});
            //}
        }else{
            $("#productTypeDiv a").each(function() {
                if ($(this).text() == sval) {
                    eqindex++;
                    if (sptbClickCount % eqlength == eqindex % eqlength) {
                        $(this).click();
                        var pids = $(this).attr('parentids').split(',');
                        productTypeOp.showAllParent(pids,$(this));
                    }
                }
            });
        }

    });


    $('body').append('<div id="dialog-form-newProductType" style="display:none;">'
        + getDialogTitle('添加分类',"dialog-form-newProductType",60)
        +'<SPAN class="validateTips" style="color:red"></SPAN>'
        +'<div style="margin-top:0px;">'
        +'<div id="clickLoding" style="display: none;position: absolute;left: 150px;top: 90px;"><img src="common/skin/images/loading.gif" alt="loading..."></div>'
        +'<form id="createProductTypeForm">'
        +'<table style="WORD-BREAK: break-all; WORD-WRAP: break-word">'
        +'<tbody>'
        +'<tr height="30px;">'
        +'<td colspan="2" style="text-align: center;">'
        +'<input type="radio" name="productTypeDir" value="0" style="top: 3px; position: relative;" id="sibProductType">同级分类'
        +'<input type="radio" name="productTypeDir" checked="checked" value="1" style="margin-left: 14px;top: 3px;position: relative;" id="chiProductType">子级分类'
        +'</td>'
        +'</tr>'
        +'<tr height="30px;">'
        +'<td colspan="2" align="right" style="text-align: center;">'
        +'<span>分类名称</span>&nbsp;&nbsp;'
        +'<input type="text" name="productTypeName" id="productTypeName" value="" maxlength="50" size="30" style="width:160px;"></td>'
        +'<input type="hidden" name="prodcutTypeSelectID" id="prodcutTypeSelectID"/>'
        +'<input type="hidden" name="prodcutTypeSelectPID" id="prodcutTypeSelectPID"/>'
        +'</tr>'
        +'<tr>'
        +'<tr height="10px;"><td colspan="2" align="right" style="text-align: center;"><span id="productTypeAddError">同级不允许重名！</span></td></tr>'
        +'<td colspan="3" align="right">'
        +'<input id="createInfo" class="btn_save" type="button" value="保存" onclick="productTypeOp.tempAdd()">'
        +'<input class="btn_cancel" type="button" value="取消" onclick="closeDialog(\'dialog-form-newProductType\');">'
        +'</td>'
        +'</tr>'
        +'</tbody>'
        +'</table>'
        +'</form>'
        +'</div></div>');

    $("#dialog-form-newProductType").dialog( {
        autoOpen : false,
        height : 'auto',
        width : 400,
        modal : true,
        show : "drop",
        hide : "drop",
        closeOnEscape: false,
        resizable : false,
        open : function(){
        }
    });

});

var productTypeOp = {
    allsort : "",
    unsort : "",
    tempindex : -1,
    productTypeSize:0,
    loadProductType:function(){
        $.post(contextPath + "/product_ajaxGetProductTypeJsonList.yk", function(data) {
            productTypeOp.parseData(data);
        });
    },initOldSelect:function(){
        var val = productTypeOp.getValue();
        $("#productTypeDiv a").removeClass('select');
        if (val == '') {
            $("#pTypea_-1").addClass('select');
        }else{
            if($("#pTypea_"+val).length==0){
                productTypeOp.setValue("");
                $("#pTypea_-1").addClass('select');
            }else{
                $("#pTypea_"+val).addClass('select');
                productTypeOp.showAllParent($("#pTypea_"+val).attr('parentids').split(','),$("#pTypea_"+val));
            }
        }
    },
    parseData:function(data){
        data = eval('(' + data + ')');
        var html = productTypeOp.createContent('-1', data);
        $("#productTypeDiv").empty();
        $("#productTypeDiv").append(html);
        $("#editProductType").data('isEdit', false);
        productTypeOp.bindEvent();
        productTypeOp.initOldSelect();
    },
    createContent:function(parentids, json){
        var ht = $('<ul>');
        if (parentids.split(",").length > 1) {
            ht.hide();
        }
        for (var i = 0; i < json.length; i++) {
            var obj = json[i];
            if(obj.createTime==0){
                productTypeOp.allsort = obj.name;
            }else if(obj.createTime==1){
                productTypeOp.unsort = obj.name;
            }
            if (obj.parentids == parentids) {
                var li = productTypeOp.createContentLi(obj)
                ht.append(li);
                if (obj.parentids == -1) {
                    li.append(productTypeOp.createContent(obj.ID, json));
                } else {
                    li.append(productTypeOp.createContent(obj.parentids + "," + obj.ID, json));
                }
            }
        }
        return ht;
    },
    add : function(id,pid) {
        $("#sibProductType,#chiProductType").removeAttr('disabled');
        $('#productTypeAddError').hide();
        if (id=="-1") {
            $("#sibProductType").attr('disabled','disabled');
            $("#chiProductType").attr('checked','checked');
        }else if(id=="-2"){
            $("#sibProductType").attr('checked','checked');
            $("#chiProductType").attr('disabled','disabled');
        }else if(pid.split(',').length==3){
            $("#sibProductType").attr('checked','checked');
            $("#chiProductType").attr('disabled','disabled');
        }
        $("#productTypeName").val('');
        $("#prodcutTypeSelectID").val(id);
        $("#prodcutTypeSelectPID").val(pid);
        $("#dialog-form-newProductType").dialog("open");

    },
    tempAdd:function(){
        var prodcutTypeSelectID = $("#prodcutTypeSelectID").val();
        var prodcutTypeSelectPID = $("#prodcutTypeSelectPID").val();
        var productTypeName = $("#productTypeName").val();
        var tempCreateTime = new Date().getTime();
        var tempid = 'temp-' + new Date().getTime();
        if($("#createProductTypeForm :radio[name='productTypeDir']:checked").val()==1){//下级
            var pid = prodcutTypeSelectPID + "," + prodcutTypeSelectID;
            if (prodcutTypeSelectPID == -1) {
                pid = prodcutTypeSelectID;
            }
            if (productTypeOp.findRepeatNum(pid, productTypeName)==1) {
                $('#productTypeAddError').show();
            }else{
                $('#productTypeAddError').hide();
                var newLi = productTypeOp.createContentLi({ID: tempid, name: productTypeName, parentids: pid, createTime: tempCreateTime,tempID:tempid});
                if ($("#pTypeli_" + prodcutTypeSelectID + " > ul").length > 0) {
                    $("#pTypeli_" + prodcutTypeSelectID + " > ul").append(newLi);
                } else {
                    $("#pTypeli_" + prodcutTypeSelectID).append(($('<ul>').append(newLi)));
                }
                productTypeOp.bindEvent();
                $("#dialog-form-newProductType").dialog('close');
            }

        }else{
            if (productTypeOp.findRepeatNum(prodcutTypeSelectPID, productTypeName)==1) {
                $('#productTypeAddError').show();
            }else{
                $('#productTypeAddError').hide();
                var newLi = productTypeOp.createContentLi({ID: tempid, name: productTypeName, parentids: prodcutTypeSelectPID, createTime: tempCreateTime,tempID:tempid});
                $("#pTypeli_" + prodcutTypeSelectID).parent().append(newLi);
                productTypeOp.bindEvent();
                $("#dialog-form-newProductType").dialog('close');
            }
        }

    },
    save:function(){
//		$('#createProductTypeForm').ajaxForm(function(data){
//			console.info(data);
//		});
    },
    del : function(id) {
        jConfirm('删除分类后，分类下产品将会被移至“'+productTypeOp.unsort+'”下。\r\n确定删除吗？', '提示框', function(flag) {
            if (flag) {
                if (id.startsWith('temp-')) {
                    $("#pTypeli_"+id).remove();
                    productTypeOp.bindEvent();
                }else{
                    $.post(contextPath + "/product_ajaxDeleteProductType.yk?id="+id, function(data) {
                        if (data==-1) {
                            jAlert('对不起，您没有此操作权限。','提示');
                            return;
                        }else if(data==-2 || data == -3){
                            jAlert('参数错误。','提示');
                            return;
                        }else if (data==1) {
                            $("#pTypeli_"+id).remove();
                        }
                        productTypeOp.bindEvent();
                    });
                }

            }
        });
    },
    hideVisibleBtn: function () {
        $("#productTypeDiv input[id^='pTypeaddbtn_']:visible").hide();
        $("#productTypeDiv input[id^='pTypedelbtn_']:visible").hide();
    }, bindEvent: function () {
        productTypeOp.productTypeSize= $("#productTypeDiv li").length;
        $("#productTypeDiv li").each(function () {
            if ($("#" + this.id + " ~ li").length == 0) {
                $(this).addClass("end");
            } else {
                $(this).removeClass("end");
            }
            if ($(this).find('li').length == 0) {
                $(this).find('em').hide();//remove();
            } else {
                $(this).find('em').show();
            }
        });
        $("#productTypeDiv em").unbind('click');
        $("#productTypeDiv em").each(function () {
            $(this).click(function () {
                if ($(this).hasClass('off')) {
                    $(this).removeClass('off');
                    $(this).parent().siblings('ul').hide();
                } else {
                    $(this).addClass('off');
                    $(this).parent().siblings('ul').show();
                }
            });
        });
        $("#pTypeem_-1").addClass('off');
    },getShowName:function(name){
        if (name.length>20) {
            name = name.substring(0,20)+"...";
        }
        return name;
    },
    createContentLi: function (obj) {
        productTypeOp.tempindex++;
        var li = $('<li id="pTypeli_' + obj.ID + '" ></li>');
        var showName = productTypeOp.getShowName(obj.name);
        var name = $('<a title="'+obj.name+'"  data="' + obj.name + '" parentids="' + obj.parentids + '" id="pTypea_' + obj.ID + '">' + showName + '</a>');
        var em = $('<em id="pTypeem_' + obj.ID + '" class=""></em>');
        var newName = $('<input  type="text" id="newname_' + obj.ID + '" name="cptList[' + productTypeOp.tempindex + '].name" value="' + obj.name + '" parentids="' + obj.parentids + '">').hide();
        var oldName = $('<input type="hidden" name="cptList[' + productTypeOp.tempindex + '].oldName" value="' + obj.name + '" >');
        var $id = $('<input type="hidden" name="cptList[' + productTypeOp.tempindex + '].ID" value="' + obj.ID + '" >');
        var $createTime = $('<input type="hidden" name="cptList[' + productTypeOp.tempindex + '].createTime" value="' + obj.createTime + '" >');
        var $parentids = $('<input type="hidden" style="width:100px" name="cptList[' + productTypeOp.tempindex + '].parentids" value="' + obj.parentids + '" >');
        var $addBtn = $('<input type="button" style="display:none" value="添加" id="pTypeaddbtn_' + obj.ID + '" onclick="productTypeOp.add(\'' + obj.ID + '\',\'' + obj.parentids + '\')">');
        var $delBtn = $('<input type="button" style="display:none" value="删除" id="pTypedelbtn_' + obj.ID + '" onclick="productTypeOp.del(\'' + obj.ID + '\')">');
        if (obj.createTime == 1 || obj.createTime == 0) {
            $delBtn.attr('disabled', 'disabled');
        }
        name.click(function () {
            var id = this.id.split("_")[1];
            if ($("#editProductType").data('isEdit')) {
                productTypeOp.hideVisibleBtn();
                $("#newname_" + id).show();
                if (productTypeOp.productTypeSize<=1000) {
                    $("#pTypeaddbtn_" + id + ",#pTypedelbtn_" + id).show();
                }
                $("#newname_" + id).focus();
                $(this).hide();
            } else {
                $("#productTypeDiv a").removeClass('select');
                $(this).addClass('select');
                productTypeOp.setValue(id);
                initPager();
            }
        });
        newName.blur(function () {
            var id = this.id.split("_")[1];
            var inputVal = $(this).val();
            if ($.trim($(this).val())=='') {
                $(this).val($("#pTypea_" + id).attr('data'));
            }
//            var num  = 0;
//            $('#productTypeDiv input[name$=".name"][parentids="'+$(this).attr('parentids')+'"]').each(function(i,o){
//            	if ($(o).val()==inputVal) {
//					num++;
//				}
//            });
            if (productTypeOp.findRepeatNum($(this).attr('parentids'), inputVal)>1) {//有重复的
                $(this).val($("#pTypea_" + id).attr('data'));
                $(this).myTip({text:'提示：同级不允许重名！',isTop:true,closeBtnIsRight:false,id:"tip"+id});
            }

            $("#pTypea_" + id).text(productTypeOp.getShowName($(this).val())).attr('title',$(this).val()).show();
            $(this).hide();
        });
        var $div = $('<div style="display:inline-flex">').append(em).append(name).append(oldName).append($id).append($createTime).append($parentids).append(newName).append($addBtn).append($delBtn);
        if (obj.tempID) {
            $div.append($('<input type="hidden" name="cptList[' + productTypeOp.tempindex + '].tempID" value="' + obj.ID + '" >'));
        }
        return li.append($div);
    },findRepeatNum:function(pids,inputVal){
        var num  = 0;
        $('#productTypeDiv input[name$=".name"][parentids="'+pids+'"]').each(function(i,o){
            if ($(o).val()==inputVal) {
                num++;
            }
        });
        return num;
    },setValue:function(id){
        init();
        setValue('productType-cache-'+suserid,id);
    },getValue:function(){
        init();
        if ($("#productTypeDiv a.select").length==1) {
            return $("#productTypeDiv a.select").attr('id').split("_")[1];
        }
        var val = getValue('productType-cache-'+suserid);
//    	if ($('#pTypea_'+val).length==0) {
//			return '';
//		}
        //return val==(tenantID_server+"-0")?'':val;
        return val;
    },showAllParent:function(pids,o){
        for (var i = 0; i < pids.length; i++) {
            if (pids[i] != '') {
                $("#pTypeli_" + pids[i]).parent().show();
                $("#pTypeem_" + pids[i]).addClass('off');
            }
        }
        o.parent().parent().parent().show();
    }

}

$.fn.myTip = function (options) {
    var defaluts = {
        text: '',
        isTop: false,
        hasCloseBtn:true,
        closeBtnIsRight:true,
        autoClose:true,
        autoCloseTime:5000,
        triangle:'left',
        id:''
    }
    var setting = $.extend({}, defaluts, options);
    if (setting.id!='' && $('#'+setting.id).length>0) {
        return;
    }
    var tip = $('<div></div>');
    var tipText = $('<div></div>');
    var top = this.offset().top;
    var img = $('<img src="/crm/pic/tipup.png">');
    if (setting.isTop) {
        top = top -30;
    } else {
        top = top + this.height()+20;

    }
    tipText.text(setting.text);
    img.css('z-index',999);
    img.css('position', 'absolute');
    tip.css({
        'left': this.offset().left,
        'z-index':998,
        'background': '#F0F0F0',
        'border': '1px solid #CCCCCC',
        'top':top,
        'position': 'absolute',
        'padding':4
    });
    tip.append(tipText);

    var closebtn = $('<img src="/crm/pic/tipclose.png" style="width: 11px;cursor: pointer;margin: 2px 9px 0px 6px"/>');

    if(setting.hasCloseBtn){
        tip.append(closebtn);
        if(setting.closeBtnIsRight){
            tipText.css('float','left');
        }else{
            tipText.css('float','right');
        }
        closebtn.click(function () {
            tip.remove();
            img.remove();
        });
    }
    if(setting.autoClose){
        setTimeout(function () {
            tip.remove();
            img.remove();
        },setting.autoCloseTime)
    }
    if (setting.id!='') {
        tip.attr('id',setting.id)
    }
    $('body').append(tip);
    if(setting.triangle=='left'){
        img.css('left', this.offset().left+5);
    }else{
        img.css('left', this.offset().left+tip.width()-20);
    }
    if(setting.isTop){
        img.css('top',top+tip.outerHeight()-1);
        img.attr('src','/crm/pic/tipdown.png');
    }else{
        img.css('top',top-11);
    }
    $('body').append(img);

}

