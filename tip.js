/**
 * Created by ShrimpTang on 2015/9/12.
 */
$.fn.myTip = function (options) {
    var defaluts = {
        text: '',
        isTop: false,
        hasCloseBtn:true,
        closeBtnIsRight:true,
        autoClose:true,
        autoCloseTime:5000,
        triangle:'left'
    }
    var setting = $.extend({}, defaluts, options);
    var tip = $('<div></div>');
    var tipText = $('<div></div>');
    var top = this.offset().top;
    var img = $('<img src="u2782.png">');
    if (setting.isTop) {
        top = top - this.height()-30;
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

    var closebtn = $('<img src="cross30.png" style="width: 11px;cursor: pointer"/>');

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
    //if(setting.autoClose){
    //    setTimeout(function () {
    //        tip.remove();
    //    },setting.autoCloseTime)
    //}

    $('body').append(tip);
    if(setting.triangle=='left'){
        img.css('left', this.offset().left+5);
    }else{
        img.css('left', this.offset().left+tip.width()-20);
    }
    if(setting.isTop){
        img.css('top',top+tip.outerHeight()-1);
        img.attr('src','u2783.png');
    }else{
        img.css('top',top-11);
    }
    $('body').append(img);

}