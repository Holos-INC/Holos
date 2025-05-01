import axios from "axios";
import { API_URL, BASE_URL } from "../constants/api";
import api from "./axiosInstance";

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

export const createSetupIntent = async (
  commissionId : number,
  token : string
) => {
  const res = await axios.post(
    `${API_URL}/payment/setup-intent/${commissionId}`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const payCommissionFromSetupIntent = async (
  commissionId: number,
  token: string
) => {
  const res = await axios.post(
    `${API_URL}/payment/payment-from-setup/${commissionId}`,
    null,
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
  const res = await axios.post(`${API_URL}/stripe-subscription/create`, null, {
    params: { paymentMethod: paymentMethodId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const cancelSubscription = async (token: string) => {
  const res = await axios.post(`${API_URL}/stripe-subscription/delete`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
