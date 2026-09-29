import React, { useState } from 'react';
import { Shield, Lock, ArrowLeft, Fingerprint, KeyRound, UserCheck, CheckCircle2, Sparkles, Building2, Flame, Award, Heart, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';
import { UserProfile } from '../../types';

interface UnifiedAuthModalProps {
  portal: 'command' | 'welfare' | 'soldier';
  initialForceCategory?: string;
  onLoginSuccess: (user: UserProfile) => void;
  onBack: () => void;
  language?: 'en' | 'hi';
  isMobileFrame?: boolean;
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  portal,
  initialForceCategory = 'ALL',
  onLoginSuccess,
  onBack,
  language = 'en',
  isMobileFrame = true,
}) => {
  const isHi = language === 'hi';
  const [authMethod, setAuthMethod] = useState<'persona' | 'credentials' | 'biometric' | 'anonymous'>('persona');
  const [selectedForce, setSelectedForce] = useState<string>(initialForceCategory);
  const [serviceId, setServiceId] = useState(portal === 'command' ? 'IC-54912W' : portal === 'welfare' ? 'AMC-30491' : 'SRV-10294');
  const [passcode, setPasscode] = useState('••••••••');
  const [otp, setOtp] = useState('482910');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available Personas per portal
  const personaOptions = {
    command: [
      {
        key: 'commander_u1',
        title: 'Col. V. A. Rathore, SM',
        rank: 'Colonel (Commanding Officer)',
        force: 'Indian Army (Armed Forces)',
        sector: '14 Rajputana Rifles (Siachen High Altitude Sector)',
        badge: '🛡️',
        category: 'Armed Forces'
      },
      {
        key: 'commander_crpf',
        title: 'Commandant Rajeshwar Singh',
        rank: 'Commandant',
        force: 'CRPF (Central Armed Police Forces)',
        sector: '204 CoBRA Battalion (Bastar LWE Counter-Ambush)',
        badge: '⚔️',
        category: 'CAPFs'
      },
      {
        key: 'commander_bsf',
        title: 'Commandant Harmeet Singh',
        rank: 'Commandant',
        force: 'BSF (Border Security Force)',
        sector: '88 Bn (Longewala Border Outpost, Thar Desert)',
        badge: '🐪',
        category: 'CAPFs'
      },
      {
        key: 'commander_police',
        title: 'DCP Vikramaditya Deshmukh, IPS',
        rank: 'Deputy Commissioner of Police',
        force: 'Maharashtra State Police',
        sector: 'Mumbai Police Zone 1 (Metro Riot & Bandobast)',
        badge: '🚓',
        category: 'State Police'
      },
      {
        key: 'commander_ndrf',
        title: 'Commandant Ajay Verma',
        rank: 'Commandant',
        force: 'NDRF (Disaster Response)',
        sector: '8th Bn NDRF (Flood & Earthquake Search & Rescue)',
        badge: '🌊',
        category: 'Disaster Response'
      },
      {
        key: 'admin',
        title: 'Brig. J. S. Cheema',
        rank: 'Brigadier (HQ Admin)',
        force: 'Joint Defence & Security Command',
        sector: 'National Command Center (Full HRMS Bulk Upload & Audit)',
        badge: '🏛️',
        category: 'Armed Forces'
      },
    ],
    welfare: [
      {
        key: 'welfare',
        title: 'Capt. Dr. S. Sengupta',
        rank: 'Regimental Medical Officer (RMO)',
        force: 'Army Medical Corps / Uniformed Forces',
        sector: 'Clinical Case Management & Confidential Psychiatric Notes',
        badge: '🩺',
        category: 'Armed Forces'
      },
      {
        key: 'welfare_capf',
        title: 'Dr. Ananya Sen',
        rank: 'Chief Medical Officer / Psychological Counsellor',
        force: 'CAPFs Medical Wing (CRPF / BSF / ITBP)',
        sector: 'Trauma Intervention & Rapid Tele-Counselling',
        badge: '🧠',
        category: 'CAPFs'
      },
    ],
    soldier: [
      {
        key: 'personnel',
        title: 'Sepoy Rajesh Kumar Singh',
        rank: 'Sepoy (Infantry)',
        force: '14 Rajputana Rifles (Indian Army)',
        sector: 'Siachen Forward Post (64-Day Continuous Duty Streak)',
        badge: '🎖️',
        category: 'Armed Forces'
      },
      {
        key: 'personnel_crpf',
        title: 'Head Constable Amit Kumar',
        rank: 'Head Constable (Commando)',
        force: '204 CoBRA CRPF',
        sector: 'Bastar Jungle Anti-Ambush Patrol (68-Day Duty)',
        badge: '⚔️',
        category: 'CAPFs'
      },
      {
        key: 'personnel_police',
        title: 'Sub-Inspector Sachin Kadam',
        rank: 'Sub-Inspector',
        force: 'Mumbai Police (State Police)',
        sector: 'Metro Law & Order (16-Hr Continuous Bandobast Duty)',
        badge: '🚓',
        category: 'State Police'
      },
      {
        key: 'personnel_ndrf',
        title: 'Rescue Specialist Sandeep Rawat',
        rank: 'Rescue Specialist',
        force: '8th Bn NDRF',
        sector: 'Cyclone & Flood Recovery Operations',
        badge: '🌊',
        category: 'Disaster Response'
      },
    ]
  };

  const activePersonas = personaOptions[portal].filter((p) =>
    selectedForce === 'ALL' ? true : p.category === selectedForce
  );

  const handleExecuteLogin = async (roleKey: string, specificAuthMethod: string = authMethod) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({
        auth_type: specificAuthMethod as any,
        role_key: roleKey,
        service_id: serviceId,
        passcode: passcode,
        force_category: selectedForce,
      });

      if (res.user) {
        onLoginSuccess(res.user);
      } else {
        throw new Error('Authentication rejected');
      }
    } catch (e: any) {
      console.error('Authentication error:', e);
      setError(e.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-2xl shadow-slate-300/40 space-y-5 sm:space-y-6 overflow-hidden">
      {/* Indian Tricolor top accent rim */}
      <div className="h-1.5 w-[calc(100%+2rem)] sm:w-[calc(100%+4rem)] -mt-4 sm:-mt-8 -mx-4 sm:-mx-8 mb-4 sm:mb-5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isHi ? 'गेटवे पर वापस जाएं' : 'Return to Multi-Force Gateway'}</span>
      </button>

      {/* Header with ManoBal Logo (no text beside logo as logo already has ManoBal name in it) */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs inline-block">
            <img
              src="/logo.jpeg"
              alt="ManoBal"
              className="h-12 sm:h-14 w-auto object-contain rounded-xl"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
          <span>🇮🇳</span>
          <span>
            {portal === 'command'
              ? 'Dashboard 1 · Command Clearance'
              : portal === 'welfare'
              ? 'Dashboard 2 · Clinical Medical Portal'
              : 'Dashboard 3 · Mobile Jawan PWA'}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {portal === 'command'
            ? 'Command & Operational Admin Login'
            : portal === 'welfare'
            ? 'Welfare Officer & Counsellor Login'
            : 'Uniformed Personnel Mobile Check-In'}
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {portal === 'command'
            ? 'Formation commanding officer clearance with strict battalion scoping.'
            : portal === 'welfare'
            ? 'Regimental medical officer & psychological counselor clinical access.'
            : 'Confidential self-service wellness portal for jawans, officers & rescue personnel.'}
        </p>
      </div>

      {/* Force Category Selector Tabs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {isHi ? 'लक्षित सुरक्षा बल चुनें' : 'Select Target Uniformed Force'}
          </label>
          <span className="text-[10px] text-slate-400 font-medium">
            {selectedForce === 'ALL' ? (isHi ? 'समस्त बल' : 'All Forces') : selectedForce}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: '🇮🇳 All Forces' },
            { id: 'Armed Forces', label: '🛡️ Armed Forces' },
            { id: 'CAPFs', label: '⚔️ CAPFs' },
            { id: 'State Police', label: '🚓 State Police' },
            { id: 'Disaster Response', label: '🌊 NDRF / Disaster' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedForce(f.id)}
              className={`py-1.5 px-3 rounded-xl border text-center transition-all whitespace-nowrap text-xs font-bold shrink-0 ${
                selectedForce === f.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900/30'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Authentication Mode Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          {isHi ? 'प्रमाणीकरण विधि (Authentication Method)' : 'Authentication Method'}
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMethod('persona')}
            className={`p-2 sm:p-2.5 rounded-2xl border text-left transition-all flex items-start gap-2 sm:gap-2.5 min-w-0 ${
              authMethod === 'persona'
                ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                authMethod === 'persona'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-[11px] sm:text-xs text-slate-900 truncate">
                {isHi ? 'त्वरित प्रोफ़ाइल' : 'Quick Personas'}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 font-normal truncate">
                {isHi ? '1-क्लिक टेस्ट लॉगिन' : '1-Click Fast Login'}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod('credentials')}
            className={`p-2 sm:p-2.5 rounded-2xl border text-left transition-all flex items-start gap-2 sm:gap-2.5 min-w-0 ${
              authMethod === 'credentials'
                ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                authMethod === 'credentials'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-[11px] sm:text-xs text-slate-900 truncate">
                {isHi ? 'आईडी एवं पिन' : 'Military ID & PIN'}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 font-normal truncate">
                {isHi ? 'सेवा क्रेडेंशियल' : 'Service Credential'}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod('biometric')}
            className={`p-2 sm:p-2.5 rounded-2xl border text-left transition-all flex items-start gap-2 sm:gap-2.5 min-w-0 ${
              authMethod === 'biometric'
                ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                authMethod === 'biometric'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-[11px] sm:text-xs text-slate-900 truncate">
                {isHi ? 'बायोमेट्रिक सिंक' : 'Biometric Sync'}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 font-normal truncate">
                {isHi ? 'फ़िंगरप्रिंट / फेस' : 'FIDO2 / Thumbprint'}
              </div>
            </div>
          </button>

          {portal === 'soldier' ? (
            <button
              type="button"
              onClick={() => setAuthMethod('anonymous')}
              className={`p-2 sm:p-2.5 rounded-2xl border text-left transition-all flex items-start gap-2 sm:gap-2.5 min-w-0 ${
                authMethod === 'anonymous'
                  ? 'bg-teal-50/90 border-teal-500 text-teal-950 ring-1 ring-teal-500/30 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  authMethod === 'anonymous'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-[11px] sm:text-xs text-slate-900 truncate">
                  {isHi ? 'गुमनाम मोड' : 'Anonymous Mode'}
                </div>
                <div className="text-[9px] sm:text-[10px] text-teal-700 font-semibold truncate">
                  {isHi ? 'शून्य पहचान' : 'Zero Identity'}
                </div>
              </div>
            </button>
          ) : (
            <div className="p-2 sm:p-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-2 sm:gap-2.5 opacity-70 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 bg-white border border-slate-200 text-slate-400">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[11px] sm:text-xs text-slate-600 truncate">
                  {isHi ? 'स्मार्ट कार्ड (CAC)' : 'CAC / Smart Card'}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 font-normal truncate">
                  {isHi ? 'एनएफसी टोकन' : 'NFC / PKI Token'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* MODE 1: Rapid Evaluator Personas (For Judges & Evaluators) */}
      {authMethod === 'persona' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              {isHi ? `मूल्यांकनकर्ता प्रोफ़ाइल (${activePersonas.length} उपलब्ध)` : `Clearance Personas (${activePersonas.length} Available)`}
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">1-Click Instant Login</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
            {activePersonas.map((p) => (
              <div
                key={p.key}
                onClick={() => handleExecuteLogin(p.key, 'persona')}
                className="group p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-500 rounded-2xl cursor-pointer transition-all duration-200 flex items-start gap-3 shadow-xs hover:shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  {p.badge}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-slate-900 text-xs group-hover:text-emerald-700 leading-snug">
                      {p.title}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 shrink-0">
                      Login →
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-800/90 mt-0.5">{p.rank} · {p.force}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{p.sector}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: Military Credentials & Passcode */}
      {authMethod === 'credentials' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const defaultRole = portal === 'command' ? 'commander_u1' : portal === 'welfare' ? 'welfare' : 'personnel';
            handleExecuteLogin(defaultRole, 'credentials');
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Official Service Credential / Token ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Security PIN
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                2FA OTP Token
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 text-center"
          >
            <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{loading ? 'Verifying Military Clearance...' : 'Verify Token & Authorize Clearance'}</span>
          </button>
        </form>
      )}

      {/* MODE 3: Biometric TouchID / FaceID Simulation */}
      {authMethod === 'biometric' && (
        <div className="text-center py-6 space-y-4">
          <div
            onClick={() => {
              const defaultRole = portal === 'command' ? 'commander_u1' : portal === 'welfare' ? 'welfare' : 'personnel';
              handleExecuteLogin(defaultRole, 'biometric');
            }}
            className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-500 hover:border-solid hover:bg-emerald-100/70 text-emerald-600 flex items-center justify-center mx-auto cursor-pointer transition-all duration-300 group"
          >
            <Fingerprint className="w-10 h-10 group-hover:scale-110 transition-transform animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Tap Fingerprint to Scan</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Simulating hardware-backed biometric verification (WebAuthn / FIDO2 Defence Standard).
            </p>
          </div>
        </div>
      )}

      {/* MODE 4: Anonymous Shielded Entry (Soldier Portal) */}
      {authMethod === 'anonymous' && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 text-center space-y-3">
          <Shield className="w-8 h-8 text-teal-600 mx-auto" />
          <h4 className="font-bold text-teal-950 text-sm">Anonymous Zero-Identity Check-In</h4>
          <p className="text-xs text-teal-800 leading-relaxed max-w-sm mx-auto">
            Under India's DPDP Act, 2023, you have the right to seek welfare support without disclosing your service number or battalion. No identity records are retained.
          </p>
          <button
            onClick={() => handleExecuteLogin('personnel', 'anonymous')}
            disabled={loading}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            {loading ? 'Opening Shielded Session...' : 'Enter Shielded Portal'}
          </button>
        </div>
      )}

      {/* Security Footer Notice */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-1">
        <span>AES-256-GCM Envelope Encryption</span>
        <span>DPDP Act, 2023 Compliant</span>
      </div>
    </div>
  );
};
