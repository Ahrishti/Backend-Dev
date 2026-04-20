import express from 'express'
import session from 'express-session'
const app = express();
app.use(express.json());

app.use(session({
    secret: 'cart-secret',
    resave: false,
    saveUninitialized: false
}));

const initCart = (req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
};

app.use('/cart', initCart);

app.post('/cart/add', (req, res) => {
    const { productId, name, price, quantity } = req.body;
    if (!productId || !name || !price || !quantity) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    const existingItem = req.session.cart.find(
        item => item.productId === productId
    );
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        req.session.cart.push({
            productId,
            name,
            price,
            quantity
        });
    }
    res.json({
        message: "Item added to cart",
        cart: req.session.cart
    });
});


app.put('/cart/update/:productId', (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const item = req.session.cart.find(
        item => item.productId === productId
    );
    if (!item) {
        return res.status(404).json({
            message: "Item not found"
        });
    }
    item.quantity = quantity;
    res.json({
        message: "Item quantity updated",
        cart: req.session.cart
    });
});


app.delete('/cart/remove/:productId', (req, res) => {
    const { productId } = req.params;
    req.session.cart = req.session.cart.filter(
        item => item.productId !== productId
    );
    res.json({
        message: "Item removed from cart",
        cart: req.session.cart
    });
});


app.get('/cart', (req, res) => {
    const total = req.session.cart.reduce(
        (sum, item) =>
            sum + (item.price * item.quantity),
        0
    );
    res.json({
        cart: req.session.cart,
        totalPrice: total
    });

});

app.delete('/cart/clear', (req, res) => {
    req.session.cart = [];
    res.json({
        message: "Cart cleared"
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});