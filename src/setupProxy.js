const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    //GET USERS
    app.use(
        '/all-users',
        createProxyMiddleware({
            target: 'https://getappusers-zazjbx7nka-uc.a.run.app',
            changeOrigin: true,
        })
    );

    app.use(
        '/get-user',
        createProxyMiddleware({
            target: 'https://getappuser-zazjbx7nka-uc.a.run.app/',
            changeOrigin: true,
        })
    );

    //ADD USER
    app.use(
        '/add-user',
        createProxyMiddleware({
            target: 'https://addappuser-zazjbx7nka-uc.a.run.app/',
            changeOrigin: true,
        })
    );

    //LOGIN USER
    app.use(
        '/login',
        createProxyMiddleware({
            target: 'https://login-zazjbx7nka-uc.a.run.app/',
            changeOrigin: true,
        })
    )

    //GET RECIPES
    app.use(
        '/get-recipes',
        createProxyMiddleware({
            target: 'https://getrecipes-zazjbx7nka-uc.a.run.app/',
            changeOrigin: true,
        })
    )

    //GET ALL RECIPES
    app.use(
        '/get-recipe',
        createProxyMiddleware({
            target: 'https://getrecipe-zazjbx7nka-uc.a.run.app/',
            changeOrigin: true,
        })
    )

    //CREATE A RECIPE
    app.use(
        '/add-recipe',
        createProxyMiddleware({
            target: 'https://addrecipe-zazjbx7nka-uc.a.run.app/',
            changeOrigin: true,
        })
    )

    //EDIT RECIPE
    app.use(
        '/edit-recipe',
        createProxyMiddleware({
            target: 'https://editrecipe-zazjbx7nka-uc.a.run.app/',
            changeOrigin: true,
        })
    )

    //DELETE RECIPE
    app.use(
        '/delete-recipe',
        createProxyMiddleware({
            target: 'https://deleterecipe-zazjbx7nka-uc.a.run.app/',
            changeOrigin: true,
        })
    )
};