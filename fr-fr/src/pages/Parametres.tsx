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
          <h1 className="text-2xl font-semibold text-[#1e3a5f]">Paramètres</h1>
          <p className="text-[#4b5563] text-sm mt-0.5">Gérez vos préférences et votre compte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-all duration-200 text-left
                        ${activeTab === tab.id
                          ? 'bg-[#d4e6f5] text-[#1e3a5f] font-medium'
                          : 'text-[#4b5563] hover:bg-[#f8f9fa] hover:text-[#1e3a5f]'
                        }
                      `}
                    >
                      <Icon size={16} />
                      <span className="text-sm">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#d1d5db] rounded-lg p-5">
              {/* Profile tab */}
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-[#1e3a5f] flex items-center gap-2">
                    <User size={18} />
                    Informations du profil
                  </h2>

                  <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-[#d1d5db]">
                    <div className="w-20 h-20 bg-[#4a6670]/10 rounded-full flex items-center justify-center text-3xl">
                      👤
                    </div>
                    <div className="text-center sm:text-left">
                      <button className="px-4 py-2 bg-[#4a6670] text-white rounded hover:bg-[#3d5660] transition-colors text-sm font-medium">
                        Changer la photo
                      </button>
                      <p className="text-xs text-[#9ca3af] mt-1.5">JPG, PNG ou GIF. Max 1 Mo.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name ?? ''}
                        className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                          type="email"
                          defaultValue={user?.email ?? ''}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                          type="tel"
                          placeholder="+33 6 00 00 00 00"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Adresse
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                          type="text"
                          placeholder="123 Rue Example"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4a6670] text-white rounded hover:bg-[#3d5660] transition-colors font-medium text-sm"
                    >
                      {saved ? (
                        <>
                          <Check size={16} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Security tab */}
              {activeTab === 'security' && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-[#1e3a5f] flex items-center gap-2">
                    <Lock size={18} />
                    Sécurité du compte
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full pl-10 pr-12 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                        />
                        <button
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563]"
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full pl-10 pr-12 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563]"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full pl-10 pr-12 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                        />
                        <button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563]"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#d1d5db]">
                    <h3 className="text-sm font-medium text-[#1e3a5f] mb-3">Authentification à deux facteurs</h3>
                    <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield size={18} className="text-[#4a6670]" />
                        <div>
                          <p className="text-sm font-medium text-[#1e3a5f]">2FA</p>
                          <p className="text-xs text-[#9ca3af]">Sécurisez votre compte avec l'authentification à deux facteurs</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a6670]"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4a6670] text-white rounded hover:bg-[#3d5660] transition-colors font-medium text-sm"
                    >
                      {saved ? (
                        <>
                          <Check size={16} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-[#1e3a5f] flex items-center gap-2">
                    <Bell size={18} />
                    Préférences de notification
                  </h2>

                  <div className="space-y-3">
                    {[
                      { title: 'Notifications par email', desc: 'Recevez des notifications par email pour les mises à jour importantes', defaultChecked: true },
                      { title: 'Notifications de commande', desc: 'Recevez une notification pour chaque nouvelle commande', defaultChecked: true },
                      { title: 'Alertes de stock', desc: 'Alertes quand un médicament est en rupture de stock', defaultChecked: true },
                      { title: 'Rappels de validation', desc: 'Rappels pour les commandes en attente de validation', defaultChecked: true },
                      { title: 'Rapports hebdomadaires', desc: 'Recevez un résumé hebdomadaire de vos activités', defaultChecked: false },
                      { title: 'Notifications marketing', desc: 'Recevez des offres et promotions spéciales', defaultChecked: false },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-[#1e3a5f]">{item.title}</p>
                          <p className="text-xs text-[#9ca3af] mt-0.5">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                          <div className="w-11 h-6 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a6670]"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4a6670] text-white rounded hover:bg-[#3d5660] transition-colors font-medium text-sm"
                    >
                      {saved ? (
                        <>
                          <Check size={16} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-[#1e3a5f] flex items-center gap-2">
                    <Palette size={18} />
                    Apparence
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-3">
                      Thème
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                            className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              theme === themeOption.value
                                ? 'border-[#4a6670] bg-[#4a6670]/5'
                                : 'border-[#d1d5db] hover:border-[#4a6670]/50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                              theme === themeOption.value ? 'bg-[#4a6670]/10' : 'bg-[#f8f9fa]'
                            }`}>
                              <Icon size={20} className={theme === themeOption.value ? 'text-[#4a6670]' : 'text-[#4b5563]'} />
                            </div>
                            <span className="text-sm font-medium text-[#1e3a5f]">{themeOption.name}</span>
                            <span className="text-xs text-[#9ca3af] mt-0.5">{themeOption.desc}</span>
                            {theme === themeOption.value && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-[#4a6670] rounded-full flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 p-4 bg-[#f8f9fa] rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#1e3a5f]">Thème actuel</p>
                          <p className="text-xs text-[#9ca3af]">
                            {resolvedTheme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé'}
                          </p>
                        </div>
                        <button
                          onClick={toggleTheme}
                          className="px-4 py-2 bg-[#4a6670] text-white rounded hover:bg-[#3d5660] transition-colors text-sm font-medium"
                        >
                          Basculer
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                      Langue
                    </label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                      <select className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all cursor-pointer appearance-none">
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4a6670] text-white rounded hover:bg-[#3d5660] transition-colors font-medium text-sm"
                    >
                      {saved ? (
                        <>
                          <Check size={16} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Business tab */}
              {activeTab === 'business' && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-[#1e3a5f] flex items-center gap-2">
                    <Building size={18} />
                    Informations de l'entreprise
                  </h2>

                  <div className="flex items-center gap-5 pb-5 border-b border-[#d1d5db]">
                    <div className="w-20 h-20 bg-[#4a6670]/10 rounded-lg flex items-center justify-center">
                      <Pill size={32} className="text-[#4a6670]" />
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-[#4a6670] text-white rounded hover:bg-[#3d5660] transition-colors text-sm font-medium">
                        Changer le logo
                      </button>
                      <p className="text-xs text-[#9ca3af] mt-1.5">PNG, JPG ou SVG. Max 2 Mo.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        defaultValue="PharmaSync Pro SARL"
                        className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Numéro de licence
                      </label>
                      <input
                        type="text"
                        placeholder="LIC-XXXX-XXXX"
                        className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Téléphone professionnel
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                          type="tel"
                          placeholder="+33 1 00 00 00 00"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Email professionnel
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                          type="email"
                          placeholder="contact@pharmasync.pro"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                        Adresse du siège
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                        <input
                          type="text"
                          placeholder="123 Avenue de la Santé, 75001 Paris"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4a6670] text-white rounded hover:bg-[#3d5660] transition-colors font-medium text-sm"
                    >
                      {saved ? (
                        <>
                          <Check size={16} />
                          Enregistré !
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* System tab */}
              {activeTab === 'system' && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-[#1e3a5f] flex items-center gap-2">
                    <Database size={18} />
                    Paramètres système
                  </h2>

                  <div className="space-y-3">
                    <div className="p-4 bg-[#f8f9fa] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-[#1e3a5f]">Stockage utilisé</p>
                        <p className="text-sm text-[#4b5563]">2,4 Go / 10 Go</p>
                      </div>
                      <div className="w-full bg-[#d1d5db] rounded-full h-2">
                        <div className="bg-[#4a6670] h-2 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-[#1e3a5f]">Exporter les données</p>
                        <p className="text-xs text-[#9ca3af] mt-0.5">Téléchargez une copie de vos données</p>
                      </div>
                      <button className="px-4 py-2 bg-white border border-[#d1d5db] rounded text-sm font-medium text-[#4b5563] hover:bg-[#f8f9fa] transition-colors">
                        Exporter
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-[#1e3a5f]">Journal d'activité</p>
                        <p className="text-xs text-[#9ca3af] mt-0.5">Consultez l'historique de vos actions</p>
                      </div>
                      <button className="px-4 py-2 bg-white border border-[#d1d5db] rounded text-sm font-medium text-[#4b5563] hover:bg-[#f8f9fa] transition-colors">
                        Voir
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-[#1e3a5f]">Sauvegarde automatique</p>
                        <p className="text-xs text-[#9ca3af] mt-0.5">Sauvegarde quotidienne des données</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a6670]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#dc2626]/5 rounded-lg border border-[#dc2626]/20">
                      <div>
                        <p className="text-sm font-medium text-[#dc2626]">Supprimer le compte</p>
                        <p className="text-xs text-[#9ca3af] mt-0.5">Cette action est irréversible</p>
                      </div>
                      <button className="px-4 py-2 bg-[#dc2626] text-white rounded text-sm font-medium hover:bg-[#b91c1c] transition-colors">
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
