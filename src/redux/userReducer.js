import { USER_LOGIN_SUCCESS, USER_LOGOUT } from "../actions/userActions";

const initialState = {
    user: null,
    token: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,  // Store user details
                token: action.payload.token, // Store token
            };

        case USER_LOGOUT:
            return {
                ...state,
                user: null,  // Clear user details
                token: null, // Remove token
            };

        default:
            return state;
    }
};

export default userReducer;
