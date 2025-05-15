import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`Database is connected: ${conn.host}:${conn.port} @ ${conn.name}`);

	}
	catch (error) {

	}
};
// mongoose.connect(connString)
// 	.then( //Callback functions
// 		function() { //Success
// 			let conn = mongoose.connection;
// 			console.log(`Database is connected: ${conn.host}:${conn.port} @ ${conn.name}`);
// 			mongoose.connection.close()
// 			.then( //Callback functions
// 				function() { //Success
// 					console.log('MongoDB connection closed');
// 				}, function(err) { //Error
// 					console.log("Problem while closing database " + err);
// 				}
// 			)	
// 		},
// 		function(err) { //Error
// 			console.log("Problem while connecting database " + err);
// 			process.exit(1); //1 failure, 0 success
// 		}
// 	)