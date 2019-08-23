
const messageSchema = new mongoose.Schema({
  name:String,
  email: String,
  message: String
});

module.exports = mongoose.model('Message',messageSchema);
