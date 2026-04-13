import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Menu() {
    const { user, loading, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
          await logout();
        } catch (error) {
          console.error('Erreur:', error);
        } finally {
          setIsLoggingOut(false);
        }
      };

    if (loading) {
      return <div>Chargement des informations utilisateur...</div>;
    }

    return(
      <div>
        <h1>Menu</h1>
        <p><strong>Nom :</strong> {user?.name ?? 'Non renseigné'}</p>
        <p><strong>Email :</strong> {user?.email ?? 'Non disponible'}</p>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
        </button>
      </div>
    );
}