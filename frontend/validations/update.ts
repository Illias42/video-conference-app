import * as Yup from "yup";

export default Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .max(24, "Name must be at most 24 characters"),
  tag: Yup.string()
    .required("Tag is required")
    .min(5, "Tag must be at least 5 characters")
    .max(24, "Tag must be at most 24 characters"),
  email: Yup.string()
    .email("Email is not valid")
    .required("Email is required")
    .max(24, "Email must be at most 24 characters"),
  password: Yup.string()
    .required("Password have to be from 6 to 16 characters")
    .min(6, "Password must be at least 6 characters")
    .max(24, "Password must be at most 24 characters"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(24, "Password must be at most 24 characters"),
});
