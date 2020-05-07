module.exports = {
    root: true,
    env: {
        node: true,
        browser: true
    },
    extends: ["plugin:vue/essential", "@vue/standard"],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "indent": "off",
        "quotes": "off",
        "semi": "off",
        "no-new": "off",
        "no-unused-vars": "off",
        "spaced-comment": 0,
        "comma-spacing": 0,
        "key-spacing": 0,
        "object-curly-spacing": 0,
        "no-tabs": "off",
        "no-mixed-spaces-and-tabs": "off",
        "x-invalid-end-tag": "off",
        "vue/no-parsing-error": [2, {"x-invalid-end-tag": false}]
    },
    parserOptions: {
        parser: "babel-eslint"
    }
};
