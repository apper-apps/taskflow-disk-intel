import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  settings: [],
  currentTheme: 'light',
  settingsLoading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
reducers: {
    setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      // This prevents potential issues with object mutations
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.settings = [];
      state.currentTheme = 'light';
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
      state.settingsLoading = false;
    },
    updateSetting: (state, action) => {
      const { setting_name, setting_value } = action.payload;
      const existingIndex = state.settings.findIndex(s => s.setting_name === setting_name);
      if (existingIndex >= 0) {
        state.settings[existingIndex] = { ...state.settings[existingIndex], setting_value };
      } else {
        state.settings.push(action.payload);
      }
    },
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    setSettingsLoading: (state, action) => {
      state.settingsLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setSettings, updateSetting, setTheme, setSettingsLoading } = userSlice.actions;
export default userSlice.reducer;