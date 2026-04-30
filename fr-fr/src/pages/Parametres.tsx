import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Save,
  Eye,
  EyeOff,
  Check,
  Sun,
  Moon,
  Monitor,
  Pill,
  Building,
  Phone,
  MapPin,
} from 'lucide-react';

export default function Parametres() {
  const { user } = useAuth();
  const { theme, setTheme, toggleTheme, resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Sécurité', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Apparence', icon: Palette },
    { id: 'business', name: 'Entreprise', icon: Building },
    { id: 'system', name: 'Système', icon: Database },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Paramètres</h1>
          <p className="text-text-secondary mt-1">Gérez vos préférences et votre compte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left
                        ${activeTab === tab.id
                          ? 'bg-primary text-white shadow-md'
                          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-surface border border-border rounded-xl p-6">
              {/* Profile tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <User size={20} />
                    Informations du profil
                  </h2>

                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl">
                      👤
                    </div>
                    <div className="text-center sm:text-left">
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">
                        Changer la photo
                      </button>
                      <p className="text-xs text-text-muted mt-2">JPG, PNG ou GIF. Max 1 Mo.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name ?? ''}
                        className="w-full px-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="email"
                          defaultValue={user?.email ?? ''}
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="tel"
                          placeholder="+33 6 00 00 00 00"
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Adresse
                      </label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="text"
                          placeholder="123 Rue Example"
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                      {saved ? (
                        <>
                          <Check size={18} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Security tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Lock size={20} />
                    Sécurité du compte
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full pl-10 pr-12 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        <button
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full pl-10 pr-12 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full pl-10 pr-12 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        <button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-text-primary mb-3">Authentification à deux facteurs</h3>
                    <div className="flex items-center justify-between p-4 bg-surface-hover rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield size={20} className="text-primary" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">2FA</p>
                          <p className="text-xs text-text-muted">Sécurisez votre compte avec l'authentification à deux facteurs</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                      {saved ? (
                        <>
                          <Check size={18} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Bell size={20} />
                    Préférences de notification
                  </h2>

                  <div className="space-y-4">
                    {[
                      { title: 'Notifications par email', desc: 'Recevez des notifications par email pour les mises à jour importantes', defaultChecked: true },
                      { title: 'Notifications de commande', desc: 'Recevez une notification pour chaque nouvelle commande', defaultChecked: true },
                      { title: 'Alertes de stock', desc: 'Alertes quand un médicament est en rupture de stock', defaultChecked: true },
                      { title: 'Rappels de validation', desc: 'Rappels pour les commandes en attente de validation', defaultChecked: true },
                      { title: 'Rapports hebdomadaires', desc: 'Recevez un résumé hebdomadaire de vos activités', defaultChecked: false },
                      { title: 'Notifications marketing', desc: 'Recevez des offres et promotions spéciales', defaultChecked: false },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-surface-hover rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{item.title}</p>
                          <p className="text-xs text-text-muted mt-1">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                          <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                      {saved ? (
                        <>
                          <Check size={18} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Palette size={20} />
                    Apparence
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Thème
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { name: 'Clair', value: 'light' as const, icon: Sun, desc: 'Interface claire' },
                        { name: 'Sombre', value: 'dark' as const, icon: Moon, desc: 'Interface sombre' },
                        { name: 'Auto', value: 'auto' as const, icon: Monitor, desc: 'Selon le système' },
                      ].map((themeOption) => {
                        const Icon = themeOption.icon;
                        return (
                          <button
                            key={themeOption.value}
                            onClick={() => setTheme(themeOption.value)}
                            className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              theme === themeOption.value
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                              theme === themeOption.value ? 'bg-primary/10' : 'bg-surface-hover'
                            }`}>
                              <Icon size={24} className={theme === themeOption.value ? 'text-primary' : 'text-text-secondary'} />
                            </div>
                            <span className="text-sm font-medium text-text-primary">{themeOption.name}</span>
                            <span className="text-xs text-text-muted mt-1">{themeOption.desc}</span>
                            {theme === themeOption.value && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 p-4 bg-surface-hover rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-primary">Thème actuel</p>
                          <p className="text-xs text-text-muted">
                            {resolvedTheme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé'}
                          </p>
                        </div>
                        <button
                          onClick={toggleTheme}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                        >
                          Basculer
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Langue
                    </label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <select className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer appearance-none">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                      {saved ? (
                        <>
                          <Check size={18} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Business tab */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Building size={20} />
                    Informations de l'entreprise
                  </h2>

                  <div className="flex items-center gap-6 pb-6 border-b border-border">
                    <div className="w-24 h-24 bg-primary/10 rounded-xl flex items-center justify-center text-4xl">
                      <Pill size={40} className="text-primary" />
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">
                        Changer le logo
                      </button>
                      <p className="text-xs text-text-muted mt-2">PNG, JPG ou SVG. Max 2 Mo.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        defaultValue="PharmaGest SARL"
                        className="w-full px-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Numéro de licence
                      </label>
                      <input
                        type="text"
                        placeholder="LIC-XXXX-XXXX"
                        className="w-full px-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Téléphone professionnel
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="tel"
                          placeholder="+33 1 00 00 00 00"
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Email professionnel
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="email"
                          placeholder="contact@pharmagest.fr"
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Adresse du siège
                      </label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="text"
                          placeholder="123 Avenue de la Santé, 75001 Paris"
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                    >
                      {saved ? (
                        <>
                          <Check size={18} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* System tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Database size={20} />
                    Paramètres système
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-surface-hover rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-text-primary">Stockage utilisé</p>
                        <p className="text-sm text-text-secondary">2.4 GB / 10 GB</p>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-hover rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-text-primary">Exporter les données</p>
                        <p className="text-xs text-text-muted mt-1">Téléchargez une copie de vos données</p>
                      </div>
                      <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors">
                        Exporter
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-hover rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-text-primary">Journal d'activité</p>
                        <p className="text-xs text-text-muted mt-1">Consultez l'historique de vos actions</p>
                      </div>
                      <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors">
                        Voir
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-hover rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-text-primary">Sauvegarde automatique</p>
                        <p className="text-xs text-text-muted mt-1">Sauvegarde quotidienne des données</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-danger/5 rounded-lg border border-danger/20">
                      <div>
                        <p className="text-sm font-medium text-danger">Supprimer le compte</p>
                        <p className="text-xs text-text-muted mt-1">Cette action est irréversible</p>
                      </div>
                      <button className="px-4 py-2 bg-danger text-white rounded-lg text-sm font-medium hover:bg-danger/90 transition-colors">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
