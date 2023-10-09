import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tour } from '../../types';

type TourState = {
  allTours: Tour[];
  filteredTours: Tour[];
  allRegions: string[];
  currentTour: Tour | null;
}
const initialState: TourState = {
  allTours: [],
  filteredTours: [],
  allRegions: [],
  currentTour: null,
}

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    setAllTours: (state, action: PayloadAction<Tour[]>) => {
      state.allTours = action.payload;
      state.filteredTours = action.payload;
      state.allRegions = Array.from(new Set(action.payload.map(tour => tour.region)))
    },
    setFilteredTours: (state, action: PayloadAction<Tour[]>) => {
      state.filteredTours = action.payload;
    },
    setCurrentTour: (state, action: PayloadAction<Tour | null>) => {
      state.currentTour = action.payload;
    },
  }
})

export default tourSlice.reducer
export const { setAllTours, setFilteredTours, setCurrentTour } = tourSlice.actions
