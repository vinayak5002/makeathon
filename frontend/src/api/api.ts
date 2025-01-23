import { apiClient } from "./client";

async function sendText2SQLquery(query: string) {
  try {
    const response = await apiClient.get("/text-sql", {
      params: {
        text: query,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function sendSQL2Textquery(query: string) {
  try {
    const response = await apiClient.get("/sql-text", {
      params: {
        query: query,
      },
    });
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

async function executeQuery(query: string) {
  try {
    const response = await apiClient.get("/execute-query", {
      params: {
        query: query,
      }
    });
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export default {
  sendText2SQLquery,
  sendSQL2Textquery,
  executeQuery
}