import mongoose from "mongoose";
const connString = "mongodb+srv://lawrencelollx:cs386@fullstackwebdev.rntounz.mongodb.net/?retryWrites=true&w=majority&appName=fullstackwebdev";
mongoose.connect(connString)
	.then( //Callback functions
		function() { //Success
			let conn = mongoose.connection;
			console.log(`Database is connected: ${conn.host}:${conn.port} @ ${conn.name}`);
			mongoose.connection.close()
			.then( //Callback functions
				function() { //Success
					console.log('MongoDB connection closed');
				}, function(err) { //Error
					console.log("Problem while closing database " + err);
				}
			)	
		},
		function(err) { //Error
			console.log("Problem while connecting database " + err);
		}
	)