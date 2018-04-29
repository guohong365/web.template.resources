(function ($){
	var uc={
		utils: {
			cotainsZero:function(val){
				if(val && typeof val==='string'){
					var items=val.split(',');
					for(var i=0; i<items.length; i++){
						if(items[i]==="0") return true;
					}
				}
				return false;
			},
			notice : function(title, msg, noticeClass){
				$.gritter.add({
					title: title,
					text:msg,
					class_name:noticeClass
					});
			}
		}	
	};
	$.extend(uc);
	
}(window.jQuery));