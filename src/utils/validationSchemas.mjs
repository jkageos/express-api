export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 1,
        max: 32,
      },
      errorMessage:
        "Username must be at least 1 character with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  email: {
    isEmail: {
      errorMessage: "Must be a valid email address",
    },
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
  },
};
