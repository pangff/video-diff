module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "standard",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8,
        "ecmaFeatures": {
          "classes": true
        }
    },
    "plugins": [
      "dependencies"
    ],
    "rules": {
      "dependencies/case-sensitive": 1,
        "dependencies/no-cycles": 1,
        "dependencies/no-unresolved": 1,
        "dependencies/require-json-ext": 1,
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [
            "error", { allow: ["warn", "error"] }
        ]
    }
};
