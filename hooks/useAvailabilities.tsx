import axios from "axios";
import { useState } from "react";

export default function useAvalabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<
    { time: string; available: boolean }[] | null
  >(null);

  const fetchAvailabilities = async ({
    slug,
    partySize,
    day,
    time,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
  }) => {
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/api/restaurant`, {
        params: {
          day,
          time,
          partySize,
        },
      });
      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.data.response.errorMessage);
    }
  };
  return { loading, data, error, fetchAvailabilities };
}
