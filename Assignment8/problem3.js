import express from 'exoress'
import session from 'express-session'

const app = express();
app.use(express.json());

app.use(session({
    secret: 'auth-secret',
    resave: false,
    saveUninitialized: false
}));

const users = [
    { id: 1, username: "user1", role: "user" },
    { id: 2, username: "mod1", role: "moderator" },
    { id: 3, username: "admin1", role: "admin" }
];

const posts = [];
const isAuthenticated = (req, res, next) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Unauthorized: Please login first"
        });
    }

    next();
};


const requireRole = (role) => {

    return (req, res, next) => {

        const userRole = req.session.user.role;
        if (userRole === "admin") {
            return next();
        }
        if (userRole !== role) {
            return res.status(403).json({
                message: "Forbidden: Insufficient permissions"
            });
        }

        next();
    };
};

const isOwnerOrModerator = (req, res, next) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }
    const user = req.session.user;
    if (post.userId === user.id) {
        return next();
    }
    if (user.role === "moderator" || user.role === "admin") {
        return next();
    }
    return res.status(403).json({
        message: "Forbidden: Not allowed to modify this post"
    });
};


app.post('/login', (req, res) => {
    const { username } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    req.session.user = user;
    res.json({
        message: "Login successful",
        user
    });
});


app.post('/posts', isAuthenticated, (req, res) => {
    const { title, content } = req.body;
    const newPost = {
        id: posts.length + 1,
        title,
        content,
        userId: req.session.user.id
    };
    posts.push(newPost);
    res.status(201).json({
        message: "Post created",
        post: newPost
    });
});


app.put(
    '/posts/:id',
    isAuthenticated,
    isOwnerOrModerator,
    (req, res) => {

        const postId = parseInt(req.params.id);

        const post = posts.find(p => p.id === postId);

        const { title, content } = req.body;

        if (title) post.title = title;
        if (content) post.content = content;

        res.json({
            message: "Post updated",
            post
        });
    }
);


app.delete(
    '/posts/:id',
    isAuthenticated,
    requireRole('moderator'),
    (req, res) => {

        const postId = parseInt(req.params.id);

        const index = posts.findIndex(
            p => p.id === postId
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        posts.splice(index, 1);

        res.json({
            message: "Post deleted"
        });
    }
);

app.get(
    '/users',
    isAuthenticated,
    requireRole('admin'),
    (req, res) => {

        res.json(users);
    }
);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});