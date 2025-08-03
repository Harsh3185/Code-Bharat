import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUser, logout } from './authAPI';

export const fetchUser = createAsyncThunk('/auth/fetchUser', getUser);

export const logoutThunk = createAsyncThunk('/auth/logout', logout);
