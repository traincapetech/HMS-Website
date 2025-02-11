import {createSlice} from '@reduxjs/toolkit'

const initialState  = {
    formData:{
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        gender: "",
        country: "",
        state: "",
        city: "",
        address: "",
    },
    currentStep: 1,
}

const userSlice = createSlice({
    name: 'user',
    initialState ,
    reducers: {
        updateFormData(state , action) {
            const {name , value} = action.payload;
            state.formData[name] = value;
        },
        incremetStep(state) {
            state.currentStep += 1;
        },
        decrementStep(state) {
            state.currentStep -= 1;
        },
        setFormData(state , action) {
            state.formData = action.payload
        }
    }

})

export const {updateFormData, incremetStep, decrementStep, setFormData} = userSlice.actions;
export default userSlice.reducer