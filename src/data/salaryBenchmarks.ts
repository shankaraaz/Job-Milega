import { JobSector } from '../types';

export interface SalaryBand {
  min: number;
  median: number;
  max: number;
  p25: number;
  p75: number;
  p90: number;
}

export interface RoleSalaryBenchmark {
  id: string;
  roleTitle: string;
  hindiTitle: string;
  sector: JobSector;
  category: string;
  description: string;
  experienceLevels: {
    fresher: SalaryBand; // 0-1 yrs
    mid: SalaryBand; // 1-3 yrs
    experienced: SalaryBand; // 3-5 yrs
    senior: SalaryBand; // 5+ yrs
  };
  cityMultipliers: Record<string, number>; // e.g. Mumbai 1.15, Delhi NCR 1.10, Bengaluru 1.15, Pune 1.0, Tier-2 0.85
  typicalPerks: string[];
  salaryDrivers: {
    skillOrCert: string;
    boostAmount: string;
  }[];
  negotiationTips: string[];
}

export const SALARY_BENCHMARKS: RoleSalaryBenchmark[] = [
  {
    id: 'hk-boy',
    roleTitle: 'Housekeeping Boy (HK Boy) & Hotel Staff',
    hindiTitle: 'हाउसकीपिंग बॉय और होटल स्टाफ',
    sector: 'Hospitality & Hotel Operations',
    category: 'HK Boy & Hotel Operations',
    description: 'Guest room sanitization, linen change, lobby buffing, chemical handling (Taski R1-R9), and hotel amenities restocking.',
    experienceLevels: {
      fresher: { min: 14000, median: 16500, max: 19000, p25: 15000, p75: 18000, p90: 20000 },
      mid: { min: 18000, median: 21500, max: 25000, p25: 19500, p75: 23000, p90: 26000 },
      experienced: { min: 23000, median: 27000, max: 32000, p25: 24500, p75: 29000, p90: 34000 },
      senior: { min: 28000, median: 34000, max: 40000, p25: 30000, p75: 36000, p90: 42000 },
    },
    cityMultipliers: {
      'Mumbai': 1.15,
      'Delhi NCR': 1.10,
      'Bengaluru': 1.12,
      'Pune': 1.0,
      'Hyderabad': 1.0,
      'Kolkata': 0.92,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.88,
    },
    typicalPerks: ['Free Duty Meals (2 meals/shift)', 'Shared Staff Accommodation', 'PF + ESIC', 'Overtime Bonus ₹100-140/hr', 'Uniform Provided'],
    salaryDrivers: [
      { skillOrCert: 'Prior 4-Star or 5-Star Hotel Experience', boostAmount: '+₹3,000 - ₹4,500 / month' },
      { skillOrCert: 'Rotary Floor Scrubber & High-Pressure Jet Operations', boostAmount: '+₹2,000 / month' },
      { skillOrCert: 'Conversational English for Luxury Guest Interaction', boostAmount: '+₹2,500 / month' },
    ],
    negotiationTips: [
      'If the basic salary offered is fixed, ask for guaranteed free accommodation or duty meal allowance (worth ₹4,000/mo).',
      'Clarify overtime rates: standard hotel norms provide 1.25x to 1.5x hourly pay for peak banquet hours.',
      'Highlight punctuality record and zero guest complaint history from your previous hotel/guest house.',
    ],
  },
  {
    id: 'bms-operator',
    roleTitle: 'BMS Operator (Building Management System)',
    hindiTitle: 'बीएमएस ऑपरेटर (बिल्डिंग मैनेजमेंट सिस्टम)',
    sector: 'Technical, Maintenance & MST',
    category: 'BMS Operator',
    description: 'Monitoring Honeywell, Johnson Controls or Schneider BMS SCADA screens, HVAC chillers, AHUs, fire alarm panels, and electrical loads.',
    experienceLevels: {
      fresher: { min: 20000, median: 23500, max: 27000, p25: 21500, p75: 25000, p90: 28000 },
      mid: { min: 26000, median: 31000, max: 37000, p25: 28000, p75: 34000, p90: 39000 },
      experienced: { min: 34000, median: 40000, max: 48000, p25: 36500, p75: 44000, p90: 52000 },
      senior: { min: 45000, median: 55000, max: 68000, p25: 48000, p75: 60000, p90: 72000 },
    },
    cityMultipliers: {
      'Mumbai': 1.15,
      'Delhi NCR': 1.10,
      'Bengaluru': 1.20,
      'Pune': 1.02,
      'Hyderabad': 1.05,
      'Kolkata': 0.90,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.85,
    },
    typicalPerks: ['Night Shift Allowance (₹150-250/shift)', 'Cab Transportation', 'Medical Insurance ₹3-5 Lakhs', 'PF + Gratuity'],
    salaryDrivers: [
      { skillOrCert: 'Honeywell / Johnson Controls / Tridium Niagara Certified', boostAmount: '+₹5,000 - ₹8,000 / month' },
      { skillOrCert: 'Diploma in Electrical or Mechanical Engineering', boostAmount: '+₹4,000 / month' },
      { skillOrCert: 'Energy Optimization MIS Report Preparation (Excel)', boostAmount: '+₹3,000 / month' },
    ],
    negotiationTips: [
      'Show examples of how your previous prompt HVAC adjustments prevented chiller breakdowns or saved power units.',
      'Request night shift allowances and travel reimbursement if rotational shifts are required.',
      'Propose a 6-month review hike upon mastering the site-specific PLC control mapping.',
    ],
  },
  {
    id: 'mst-technician',
    roleTitle: 'MST Maintenance Team (Multi-Skilled Technician)',
    hindiTitle: 'एमएसटी मल्टी-स्किल्ड मेंटेनेंस तकनीशियन',
    sector: 'Technical, Maintenance & MST',
    category: 'MST Maintenance Team',
    description: 'Commercial facility repairs spanning electrical fixtures, plumbing, AHU filter cleaning, DG power backup, and general carpentry.',
    experienceLevels: {
      fresher: { min: 16000, median: 19000, max: 22000, p25: 17500, p75: 20500, p90: 23000 },
      mid: { min: 22000, median: 26000, max: 31000, p25: 23500, p75: 28500, p90: 33000 },
      experienced: { min: 28000, median: 33500, max: 40000, p25: 30000, p75: 36500, p90: 42000 },
      senior: { min: 36000, median: 43000, max: 52000, p25: 38500, p75: 47000, p90: 55000 },
    },
    cityMultipliers: {
      'Mumbai': 1.12,
      'Delhi NCR': 1.10,
      'Bengaluru': 1.15,
      'Pune': 1.0,
      'Hyderabad': 1.0,
      'Kolkata': 0.90,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.86,
    },
    typicalPerks: ['Safety Shoes & Tool Kit Allowance', 'PF + ESI Coverage', 'Diwali Bonus', 'Overtime Compensation'],
    salaryDrivers: [
      { skillOrCert: 'PWD Wireman Electrical License (Grade I / II)', boostAmount: '+₹3,500 - ₹5,000 / month' },
      { skillOrCert: 'Commercial Chiller & HVAC Maintenance Experience', boostAmount: '+₹3,000 / month' },
      { skillOrCert: 'ITI Electrical / Fitter Trade Certificate', boostAmount: '+₹2,500 / month' },
    ],
    negotiationTips: [
      'Emphasize your multi-trade versatility: being able to handle both electrical panels and plumbing saves the client from hiring separate contractors.',
      'Showcase your safety certifications and zero-accident history.',
      'Ask about safety gear allowances and tools maintenance allowance if you carry personal tools.',
    ],
  },
  {
    id: 'pantry-boy',
    roleTitle: 'Pantry Boy & Office Boy',
    hindiTitle: 'पैंट्री बॉय और ऑफिस बॉय',
    sector: 'Hospitality & Hotel Operations',
    category: 'Pantry Boy',
    description: 'Serving tea/coffee, snacks, managing beverage dispensers, sanitizing executive meeting rooms, and office document errands.',
    experienceLevels: {
      fresher: { min: 13000, median: 15500, max: 18000, p25: 14000, p75: 17000, p90: 19000 },
      mid: { min: 16500, median: 19500, max: 23000, p25: 18000, p75: 21000, p90: 24000 },
      experienced: { min: 20000, median: 24000, max: 28000, p25: 21500, p75: 26000, p90: 30000 },
      senior: { min: 24000, median: 28000, max: 34000, p25: 25500, p75: 30500, p90: 36000 },
    },
    cityMultipliers: {
      'Mumbai': 1.12,
      'Delhi NCR': 1.10,
      'Bengaluru': 1.10,
      'Pune': 0.98,
      'Hyderabad': 0.98,
      'Kolkata': 0.90,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.85,
    },
    typicalPerks: ['Day Shift Only (9 AM - 6 PM)', 'Fixed Sunday Off', 'Free Office Lunch / Snacks', 'Festival Gift Bonus'],
    salaryDrivers: [
      { skillOrCert: 'Corporate Grooming & Polished Serving Manners', boostAmount: '+₹2,000 / month' },
      { skillOrCert: 'Automated Bean-to-Cup Espresso Machine Operations', boostAmount: '+₹1,500 / month' },
      { skillOrCert: 'Basic Photocopying & Courier Entry Knowledge', boostAmount: '+₹1,500 / month' },
    ],
    negotiationTips: [
      'Corporate MNCs value hygiene, cleanliness, and discretion. Mention past experience serving Senior Directors.',
      'Negotiate for fixed daytime shifts and travel expense reimbursement.',
    ],
  },
  {
    id: 'delivery-rider',
    roleTitle: 'Delivery Staff / Rider (Bike / EV)',
    hindiTitle: 'डिलीवरी स्टाफ और राइडर',
    sector: 'Logistics & Delivery Staff',
    category: 'Delivery Staff',
    description: 'Hyperlocal package, food, and e-commerce parcel pickup, GPS route navigation, OTP verification, and cash-on-delivery handling.',
    experienceLevels: {
      fresher: { min: 17000, median: 21000, max: 26000, p25: 18500, p75: 23500, p90: 28000 },
      mid: { min: 22000, median: 26500, max: 33000, p25: 24000, p75: 29500, p90: 35000 },
      experienced: { min: 28000, median: 33000, max: 40000, p25: 30000, p75: 36000, p90: 42000 },
      senior: { min: 34000, median: 40000, max: 48000, p25: 36500, p75: 44000, p90: 50000 },
    },
    cityMultipliers: {
      'Mumbai': 1.15,
      'Delhi NCR': 1.12,
      'Bengaluru': 1.18,
      'Pune': 1.0,
      'Hyderabad': 1.0,
      'Kolkata': 0.92,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.88,
    },
    typicalPerks: ['Fuel Allowance (₹3.5 - ₹4.5/km)', 'Daily / Weekly Payouts', 'Accidental Insurance ₹5 Lakhs', 'Rain/Peak Hours Surge Bonus'],
    salaryDrivers: [
      { skillOrCert: 'Own Two-Wheeler with Valid Commercial Insurance', boostAmount: '+₹3,000 / month (Vehicle rental saved)' },
      { skillOrCert: 'Thorough Neighborhood Street & Pincode Knowledge', boostAmount: '+₹2,500 / month (Faster delivery throughput)' },
      { skillOrCert: 'EV Driving & Battery Swapping Station Handling', boostAmount: '+₹2,000 / month' },
    ],
    negotiationTips: [
      'Inquire whether payout is fixed base + per order, or strictly commission. Fixed base offers higher stability.',
      'Confirm if fuel, phone data recharge, and accidental insurance are included.',
    ],
  },
  {
    id: 'loading-unloading',
    roleTitle: 'Loading & Unloading Man / Warehouse Porter',
    hindiTitle: 'लोडिंग-अनलोडिंग मैन और वेयरहाउस हेल्पर',
    sector: 'Logistics & Delivery Staff',
    category: 'Loading Unloading Man',
    description: 'Cargo truck unstacking, wooden pallet consolidation, manual hydraulic trolley operation, and barcode carton sorting.',
    experienceLevels: {
      fresher: { min: 14000, median: 16500, max: 19500, p25: 15000, p75: 18000, p90: 21000 },
      mid: { min: 17500, median: 20500, max: 24500, p25: 19000, p75: 22500, p90: 26000 },
      experienced: { min: 21000, median: 25000, max: 30000, p25: 22500, p75: 27500, p90: 32000 },
      senior: { min: 26000, median: 31000, max: 37000, p25: 28000, p75: 34000, p90: 39000 },
    },
    cityMultipliers: {
      'Mumbai (Bhiwandi/Panvel)': 1.15,
      'Delhi NCR (Faridabad/Bilaspur)': 1.12,
      'Bengaluru (Hosur/Nelamangala)': 1.12,
      'Pune (Chakan)': 1.05,
      'Hyderabad': 1.0,
      'Kolkata': 0.90,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.88,
    },
    typicalPerks: ['Per-Box Loading Incentive', 'Free Shared Dormitory', 'Subsidized Canteen', 'Safety Boots & Back Belts'],
    salaryDrivers: [
      { skillOrCert: 'Barcode Handheld Scanner (HHT / PDA) Operating Skills', boostAmount: '+₹2,500 / month' },
      { skillOrCert: 'Forklift / Battery Operated Stacker (BOPT) License', boostAmount: '+₹4,000 - ₹6,000 / month' },
      { skillOrCert: 'Heavy Cargo Palletizing & Shrink Wrap Packing', boostAmount: '+₹2,000 / month' },
    ],
    negotiationTips: [
      'In warehouse hubs, logistics companies pay heavy incentives during festive e-commerce sales. Ask for guaranteed box incentives.',
      'Check if safety boots, gloves, and dormitory accommodation are provided free of cost.',
    ],
  },
  {
    id: 'lady-receptionist',
    roleTitle: 'Lady Staff / Front Desk Receptionist',
    hindiTitle: 'लेडी स्टाफ / फ्रंट डेस्क रिसेप्शनिस्ट',
    sector: 'Corporate, Reception & Lady Staff',
    category: 'Lady Staff Receptionist',
    description: 'Visitor greeting, incoming call management, calendar scheduling, clinic/office billing, and conference room hospitality.',
    experienceLevels: {
      fresher: { min: 18000, median: 22000, max: 26000, p25: 19500, p75: 24000, p90: 28000 },
      mid: { min: 24000, median: 28500, max: 35000, p25: 26000, p75: 32000, p90: 37000 },
      experienced: { min: 32000, median: 38000, max: 46000, p25: 34500, p75: 42000, p90: 50000 },
      senior: { min: 40000, median: 48000, max: 60000, p25: 43000, p75: 54000, p90: 65000 },
    },
    cityMultipliers: {
      'Mumbai': 1.18,
      'Delhi NCR': 1.15,
      'Bengaluru': 1.18,
      'Pune': 1.05,
      'Hyderabad': 1.05,
      'Kolkata': 0.92,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.88,
    },
    typicalPerks: ['Fixed Day Shifts (No Night Travel)', 'Healthcare Discounts', 'Performance Incentives', 'Professional Development'],
    salaryDrivers: [
      { skillOrCert: 'Fluent English, Hindi & Regional Multilingual Fluency', boostAmount: '+₹3,500 / month' },
      { skillOrCert: 'Hospital / Clinic Management Software (Practo / HMS / ERP)', boostAmount: '+₹3,000 / month' },
      { skillOrCert: 'Typing Speed 40+ WPM & Professional Email Correspondence', boostAmount: '+₹2,500 / month' },
    ],
    negotiationTips: [
      'Emphasize your professional telephone etiquette and conflict resolution skills with visiting clients/patients.',
      'Inquire about transport pick-and-drop or travel allowances for early morning clinic opening shifts.',
    ],
  },
  {
    id: 'senior-accountant',
    roleTitle: 'Senior Accountant (Tally Prime, GST, TDS & BRS)',
    hindiTitle: 'अकाउंटेंट (टैली प्राइम, जीएसटी और टीडीएस)',
    sector: 'Accounts, Finance & Billing',
    category: 'Accountant',
    description: 'Day-to-day voucher punching, bank reconciliation (BRS), GSTR-1 & 3B return preparation, TDS deduction calculations, and audit coordination.',
    experienceLevels: {
      fresher: { min: 18000, median: 22000, max: 26000, p25: 20000, p75: 24500, p90: 28000 },
      mid: { min: 26000, median: 32000, max: 39000, p25: 28500, p75: 36000, p90: 42000 },
      experienced: { min: 36000, median: 45000, max: 56000, p25: 40000, p75: 50000, p90: 60000 },
      senior: { min: 50000, median: 65000, max: 85000, p25: 56000, p75: 74000, p90: 90000 },
    },
    cityMultipliers: {
      'Mumbai': 1.20,
      'Delhi NCR': 1.15,
      'Bengaluru': 1.15,
      'Pune': 1.05,
      'Hyderabad': 1.05,
      'Kolkata': 0.92,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.88,
    },
    typicalPerks: ['Annual Bonus (1-2 Months CTC)', 'Paid Leave / CL / PL', 'Saturday Alternate Half-Days', 'Medical Coverage'],
    salaryDrivers: [
      { skillOrCert: 'End-to-End GST Return Filing & Notice Handling', boostAmount: '+₹6,000 - ₹9,000 / month' },
      { skillOrCert: 'Advanced Excel (VLOOKUP, Pivot, INDEX/MATCH, Macro)', boostAmount: '+₹4,000 / month' },
      { skillOrCert: 'Statutory Audit & Tax Audit Assistance Experience', boostAmount: '+₹5,000 / month' },
    ],
    negotiationTips: [
      'Accountants who save tax penalties through timely reconciliation can command top percentiles. Share examples of past discrepancy catches.',
      'Ask for year-end audit completion bonuses or performance increments.',
    ],
  },
  {
    id: 'mis-executive',
    roleTitle: 'MIS Executive & Back Office Operations',
    hindiTitle: 'एमआईएस एग्जीक्यूटिव और बैक ऑफिस',
    sector: 'Back Office & MIS Operations',
    category: 'MIS & Back Office',
    description: 'Consolidating retail store/supply chain reports, automated Excel dashboards, data entry validation, and operations KPI updates.',
    experienceLevels: {
      fresher: { min: 17000, median: 21000, max: 25000, p25: 19000, p75: 23000, p90: 27000 },
      mid: { min: 24000, median: 29000, max: 36000, p25: 26500, p75: 33000, p90: 38000 },
      experienced: { min: 32000, median: 40000, max: 50000, p25: 35000, p75: 45000, p90: 54000 },
      senior: { min: 45000, median: 58000, max: 72000, p25: 50000, p75: 65000, p90: 78000 },
    },
    cityMultipliers: {
      'Mumbai': 1.15,
      'Delhi NCR': 1.12,
      'Bengaluru': 1.15,
      'Pune': 1.02,
      'Hyderabad': 1.02,
      'Kolkata': 0.90,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.86,
    },
    typicalPerks: ['Subsidized Commute Bus', 'Work From Home Hybrid Flexibility', 'Group Medical Insurance', 'Performance Incentives'],
    salaryDrivers: [
      { skillOrCert: 'Power BI or Tableau Interactive Dashboard Building', boostAmount: '+₹6,000 - ₹10,000 / month' },
      { skillOrCert: 'VBA / Excel Macros for Automated One-Click Reporting', boostAmount: '+₹4,500 / month' },
      { skillOrCert: 'SQL Database Querying Knowledge', boostAmount: '+₹5,000 / month' },
    ],
    negotiationTips: [
      'Demonstrate how your automated templates cut down report generation time from 3 hours to 10 minutes.',
      'Negotiate hybrid 2-day work-from-home options to reduce commute expenses.',
    ],
  },
  {
    id: 'bpo-telecaller',
    roleTitle: 'Call Center Executive / BPO Telecaller',
    hindiTitle: 'कॉल सेंटर एग्जीक्यूटिव और टेलीकॉलर',
    sector: 'BPO & Call Center (Telecaller)',
    category: 'Call Center & BPO',
    description: 'Inbound customer inquiry resolution, outbound lead generation, domestic banking/e-commerce campaigns, and CRM ticket logging.',
    experienceLevels: {
      fresher: { min: 16000, median: 19500, max: 24000, p25: 17500, p75: 22000, p90: 25500 },
      mid: { min: 21000, median: 26000, max: 32000, p25: 23500, p75: 29000, p90: 34000 },
      experienced: { min: 28000, median: 35000, max: 44000, p25: 31000, p75: 39500, p90: 48000 },
      senior: { min: 38000, median: 48000, max: 62000, p25: 42000, p75: 54000, p90: 68000 },
    },
    cityMultipliers: {
      'Mumbai': 1.12,
      'Delhi NCR': 1.12,
      'Bengaluru': 1.15,
      'Pune': 1.05,
      'Hyderabad': 1.05,
      'Kolkata': 0.92,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.88,
    },
    typicalPerks: ['Monthly Sales Incentives (₹5,000 - ₹15,000+ extra)', 'Both-way Company Cab Drop', 'PF + Medical Insurance', 'Cafeteria & Game Room'],
    salaryDrivers: [
      { skillOrCert: 'Fluent Inbound Voice English Accent & Neutral Hindi', boostAmount: '+₹4,000 - ₹6,000 / month' },
      { skillOrCert: 'BFSI / Loan / Credit Card Tele-Sales Conversion Track Record', boostAmount: '+₹5,000 / month' },
      { skillOrCert: 'International BPO Night Shift Readiness', boostAmount: '+₹6,000 - ₹9,000 / month' },
    ],
    negotiationTips: [
      'In sales campaigns, ask about target slabs and average monthly incentive payouts of the current top quartile performers.',
      'Confirm whether cab drop facility is door-to-door for night shifts.',
    ],
  },
  {
    id: 'it-support',
    roleTitle: 'IT Support & Desktop Maintenance Engineer',
    hindiTitle: 'आईटी सपोर्ट और डेस्कटॉप इंजीनियर',
    sector: 'Information Technology & Software',
    category: 'IT Sector & Support',
    description: 'Hardware configuration, Windows/Mac OS troubleshooting, office Wi-Fi routers, LAN crimping, printer drivers, and Office 365 administration.',
    experienceLevels: {
      fresher: { min: 20000, median: 24000, max: 28000, p25: 21500, p75: 26000, p90: 30000 },
      mid: { min: 26000, median: 32000, max: 40000, p25: 29000, p75: 36000, p90: 43000 },
      experienced: { min: 36000, median: 45000, max: 56000, p25: 40000, p75: 50000, p90: 62000 },
      senior: { min: 50000, median: 65000, max: 80000, p25: 55000, p75: 72000, p90: 88000 },
    },
    cityMultipliers: {
      'Mumbai': 1.15,
      'Delhi NCR': 1.15,
      'Bengaluru': 1.25,
      'Pune': 1.10,
      'Hyderabad': 1.15,
      'Kolkata': 0.92,
      'Tier-2 Cities (Jaipur/Lucknow/Ahmedabad)': 0.88,
    },
    typicalPerks: ['Annual IT Certification Reimbursement', 'Flexible Work Atmosphere', 'Medical Cover ₹4 Lakhs', 'Paid Leave'],
    salaryDrivers: [
      { skillOrCert: 'CCNA / CompTIA Network+ / Cloud AWS Foundational Cert', boostAmount: '+₹5,000 - ₹8,000 / month' },
      { skillOrCert: 'Google Workspace & Azure Active Directory (AAD) Admin', boostAmount: '+₹4,500 / month' },
      { skillOrCert: 'Firewall & VPN Routing Configuration (Fortinet/Sophos)', boostAmount: '+₹5,000 / month' },
    ],
    negotiationTips: [
      'Mention your First Call Resolution (FCR) rate and fast ticket closure speed.',
      'Ask for certification sponsor vouchers as part of your annual employment contract.',
    ],
  },
];
