const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	
	category: {
	    type: Schema.Types.ObjectId,
	    ref: 'categories' // table name
	},

	comments: [{
	    type: Schema.Types.ObjectId,
	    ref: 'comments'
	}],

	title:{
		type: String,
		required: true
	},

	status:{
	    type: String,
	    default: 'public'
	},

	allowComments:{
	    type: Boolean,
	    required: true
	},

	body:{
	    type: String,
	    required: true
	},

	file:{
	    type: String,
	},

	date: {
	    type: Date,
	    default: Date.now()
	}

}
// {usePushEach: true} // must use comma(,) before it........
);

module.exports = mongoose.model('posts', PostSchema);