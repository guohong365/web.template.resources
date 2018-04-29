
/**
 * 选中的输入组件中至少输入n个字段
 * 
 * 参数：数组 [n数字, jQuery选择器]
 * 下面示例表示part1和part2两个字段至少输入一个。
 * part1: {fill_minimum: [1,".selector"]}, 
 * part2: {fill_minimum: [1,".selector"]}
 *      
 */
jQuery.validator.addMethod("fill_minimum", function(value, element, options) {
	var $fields = $(options[1], element.form);
	var validator = $.extend({}, this);
	var numberFilled = $fields.filter(function() {
		return validator.elementValue(this);
	}).length;
	var isValid = numberFilled >= options[0];
	// If element isn't being validated, run each skip_or_fill_minimum field's validation rules
	if (!$(element).data("being_validated")) {
		$fields.data("being_validated", true);
		$fields.each(function() {
			validator.element(this);
		});
		$fields.data("being_validated", false);
	}
	return isValid;
}, jQuery.validator.format("至少输入 {0} 项."));


/**
 * 使用自定义函数验证输入数据
 * 
 * 参数：函数（控件，值） 
 *      
 */
jQuery.validator.addMethod(
	"multiValid",
	function(value, element, options) {
		console.log('multiValid called.....')
		if(this.optional(element) && !value){
			return true;
		}
		if(options instanceof Array){
			for(var i=0; i<options.length; i++){
				if(options[i] instanceof Array && options[i].length > 0){
					if(typeof options[i][0]==='function'){
						if(!options[i][0](options[i][1],element, value)){
							return false;
						}
					} else {
						console.log('parameter item Array[0] must be function');
						return false;
					}
				} else {
					console.log('parameter item must be array with length > 0');
					return false;
				}
			}
			return true;
		}
		console.log('parameter error!');
		return false;
	},
	"条件不满足。"
);

function NumberCompare(option){
	console.log('NumberCompare called.....');
	if(option instanceof Array && option.length >=3){
		var e1=option[0];
		console.log('param item element 1=' + e1);
		var e2=option[1];
		console.log('param item element 2=' + e2);
		var opt=option[2];
		console.log('param item operator=' + opt);
		var n1=Number($(e1).val());
		console.log('fist value=' + n1);
		var n2=Number($(e2).val());
		console.log('second value=' + n2)
		if(isNaN(n1)){
			return false;
		}
		if(isNaN(n2)){
			return true;
		}
		switch(opt){
		case 'lt':
			return n1 < n2;
		case 'le':
			return n1 <= n2;
		case 'eq':
			return n1 == n2;
		case 'gt':
			return n1 > n2;
		case 'ge':
			return n1 >= n2;
		default: 
			return false; //error operator option
		}
	}
	console.log('param must be array with length >=3');
	return false;
}
