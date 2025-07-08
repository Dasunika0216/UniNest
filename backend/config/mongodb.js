import mongoose from 'mongoose';

const connectToDatabase = async () => {
    mongoose.connection.on('connected', () => {
        console.log('DB connected'); 
    })

    await mongoose.connect(`${process.env.DB_URI}/UniNest`);
}

export default connectToDatabase;

