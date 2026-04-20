import mongoose from 'mongoose'
mongoose.connect("mongodb://127.0.0.1:27017/softDeleteDB");
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    deleted: {
        type: Boolean,
        default: false
    }
});
postSchema.pre(/^find/, function(next) {
    this.where({ deleted: false });
    next();
});

const Post = mongoose.model("Post", postSchema);
const softDelete = async (id) => {
    await Post.findByIdAndUpdate(id, {
        deleted: true
    });

    console.log("Post soft deleted");
};
const getPosts = async () => {
    const posts = await Post.find();
    console.log(posts);
};