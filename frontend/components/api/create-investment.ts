import { Investment } from "@/app/invest/page";
import axios from "axios";

export async function createInvestment(investmentData: Investment) {
  try {
    const response = await axios.post(
      "https://stock-advisor.onrender.com/investment/create/",
      investmentData
    );

    // const suggestion = await axios.post()

    if (response.status >= 200 && response.status < 300) {
      console.log("Investment created successfully:", response.data);
      return response.data; // Return the generated plan
    } else {
      console.error("Failed to create investment plan.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
