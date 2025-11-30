const mongoose = require("mongoose");

const uri = "mongodb+srv://jashwanth45454_db_user:p7Lq9Yqw73KRcU7i@cluster7.thdfixf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster7";

mongoose.connect(uri).then(async () => {
  const dbs = await mongoose.connection.db.admin().listDatabases();
  console.log(dbs);
  process.exit();
});
app.get("/check-collections", async (req, res) => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections);
    res.json(collections);
  });