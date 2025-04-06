import axios from "axios";

export interface Stock {
  symbol: string;
  lastPrice: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
}

export async function fetchTop10Stocks(): Promise<Record<string, Stock>> {
  try {
    const response = await axios.get("http://127.0.0.1:8000/stocks/api/top10/");
    console.log(response.data);
    return response.data.data; // returns stock_data object
  } catch (error) {
    console.error("Error fetching top 10 stocks:", error);
    throw error;
  }
}
