// export const validatePassword = (password) => {
//   const schema = new passwordValidator();
//   schema
//     .is()
//     .min(8, "Password must be a minium of 8 characters long")
//     .is()
//     .max(100, "Password cannot be longer than 100 characters")
//     .has()
//     .lowercase(1, "Password must have at least 1 lowercase character")
//     .has()
//     .uppercase(1, "Password must have at least 1 uppercase character")
//     .has()
//     .digits(1, "Password must have at least 1 number")
//     .has()
//     .not()
//     .spaces(0, "Password cannot have spaces");
//   const check = schema.validate(password, { details: true });
//   const error = check.length > 0;
//   const errorMessage = check.length > 0 ? check[0].message : null;
//   return [error, errorMessage];
// };
