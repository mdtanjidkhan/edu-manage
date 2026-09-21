import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_SERVER_URL);
const db = client.db("edumanage");

export const auth = betterAuth({
   emailAndPassword: { 
    enabled: true, 
  }, 
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student", 
        input: false, 
      },
    },
  },
  database: mongodbAdapter(db, {
   
    client
  }),
  session: {
     cookieCache:{
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7,
     },
  },
  plugins:[
   jwt()
  ],
});