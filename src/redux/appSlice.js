import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { videos } from "../fakeData.js/Data";
import axios from "axios";

const initialState = {
  videos: [],
  filterVideos: [],
  // videos: videos,
  // filterVideos: videos,
  isEdit: false,
  videoToEdit: {},
  show: false,
  isLoading: false,
};

export const getVideos = createAsyncThunk(
  "appSlice/getVideos",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/video`);

      dispatch(setfilterVideos(data.data));
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addVideo = createAsyncThunk(
  "appSlice/addVideo",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`/video`, arg);

      dispatch(getVideos());
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "appSlice/deleteVideo",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`/video/${id}`);

      dispatch(getVideos());
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateVideo = createAsyncThunk(
  "appSlice/updateVideo",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(`/video/${arg._id}`, arg);

      dispatch(getVideos());
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setfilterVideos(state, action) {
      state.filterVideos = action.payload;
    },

    setIsEdit(state, action) {
      state.isEdit = action.payload;
    },

    setvideoToEdit(state, action) {
      state.videoToEdit = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },

    handleClose(state) {
      state.show = false;
    },
    handleShow(state) {
      state.show = true;
    },
  },
  extraReducers: (builder) => {
    //getVideos
    builder.addCase(getVideos.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getVideos.fulfilled, (state, action) => {
      state.videos = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getVideos.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.payload);
    });

    //addvideo
    builder.addCase(addVideo.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(addVideo.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(addVideo.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.payload);
    });

    //deletevideo

    builder.addCase(deleteVideo.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.payload);
    });

    //update
    builder.addCase(updateVideo.pending, (state, action) => {
      state.isLoading = true;
      state.isEdit = true;
    });

    builder.addCase(updateVideo.fulfilled, (state, action) => {
      state.videoToEdit = action.payload;
      state.isLoading = false;
      state.isEdit = false;
    });

    builder.addCase(updateVideo.rejected, (state, action) => {
      state.isEdit = false;
      state.isLoading = false;
      console.log(action.payload);
    });
  },
});

export const {
  setfilterVideos,
  setIsEdit,
  setvideoToEdit,
  handleClose,
  handleShow,
} = appSlice.actions;

export default appSlice.reducer;
