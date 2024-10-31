import React, { createContext, useReducer, useContext, useEffect } from 'react';
import auth, { initialState } from './auth'; // Importar reducer
import { REGISTER, LOGIN, LOGOUT, INITIALIZE } from './actions';
import axios from 'axios';

const AuthContext = createContext();

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(auth, initialState);

    const register = async (user) => {
        //console.log("register",user);
        try {
            const response = await axios.post(`/api/auth/register`, user);
            //dispatch({ type: REGISTER, payload: { user } });
            return response.data;
        } catch (error) {
            return { error: [error.message] };
        }
    };

    const login = async (user) => {
        try {
            const response = await axios.post(`/api/auth/login`, user);
            if (response.data) {
                if (response.data.user && response.data.user != "" && response.data.token && response.data.token != "") {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('token', response.data.token);
                    dispatch({ type: LOGIN, payload: { user: response.data.user, token: response.data.token } });
                }
                return response.data;
            }
        } catch (error) {
            return { error: [error.message] };
        }
    };

    const logout = () => {
        const storedUser = localStorage.removeItem('user');
        const storedToken = localStorage.removeItem('token');
        dispatch({ type: LOGOUT });
    };

    const isLoggedIn = () => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            dispatch({ type: LOGIN, payload: { user: JSON.parse(storedUser), token: storedToken } });
        }
        dispatch({ type: INITIALIZE });
    }

    // Cargar el estado del usuario y el token desde localStorage al iniciar
    useEffect(() => {
        window.logout = logout;
        isLoggedIn();
        return () => {
            delete window.logout; // Limpiar la referencia cuando se desmonte el componente
        };
    }, []);

    return (
        <AuthContext.Provider value={{ state, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = () => {
    return useContext(AuthContext);
};