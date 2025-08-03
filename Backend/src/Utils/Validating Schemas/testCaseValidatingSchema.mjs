export const testCaseValidatingSchema = {

  "testCases": {
    in: ["body"],
    isArray: {
      errorMessage: "testCases must be an array"
    },
    notEmpty: {
      errorMessage: "Provide at least one test-case"
    }
  },

  "testCases.*.input": {
    isString: {
      errorMessage: "Each input must be a string"
    },
    notEmpty: {
      errorMessage: "Input is required"
    }
  },

  "testCases.*.output": {
    isString: {
      errorMessage: "Each output must be a string"
    },
    notEmpty: {
      errorMessage: "Output is required"
    }
  }

};
