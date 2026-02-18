"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  Moon,
  Sun,
  LogOut,
  User,
  Bell,
  Globe,
  ShieldAlert,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("English");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSMSAlerts] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <header>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your preferences and account security.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Section 1: Profile (Read-Only) */}
            <section className="col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <User className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    User Profile
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    View your account details
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Full Name
                  </label>
                  <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    Christian Jay Basinillo
                  </div>
                </div>
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Email Address
                  </label>
                  <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    christian@example.com
                  </div>
                </div>
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Role
                  </label>
                  <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    Logistics Manager
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: App Preferences */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center gap-3">
                <Globe className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  App Preferences
                </h2>
              </div>

              <div className="space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Dark Mode
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Adjust the appearance
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:bg-indigo-600"
                  >
                    <span
                      className={`${
                        theme === "dark" ? "translate-x-5" : "translate-x-0"
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    ></span>
                  </button>
                </div>

                {/* Language Dropdown */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Language
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Select your preferred language
                    </p>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="English">English</option>
                    <option value="Filipino">Filipino</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section 3: Notifications */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center gap-3">
                <Bell className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Notifications
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Email Alerts
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Get notified via email
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${emailAlerts ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
                  >
                    <span
                      className={`${
                        emailAlerts ? "translate-x-5" : "translate-x-0"
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    ></span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      SMS Alerts
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Get notified via SMS
                    </p>
                  </div>
                  <button
                    onClick={() => setSMSAlerts(!smsAlerts)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${smsAlerts ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
                  >
                    <span
                      className={`${
                        smsAlerts ? "translate-x-5" : "translate-x-0"
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    ></span>
                  </button>
                </div>
              </div>
            </section>

            {/* Section 4: Danger Zone */}
            <section className="col-span-2 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-red-900 dark:text-red-200">
                      Danger Zone
                    </h2>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Actions here can't be undone.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
