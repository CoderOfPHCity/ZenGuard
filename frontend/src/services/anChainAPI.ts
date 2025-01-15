
import axios from 'axios';
import { API_BASE_URL, API_KEY } from '@/config/api.config';

interface RiskScoreResponse {
  status: number;
  err_msg: string;
  data: {
    [key: string]: {
      is_address_valid: boolean;
      risk: {
        level: number;
        score: number;
        verdict_time: number;
      };
      self: {
        category: string[];
        detail: string[];
      };
    };
  };
}

class AnChainApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getWalletRiskScore(address: string, protocol: string = 'eth'): Promise<RiskScoreResponse> {
    try {
      const response = await this.api.get<RiskScoreResponse>(
        `/api/address_risk_score?proto=${protocol}&address=${address}&apikey=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.data.err_msg || error.message}`);
      }
      throw error;
    }
  }

  async getWalletActivity(address: string, protocol: string = 'eth') {
    try {
      const response = await this.api.get(
        `/api/address_risk_activity?proto=${protocol}&address=${address}&apikey=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.data.err_msg || error.message}`);
      }
      throw error;
    }
  }

  async getTransactionRisk(txHash: string, protocol: string = 'eth') {
    try {
      const response = await this.api.get(
        `/api/kyt/${protocol}/${txHash}/risk_score?apikey=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.data.err_msg || error.message}`);
      }
      throw error;
    }
  }
}

export const anchainApi = new AnChainApiService();