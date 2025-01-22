import { HistoryRecord } from "../types/types";
import { apiClient } from "./client";

async function searchSnips(query: string) {
  try {
    const response = await apiClient.get("/search-snips", {
      params: {
        query: query,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getSavedSnips() {
  try {
    const response = await apiClient.get("/saved-snips");
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function reindexDocuments() {
  try {
    const response = await apiClient.get("/re-index");
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getSavedRepos() {
  try {
    const response = await apiClient.get("/saved-repos");
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getCurrentRepo() {
  try {
    const response = await apiClient.get("/current-repo");
    console.log("API: Current repo: ", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function setCurrentRepo(newRepoPath: string) {
  try {
    console.log("Setting current repo path: ", newRepoPath);
    const response = await apiClient.post("/current-repo", {
      newRepoPath,
    });
    return response.data;
  } catch (error) {
    console.log("Error setting current repo path: ", error);
    throw error;
  }
}

async function checkRepoPath(repoPath: string) {
  try {
    console.log("Checking path: ", repoPath);
    const response = await apiClient.get("/check-repo-path", {
      params: {
        repoPath: repoPath,
      },
    });
    console.log("response.data: ", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function addRepoPath(repoPath: string) {
  try {
    const response = await apiClient.post("/add-repo", {
      repoPath: repoPath,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getFileContent(filePath: string) {
  try {
    const response = await apiClient.get('/get-file/', {
      params: {
        filePath: filePath
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function deleteRepo(repoPath: string) {
  try {
    const response = await apiClient.delete("/delete-repo", {
      params: {
        repoPath: repoPath,
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function fetchHistory(): Promise<HistoryRecord[]>{
  try {
    const response = await apiClient.get("/history");

    const historyList: HistoryRecord[] = response.data.map((record: any) => {
      return {
        query: record.query,
        timeStamp: new Date(record.timeStamp)
      }
    });
    
    return historyList;
  } catch (error) {
    throw error;
  }
}

async function clearHistory() {
  try {
    const response = await apiClient.delete("/history");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default {
  searchSnips,
  getSavedSnips,
  reindexDocuments,
  getSavedRepos,
  setCurrentRepo,
  getCurrentRepo,
  checkRepoPath,
  addRepoPath,
  getFileContent,
  deleteRepo,
  fetchHistory,
  clearHistory
};
