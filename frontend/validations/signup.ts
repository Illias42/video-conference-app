import * as Yup from "yup";

export default Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .max(24, "Name must be at most 24 characters"),
  email: Yup.string()
    .email("Email is not valid")
    .required("Email is required")
    .max(24, "Email must be at most 24 characters"),
  password: Yup.string()
    .required("Password have to be from 6 to 16 characters")
    .min(6, "Password must be at least 6 characters")
    .max(24, "Password must be at most 24 characters"),
});
