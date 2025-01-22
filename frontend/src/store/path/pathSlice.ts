import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import snipsApi from "../../api/snipsApi";

type PathState = {
  path: string;
  lastIndexed: string;
  loading: boolean;
  error: string | null;
};


const initialState: PathState = {
  path: "Loading...",
  lastIndexed: "",
  loading: true,
  error: null,
};

export const updateCurrentRepoPath = createAsyncThunk(
  "currentRepoPath/updateCurrentRepoPath",
  async (newPath: string) => {
    try {
      console.log("Sending POST request with body: ", newPath);
      const data = await snipsApi.setCurrentRepo(newPath);
      console.log("Updated current repo path: ", data);
      return data;
    } catch (err) {
      console.error("POST: Updating user current repo path failed", err);
      throw new Error("Failed to update path");
    }
  }
);

export const fetchCurrentRepo = createAsyncThunk(
  "currentRepoPath/fetchCurrentRepo",
  async () => {
    try {
      const data = await snipsApi.getCurrentRepo();

      console.log("Slice get current Repo: ", data);

      const currentRepoPath = data.path;
      const lastIndexed = data.lastIndexed;

      return { currentRepoPath, lastIndexed };
    }
    catch (err) {
      console.error("GET: Fetching user current repo path failed", err);
      // throw new Error("Failed to fetch current repo path");
    }
  }
);

const PathSlice = createSlice({
  name: "currentRepoPath",
  initialState,
  reducers: {
    setLastIndexed: (state, action) => {
      state.lastIndexed = action.payload;
      localStorage.setItem("lastIndexed", action.payload);
    }
  },

  extraReducers: (builder) => {
    builder.addCase( updateCurrentRepoPath.fulfilled,
      (state: PathState, action: PayloadAction<PathState>) => {
        state.path = action.payload.path;
        state.lastIndexed = action.payload.lastIndexed;
        localStorage.setItem("currentRepoPath", action.payload.path);
        console.log("POST: Updating user current repo path succeeded");
      }
    );

    builder.addCase(updateCurrentRepoPath.rejected, (state, action) => {
      console.error("Failed to update path", state.path, action.error);
    });

    builder.addCase(updateCurrentRepoPath.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchCurrentRepo.fulfilled, (state, action) => {
      console.log(
        "Updating state: ", action.payload  
      )
      state.path = action.payload?.currentRepoPath || "Not set";
      state.lastIndexed = action.payload?.lastIndexed || "";
      state.loading = false;
      state.error = null;
    });

    builder.addCase(fetchCurrentRepo.rejected, (state, action) => { 
      state.path = "Not set";

      state.loading = false;
      state.error = action.error.message || "Failed to fetch current repo path";
    });

  },
});

export const { setLastIndexed } = PathSlice.actions; // exporting of the reducers

export default PathSlice.reducer;
