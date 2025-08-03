import { Problem } from "../../Models/Problem.mjs";

export const problemValidatingSchema = {

    problemNumber: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Problem number is required",
        },
        isInt: {
            errorMessage: "Problem number must be an integer",
        },
        custom: {
            options: async (value) => {
                const exists = await Problem.findOne({ problemNumber: value });
                if (exists) {
                    throw new Error("Problem number already exists");
                }
                return true;
            },
        },
        toInt: true,
    },

    title: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Title is required",
        },
        isString: {
            errorMessage: "Title must be a string",
        },
        custom: {
            options: async (value) => {
                const exists = await Problem.findOne({ title: value });

                if (exists) {
                    throw new Error("Problem title already exists");
                }

                return true;
            },
        },
    },

    statement: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Statement is required",
        },
        isString: {
            errorMessage: "Statement must be a string",
        },
    },

    examples: {
        in: ['body'],
        isArray: {
            errorMessage: "Examples must be an array",
        },
    },

    "examples.*.input": {
        in: ['body'],
        isString: {
            errorMessage: "Each example input must be a string",
        },
    },

    "examples.*.output": {
        in: ['body'],
        isString: {
            errorMessage: "Each example output must be a string",
        },
    },

    "examples.*.explanation": {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: "Each explanation must be a string",
        },
    },

    constraints: {
        in: ['body'],
        notEmpty: {
            errorMessage: "Constraints are required",
        },
        isString: {
            errorMessage: "Constraints must be a string",
        },
    },
};