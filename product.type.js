$(function () {
    productTypeOp.loadProductType();
    //$("#productTypeForm").ajaxForm(function (data) {
    //    productTypeOp.parseData(data);
    //});
    $("#editProductType").click(function () {
        if ($("#editProductType").data('isEdit')) {// 是编辑的时候点击就保存
            productTypeOp.hideVisibleBtn();
            $("#productTypeForm").submit();
            $("#editProductType").data('isEdit', false);
            $("#editProductType").val('编辑分类');
        } else {// 不是编辑的时候点击变成编辑状态
            $("#editProductType").data('isEdit', true);
            $("#editProductType").val('编辑完成');
        }
    });
    var sptbClickCount = 0;
    $('#searchProductType').keyup(function (e) {
        if (e.keyCode == 13) {
            $("#searchProductTypeBtn").click();
        }
    });
    $("#searchProductTypeBtn").click(function () {
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
        $("#productTypeDiv a").each(function () {
            if ($(this).text() == sval) {
                eqindex++;
                if (sptbClickCount % eqlength == eqindex % eqlength) {
                    $(this).click();
                    var pids = $(this).attr('parentids').split(',');
                    for (var i = 0; i < pids.length; i++) {
                        if (pids[i] != '') {
                            $("#li_" + pids[i]).parent().show();
                            $("#li_" + pids[i] + " > em").addClass('off');
                        }
                    }
                    $(this).parent().parent().show();
                }
            }
        });
    });


    //$('body').append('<div id="dialog-form-newProductType" style="display:none;">'
    //    + getDialogTitle('添加分类', "dialog-form-newProductType", 60)
    //    + '<SPAN class="validateTips" style="color:red"></SPAN>'
    //    + '<div style="margin-top:0px;">'
    //    + '<div id="clickLoding" style="display: none;position: absolute;left: 150px;top: 90px;"><img src="common/skin/images/loading.gif" alt="loading..."></div>'
    //    + '<form id="createProductTypeForm">'
    //    + '<table style="WORD-BREAK: break-all; WORD-WRAP: break-word">'
    //    + '<tbody>'
    //    + '<tr height="30px;">'
    //    + '<td colspan="2" style="text-align: center;">'
    //    + '<input type="radio" name="productTypeDir" value="0" style="top: 3px; position: relative;" id="sibProductType">同级分类'
    //    + '<input type="radio" name="productTypeDir" checked="checked" value="1" style="margin-left: 14px;top: 3px;position: relative;" id="chiProductType">子级分类'
    //    + '</td>'
    //    + '</tr>'
    //    + '<tr height="30px;">'
    //    + '<td colspan="2" align="right" style="text-align: center;">'
    //    + '<span>分类名称</span>&nbsp;&nbsp;'
    //    + '<input type="text" name="productTypeName" id="productTypeName" value="" maxlength="50" size="30" style="width:160px;"></td>'
    //    + '<input type="hidden" name="prodcutTypeSelectID" id="prodcutTypeSelectID"/>'
    //    + '<input type="hidden" name="prodcutTypeSelectPID" id="prodcutTypeSelectPID"/>'
    //    + '</tr>'
    //    + '<tr>'
    //    + '<td colspan="3" align="right">'
    //    + '<input id="createInfo" class="btn_save" type="button" value="保存" onclick="productTypeOp.tempAdd()">'
    //    + '<input class="btn_cancel" type="button" value="取消" onclick="closeDialog(\'dialog-form-newProductType\');">'
    //    + '</td>'
    //    + '</tr>'
    //    + '</tbody>'
    //    + '</table>'
    //    + '</form>'
    //    + '</div></div>');
    //
    //$("#dialog-form-newProductType").dialog({
    //    autoOpen: false,
    //    height: 'auto',
    //    width: 400,
    //    modal: true,
    //    show: "drop",
    //    hide: "drop",
    //    closeOnEscape: false,
    //    resizable: false,
    //    open: function () {
    //    }
    //});
    changeProductOp.loadProductType();
});

