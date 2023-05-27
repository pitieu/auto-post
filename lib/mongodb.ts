import mongoose from "mongoose";
// mongoose.set('debug', true)
mongoose.set("strictQuery", true);

export let mongooseInstance;

export const initMongoose = async (url?, options?) => {
  mongooseInstance = await mongoose
    .connect(
      url || process.env.DATABASE,
      options || {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((i) => {
      return i;
    });
  return mongooseInstance;
};

export const closeMongoose = async () => {
  await mongoose.connection.close();
};

export const setMongooseInstance = (instance) => {
  mongooseInstance = instance;
};
