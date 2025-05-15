const mongoose = require('mongoose');
let schemaPool = mongoose.Schema ({
	side: {
		type: Array,
		required: true,
		// index: {unique: true}
	},
	main: {
		type: Array,
		required: true,
		// default: 'unknown'
	},
	preReqs: {
		type: Array,
		required: true,
		default: ['unknown']
	},
	active: {
		type: Boolean,
		required: true,
		default: true
	},
})

module.exports = mongoose.model('CSCourse', schemaCourses);//Create and export model
