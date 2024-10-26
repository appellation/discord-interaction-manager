import {
	common,
	browser,
	typescript,
	react,
	prettier,
} from "eslint-config-neon";

export default [
	{
		ignores: ["**/dist/*", "node_modules", "eslint.config.js"],
	},
	...common,
	...browser,
	...typescript,
	...react,
	...prettier,
	{
		settings: {
			react: {
				version: "detect",
			},
		},
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
		rules: {
			eqeqeq: [1, "always", { null: "never" }],
			"no-eq-null": 0,
			"react/prop-types": [2, { ignore: ["className"] }],
			"react/react-in-jsx-scope": 0,
			"react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
		},
	},
];
