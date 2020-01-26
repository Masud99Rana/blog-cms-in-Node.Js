module.exports = {
	// select: function(param1){
	// 	console.log(param1);
	// }
	
	select: function(selected, options){
	    // console.log(options.fn(this)); // see inside
	    return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
	},
}