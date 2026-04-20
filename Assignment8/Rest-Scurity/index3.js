import mongoose from 'mongoose'
mongoose.connect("mongodb://127.0.0.1:27017/activityDB");
const userSchema = new mongoose.Schema({
    username: String,
    loginTime: Date,
    logoutTime: Date,
    lastActive: Date
});
userSchema.pre("save", function(next) {
    this.lastActive = new Date();
    next();
});

const User = mongoose.model("User", userSchema);
const loginUser = async () => {
    const user = new User({
        username: "Sarthak",
        loginTime: new Date()
    });

    await user.save();
    console.log("User logged in");
};

const logoutUser = async (id) => {
    await User.findByIdAndUpdate(
        id,
        {
            logoutTime: new Date(),
            lastActive: new Date()
        }
    );
    console.log("User logged out");
};
loginUser();