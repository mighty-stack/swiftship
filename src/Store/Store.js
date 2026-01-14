import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import jobsReducer from './Slices/jobsSlice';
import earningsReducer from './Slices/earningsSlice';
import driverReducer from './Slices/driverSlice'
import shipmentsReducer from './Slices/shipmentsSlice'
import usersReducer from './Slices/userSlice'

const Store = configureStore({
  reducer: {
    auth: authReducer,
    shipments: shipmentsReducer,
    jobs: jobsReducer,
    earnings: earningsReducer,
    driver: driverReducer,
    users: usersReducer
  },
});
    
export default Store;