var productTypeOp = {
    allsort: "",
    unsort: "",
    tempindex: -1,
    loadProductType: function () {
        productTypeOp.parseData(data);
        var val = productTypeOp.getValue();
        $("#productTypeDiv a").removeClass('select');
        //if (val == '') {
        //	$("#a_"+tenantID_server+"-0").addClass('select');
        //}else{
        //	if($("#a_"+val).length==0){
        //		productTypeOp.setValue("");
        //		$("#a_"+tenantID_server+"-0").addClass('select');
        //	}else{
        //		$("#a_"+val).addClass('select');
        //	}
        //}
    },
    parseData: function (data) {
        //	data = eval('(' + data + ')');
        var html = productTypeOp.createContent('-1', data);
        $("#productTypeDiv").empty();
        $("#productTypeDiv").append(html);
        $("#editProductType").data('isEdit', false);
        productTypeOp.bindEvent();
    },
    createContent: function (parentids, json) {
        var ht = $('<ul>');
        if (parentids.split(",").length > 1) {
            // ht.hide();
        }
        for (var i = 0; i < json.length; i++) {
            var obj = json[i];
            if (obj.createTime == 0) {
                productTypeOp.allsort = obj.name;
            } else if (obj.createTime == 1) {
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
    add: function (id, pid) {
        $("#sibProductType,#chiProductType").removeAttr('disabled');
        if (id == (tenantID_server + "-0")) {
            $("#sibProductType").attr('disabled', 'disabled');
            $("#chiProductType").attr('checked', 'checked');
        } else if (id == (tenantID_server + "-1")) {
            $("#sibProductType").attr('checked', 'checked');
            $("#chiProductType").attr('disabled', 'disabled');
        } else {
            $("#chiProductType").attr('checked', 'checked');
        }
        $("#productTypeName").val('');
        $("#prodcutTypeSelectID").val(id);
        $("#prodcutTypeSelectPID").val(pid);
        $("#dialog-form-newProductType").dialog("open");

    },
    tempAdd: function () {
        var prodcutTypeSelectID = $("#prodcutTypeSelectID").val();
        var prodcutTypeSelectPID = $("#prodcutTypeSelectPID").val();
        var productTypeName = $("#productTypeName").val();
        var tempCreateTime = new Date().getTime();
        var tempid = 'temp-' + new Date().getTime();
        if ($("#createProductTypeForm :radio[name='productTypeDir']:checked").val() == 1) {//下级
            var pid = prodcutTypeSelectPID + "," + prodcutTypeSelectID;
            if (prodcutTypeSelectPID == -1) {
                pid = prodcutTypeSelectID;
            }
            var newLi = productTypeOp.createContentLi({
                ID: tempid,
                name: productTypeName,
                parentids: pid,
                createTime: tempCreateTime,
                tempID: tempid
            });
            if ($("#li_" + prodcutTypeSelectID + " > ul").length > 0) {
                $("#li_" + prodcutTypeSelectID + " > ul").append(newLi);
            } else {
                $("#li_" + prodcutTypeSelectID).append(($('<ul>').append(newLi)));
            }
        } else {
            var newLi = productTypeOp.createContentLi({
                ID: tempid,
                name: productTypeName,
                parentids: prodcutTypeSelectPID,
                createTime: tempCreateTime,
                tempID: tempid
            });
            $("#li_" + prodcutTypeSelectID).parent().append(newLi);
        }
        productTypeOp.bindEvent();
        $("#dialog-form-newProductType").dialog('close');
    },
    save: function () {
//		$('#createProductTypeForm').ajaxForm(function(data){
//			console.info(data);
//		});
    },
    del: function (id) {
        jConfirm('删除分类后，分类下产品将会被移至“' + productTypeOp.unsort + '”下。\r\n确定删除吗？', '提示框', function (flag) {
            if (flag) {
                $.post(contextPath + "/product_ajaxDeleteProductType.yk?id=" + id, function (data) {

                });
            }
        });
    },
    hideVisibleBtn: function () {
        $("#productTypeDiv input[id^='addbtn_']:visible").hide();
        $("#productTypeDiv input[id^='delbtn_']:visible").hide();
    }, bindEvent: function () {
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
    },
    createContentLi: function (obj) {
        productTypeOp.tempindex++;
        var li = $('<li id="li_' + obj.ID + '" ></li>');
        var name = $('<a data="' + obj.name + '" parentids="' + obj.parentids + '" id="a_' + obj.ID + '">' + obj.name + '</a>');
        var em = $('<em id="em_' + obj.ID + '" class="off"></em>');
        var newName = $('<input  type="text" id="newname_' + obj.ID + '" name="cptList[' + productTypeOp.tempindex + '].name" value="' + obj.name + '" >').hide();
        var oldName = $('<input type="hidden" name="cptList[' + productTypeOp.tempindex + '].oldName" value="' + obj.name + '" >');
        var $id = $('<input type="hidden" name="cptList[' + productTypeOp.tempindex + '].ID" value="' + obj.ID + '" >');
        var $createTime = $('<input type="hidden" name="cptList[' + productTypeOp.tempindex + '].createTime" value="' + obj.createTime + '" >');
        var $parentids = $('<input type="hidden" style="width:100px" name="cptList[' + productTypeOp.tempindex + '].parentids" value="' + obj.parentids + '" >');
        var $addBtn = $('<input type="button" style="display:none" value="添加" id="addbtn_' + obj.ID + '" onclick="productTypeOp.add(\'' + obj.ID + '\',\'' + obj.parentids + '\')">');
        var $delBtn = $('<input type="button" style="display:none" value="删除" id="delbtn_' + obj.ID + '" onclick="productTypeOp.del(\'' + obj.ID + '\')">');
        if (obj.createTime == 1 || obj.createTime == 0) {
            $delBtn.attr('disabled', 'disabled');
        }
        name.click(function () {
            var id = this.id.split("_")[1];
            if ($("#editProductType").data('isEdit')) {
                productTypeOp.hideVisibleBtn();
                $("#newname_" + id + ",#addbtn_" + id + ",#delbtn_" + id).show();
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
            $("#a_" + id).text($(this).val()).show();
            $(this).hide();
        });
        var $div = $('<div style="display:inline-flex">').append(em).append(name).append(oldName).append($id).append($createTime).append($parentids).append(newName).append($addBtn).append($delBtn);
        if (obj.tempID) {
            $div.append($('<input type="hidden" name="cptList[' + productTypeOp.tempindex + '].tempID" value="' + obj.ID + '" >'));
        }
        return li.append($div);
    }, setValue: function (id) {
        //init();
        //setValue('productType-cache-'+suserid,id);
    }, getValue: function () {
        return '';
        //init();
        //if ($("#productTypeDiv a.select").length==1) {
        //	return $("#productTypeDiv a.select").attr('id').split("_")[1];
        //}
        //var val = getValue('productType-cache-'+suserid);
        //if ($('#a_'+val).length==0) {
        //	return '';
        //}
        //return val==(tenantID_server+"-0")?'':val;
    }

}

var changeProductOp = {
    loadProductType: function () {
        changeProductOp.parseData(data);
        var val = productTypeOp.getValue();
        $("#productTypeDiv a").removeClass('select');
        //if (val == '') {
        //	$("#a_"+tenantID_server+"-0").addClass('select');
        //}else{
        //	if($("#a_"+val).length==0){
        //		productTypeOp.setValue("");
        //		$("#a_"+tenantID_server+"-0").addClass('select');
        //	}else{
        //		$("#a_"+val).addClass('select');
        //	}
        //}
    }, parseData: function (data) {
        var html = changeProductOp.createContent('-1', data);
        $("#changeProductTypeDiv").empty();
        $("#changeProductTypeDiv").append(html);
        changeProductOp.bindEvent();
    },
    createContent: function (parentids, json) {
        var ht = $('<ul>');
        if (parentids.split(",").length > 1) {
            // ht.hide();
        }
        for (var i = 0; i < json.length; i++) {
            var obj = json[i];
            if (obj.parentids == parentids) {
                var li = changeProductOp.createContentLi(obj)
                ht.append(li);
                if (obj.parentids == -1) {
                    li.append(changeProductOp.createContent(obj.ID, json));
                } else {
                    li.append(changeProductOp.createContent(obj.parentids + "," + obj.ID, json));
                }
            }
        }
        return ht;
    }, createContentLi: function (obj) {
        var li = $('<li id="change_li_' + obj.ID + '" ></li>');
        var name = $('<label data="' + obj.name + '" for="ck_' + obj.ID + '"  parentids="' + obj.parentids + '" id="label_' + obj.ID + '">' + obj.name + '</a>');
        var checkbox = $('<input type="checkbox" name="changeProductType" id="ck_' + obj.ID + '">');
        var em = $('<em id="change_em_' + obj.ID + '" class="off"></em>');
        var $id = $('<input type="hidden" value="' + obj.ID + '" >');
        var $parentids = $('<input type="hidden" style="width:100px" value="' + obj.parentids + '" >');
        checkbox.change(function () {
            if ($(this).is(':checked')) {

            } else {

            }
        });
        var $div = $('<div style="display:inline-flex">').append(em).append(checkbox).append(name).append($id).append($parentids);
        if (obj.tempID) {
            $div.append($('<input type="hidden" name="cptList[' + productTypeOp.tempindex + '].tempID" value="' + obj.ID + '" >'));
        }
        return li.append($div);
    }, bindEvent: function () {
        $("#changeProductTypeDiv li").each(function () {
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

        $("#changeProductTypeDiv em").unbind('click');
        $("#changeProductTypeDiv em").each(function () {
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

        $("#changeProductTypeDiv input[type='checkbox']").unbind('change');
        $("#changeProductTypeDiv input[type='checkbox']").each(function () {
            $(this).change(function () {
                var id = this.id.split('_')[1];
                var all = $('#change_li_'+id).find('input[type="checkbox"]');
                var isparent = all.length>2?true:false;
                if($(this).is(":checked")){
                    $('#change_li_'+id).find('input[type="checkbox"]').attr('checked','checked');
                    console.info('true');
                }else{
                    console.info('false');
                }
            });
        });
    },
}


