export const profileValidatingSchema = {
  firstName: {
    optional: true,
    isString: {
      errorMessage: "First name must be a string"
    },
    trim: true
  },
  lastName: {
    optional: true,
    isString: {
      errorMessage: "Last name must be a string"
    },
    trim: true
  },
  profilePicture: {
    optional: true,
    isURL: {
      errorMessage: "Profile picture must be a valid URL"
    }
  },
  bio: {
    optional: true,
    isString: {
      errorMessage: "Bio must be a string"
    }
  },
  location: {
    optional: true,
    isString: {
      errorMessage: "Location must be a string"
    }
  },
  institution: {
    optional: true,
    isString: {
      errorMessage: "Institution must be a string"
    }
  }
};
