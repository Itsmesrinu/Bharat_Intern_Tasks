const mongoose = require("mongoose");

const Blog_Contact_Msg_Info_Scehma = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    subject: String,
    message : String,
  },
  {
    collection: "Blog_Contact_Msg_Info",
  }
);

mongoose.model("Blog_Contact_Msg_Info", Blog_Contact_Msg_Info_Scehma);
