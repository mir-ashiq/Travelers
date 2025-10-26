import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface GeneralSettings {
  siteName: string;
  siteEmail?: string;
  sitePhone?: string;
  siteEmails?: string[];
  sitePhones?: string[];
  siteAddress: string;
}

export interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface SiteSettings {
  general: GeneralSettings;
  social: SocialSettings;
  logo?: string;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  general: {
    siteName: 'JKLG Travel Agency',
    siteEmail: 'info@jklgtravel.com',
    sitePhone: '+91 98765 43210',
    siteEmails: ['info@jklgtravel.com'],
    sitePhones: ['+91 98765 43210'],
    siteAddress: '123 Tourism Road, Srinagar, Jammu & Kashmir, India'
  },
  social: {
    facebook: 'https://facebook.com/jklgtravel',
    instagram: 'https://instagram.com/jklgtravel',
    twitter: 'https://twitter.com/jklgtravel',
    youtube: 'https://youtube.com/jklgtravel'
  }
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {}
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // Fetch all settings at once
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const newSettings: SiteSettings = { ...defaultSettings };

      // Process the data
      if (data && Array.isArray(data)) {
        const generalSettings = data.find((item: any) => item.key === 'general_settings');
        const socialSettings = data.find((item: any) => item.key === 'social_settings');

        if (generalSettings?.value) {
          newSettings.general = generalSettings.value;
        }

        if (socialSettings?.value) {
          newSettings.social = socialSettings.value;
        }
      }

      setSettings(newSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Subscribe to settings changes
    const subscription = supabase
      .channel('site_settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
