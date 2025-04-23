import axios from "axios";
import { API_URL, BASE_URL } from "../constants/api";
import api from "./axiosInstance";

export type PaymentDTO = {
  amount: number;
  description: string;
};

export const createStripeAccount = async (token: string) => {
  const res = await axios.post("/stripe-account/create", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getStripeAccountLink = async () => {
  const res = await api.get("/stripe-account/create-link");
  return res.data as string;
};

export const createPaymentIntent = async (
  paymentDTO: PaymentDTO,
  commissionId: number,
  token: string
) => {
  console.log(paymentDTO);
  const res = await axios.post(
    `${API_URL}/payment/create/${commissionId}`,
    paymentDTO,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const createSubscription = async (
  paymentMethodId: string,
  token: string
) => {
  const res = await axios.post(`${API_URL}/stripe-subsciption/create`, null, {
    params: { paymentMethod: paymentMethodId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const cancelSubscription = async (token: string) => {
  const res = await axios.post(`${API_URL}/stripe-subsciption/delete`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
