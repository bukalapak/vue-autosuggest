module.exports = {
  env: {
    browser: true
  },
  extends: ["plugin:vue/recommended"],
  plugins: ["vue"],
  rules: {
    "vue/valid-v-if": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "vue/max-attributes-per-line": ["error", {
      "singleline": 3,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "vue/html-self-closing": ["warn", {
      "html": {
        "void": "never",
        "normal": "always",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }]
  }
};
