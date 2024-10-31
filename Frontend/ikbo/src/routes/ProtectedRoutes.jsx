import { useAuth } from 'contexts/auth/AuthContext';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const { state } = useAuth();
    //console.log(state, 'state');

    if (!state.isInitialized) {
        return <div>Cargando...</div>; // O un spinner de carga
    }

    if (!state.isLoggedIn) {
        // Redirige al login si no está autenticado
        return <Navigate to="/login" replace />;
    }

    return children; // Renderiza los hijos si está autenticado
};