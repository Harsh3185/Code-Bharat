export const submissionValidatingSchema = {

  code: {
    in: ["body"],
    isString: {
      errorMessage: "Code must be a string"
    },
    notEmpty: {
      errorMessage: "Code is required"
    }
  },

  language: {
    in: ["body"],
    isString: {
      errorMessage: "Language must be a string"
    },
    notEmpty: {
      errorMessage: "Language is required"
    }
  }

};
