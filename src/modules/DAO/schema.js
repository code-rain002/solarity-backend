import * as yup from "yup";

export const getDaosSchema = yup.object({
  query: yup.object({
    member: yup.boolean().typeError("Member must be a boolean"),
    term: yup.string().typeError("term must be a string"),
  }),
});

export const addDaoSchema = yup.object({
  body: yup.object({
    symbol: yup
      .string()
      .typeError("Coin symbol must be a string")
      .required("Coin symbol is required"),
  }),
});

export const removeDaoSchema = yup.object({
  params: yup.object({
    symbol: yup
      .string()
      .typeError("Coin symbol must be a string")
      .required("Coin symbol is required"),
  }),
});

export const getDaoSchema = yup.object({
  params: yup.object({
    address: yup.string().required("The id is required"),
  }),
  query: yup.object({
    includeDao: yup.boolean().typeError("includeDao must be true/false"),
  }),
});
