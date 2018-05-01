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
			},
			noticeError : function(msg){
				$.gritter.add({
					title: '错误',
					text: msg,
					class_name:'gritter-error'
					});
			},
			noticeSuccess : function(msg){
				$.gritter.add({
					title: '成功',
					text: msg,
					class_name:'gritter-success'
					});
			},
			noticeWarning : function(msg){
				$.gritter.add({
					title: '警告',
					text: msg,
					class_name:'gritter-warning'
					});
			}
			
		}	
	};
	$.extend(uc);
	
}(window.jQuery));