import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice'
import doctorReducer from './doctorSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        doctor: doctorReducer,
    }
})

export default store
