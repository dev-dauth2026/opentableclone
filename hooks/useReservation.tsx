import axios from "axios";
import { useState } from "react";

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    partySize,
    day,
    time,
    bookerFirstName,
    bookerLastname,
    bookerPhone,
    bookerEmail,
    bookerOcassion,
    bookerRequest,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
    bookerFirstName: string;
    bookerLastname: string;
    bookerPhone: string;
    bookerEmail: string;
    bookerOcassion: string;
    bookerRequest: string;
  }) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/restaurant/${slug}/reserve`,
        {
          bookerFirstName,
          bookerLastname,
          bookerPhone,
          bookerEmail,
          bookerOcassion,
          bookerRequest,
        },
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      setError(error.data.response.errorMessage);
    }
  };
  return { loading, error, createReservation };
}
