const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');

const PostSchema = new Schema({
	
	user: {
	    type: Schema.Types.ObjectId,
	    ref:'users'
	},

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

	slug: {
	    type: String
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

PostSchema.plugin(URLSlugs('title', {field: 'slug'}));
module.exports = mongoose.model('posts', PostSchema);