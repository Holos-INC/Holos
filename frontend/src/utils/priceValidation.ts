import * as yup from "yup";

export const priceValidationSchema = yup.object().shape({
  newPrice: yup
    .string()
    .required("El precio es obligatorio")
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "El precio debe ser un número con hasta 2 decimales"
    ),
});
