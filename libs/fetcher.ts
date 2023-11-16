import axios from "axios";
export const fetcherGet: <Resp>(
  url: string
) => Promise<Resp> | Promise<any> = async (url: string) => {
  try {
    const fetchData = await axios.get(url);
    return fetchData.data;
  } catch (error) {
    throw error;
  }
};
