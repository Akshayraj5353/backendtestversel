const mongoose =require("mongoose");


const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongodb database connected :",
        connect.connection.host,
        connect.connection.name
        );

    }catch(error){
       console.log(`unable to establish connection to database ${error.message}`);
       process.exit(1); 
    }
}

module.exports = connectDb;