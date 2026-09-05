import { Complaint, ComplaintStatus, ProblemCluster } from "../types";
import { JHARKHAND_DISTRICTS } from "./districts";

export const SAMPLE_OFFICERS = [
  { id: "off-1", name: "Er. Rajesh Kumar Sharma", department: "Drinking Water & Sanitation Department (DWSD)", role: "Executive Engineer", district: "Ranchi" },
  { id: "off-2", name: "Er. Amitesh Verma", department: "Jharkhand Bijli Vitran Nigam Ltd (JBVNL)", role: "Assistant Electrical Engineer", district: "Bokaro" },
  { id: "off-3", name: "Smt. Priyanka Soren", department: "Road Construction Department (RCD) / Rural Development", role: "Sub-Divisional Officer", district: "Dhanbad" },
  { id: "off-4", name: "Dr. Alok Nath Mukherjee", department: "Health, Medical Education & Family Welfare", role: "Civil Surgeon / Medical Officer", district: "East Singhbhum" },
  { id: "off-5", name: "Shri Manoj Tirkey", department: "Welfare Department / Higher & Technical Education", role: "District Welfare Officer", district: "Hazaribagh" },
  { id: "off-6", name: "Smt. Sunita Devi", department: "Department of Social Welfare & Social Security", role: "District Social Security Officer", district: "Latehar" },
  { id: "off-7", name: "Shri Sandeep Kispotta", department: "Food, Public Distribution & Consumer Affairs", role: "District Supply Officer", district: "Giridih" },
  { id: "off-8", name: "Er. Vinod Kumar Sinha", department: "Urban Local Bodies / Swachh Bharat Mission (Gramin)", role: "Sanitary Inspector", district: "West Singhbhum" },
];

export const INITIAL_CLUSTERS: ProblemCluster[] = [
  {
    id: "cluster-water-latehar",
    title: "Groundwater Depletion & Handpump Crisis",
    category: "Water Supply",
    district: "Latehar",
    block: "Latehar Sadar",
    village: "Sasang",
    coordinates: { lat: 23.7438, lng: 84.5029 },
    complaintCount: 31,
    severity: "High",
    growthTrend: "+42% this week",
    department: "Drinking Water & Sanitation Department (DWSD)",
    complaintIds: ["JSV-2026-00101", "JSV-2026-00102", "JSV-2026-00103", "JSV-2026-00104", "JSV-2026-00105"],
    statusBreakdown: { pending: 18, inProgress: 10, resolved: 3 },
    averageResolutionDays: 4.8,
    lastUpdated: "2026-09-02T14:30:00Z",
  },
  {
    id: "cluster-light-bokaro",
    title: "Chas Sector-4 Main Road Street Light Outage",
    category: "Electricity",
    district: "Bokaro",
    block: "Chas",
    village: "Kura",
    coordinates: { lat: 23.6693, lng: 86.1511 },
    complaintCount: 24,
    severity: "Medium",
    growthTrend: "+28% this week",
    department: "Jharkhand Bijli Vitran Nigam Ltd (JBVNL)",
    complaintIds: ["JSV-2026-00120", "JSV-2026-00121", "JSV-2026-00122", "JSV-2026-00123"],
    statusBreakdown: { pending: 12, inProgress: 8, resolved: 4 },
    averageResolutionDays: 2.1,
    lastUpdated: "2026-09-03T08:15:00Z",
  },
  {
    id: "cluster-scholarship-hazaribagh",
    title: "Vinoba Bhave Univ e-Kalyan Verification Delay",
    category: "Scholarship & Student Aid",
    district: "Hazaribagh",
    block: "Sadar Hazaribagh",
    village: "Matwari",
    coordinates: { lat: 23.9966, lng: 85.3644 },
    complaintCount: 42,
    severity: "High",
    growthTrend: "+55% this week",
    department: "Welfare Department / Higher & Technical Education",
    complaintIds: ["JSV-2026-00140", "JSV-2026-00141", "JSV-2026-00142", "JSV-2026-00143"],
    statusBreakdown: { pending: 25, inProgress: 14, resolved: 3 },
    averageResolutionDays: 6.5,
    lastUpdated: "2026-09-03T10:00:00Z",
  },
  {
    id: "cluster-road-dhanbad",
    title: "Jharia Coal Belt Road Pothole & Caving Zone",
    category: "Roads & Bridges",
    district: "Dhanbad",
    block: "Jharia",
    village: "Lodna",
    coordinates: { lat: 23.7457, lng: 86.4150 },
    complaintCount: 19,
    severity: "Critical",
    growthTrend: "+15% this week",
    department: "Road Construction Department (RCD) / Rural Development",
    complaintIds: ["JSV-2026-00160", "JSV-2026-00161", "JSV-2026-00162"],
    statusBreakdown: { pending: 9, inProgress: 7, resolved: 3 },
    averageResolutionDays: 5.2,
    lastUpdated: "2026-09-01T16:45:00Z",
  },
];

// Helper to generate seed complaints
function generateInitialComplaints(): Complaint[] {
  const list: Complaint[] = [];

  const baseSpecs: Complaint[] = [
    // Highlighted Demo Complaint 1 - Street Light in Bokaro
    {
      id: "JSV-2026-00427",
      citizenId: "cit-101",
      citizenName: "Rameshwar Mahato",
      citizenPhone: "9876543210",
      title: "Street light failure across main village road",
      description: "Hamare area mein street light pichle ek hafte se kharab hai. Raat ko bohot andhera rehta hai aur aane-jaane mein dar lagta hai.",
      aiSummary: "Entire main street light stretch defunct for 7+ days; safety hazard for pedestrians and commuters at night.",
      category: "Electricity",
      subcategory: "Street Light Failure",
      severity: "Medium" as const,
      severityReason: "High priority because 24 similar complaints were reported from this Chas sector area.",
      state: "Jharkhand",
      district: "Bokaro",
      block: "Chas",
      village: "Kura",
      coordinates: { lat: 23.6693, lng: 86.1511 },
      photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=60",
      createdAt: "2026-09-02T18:40:00Z",
      updatedAt: "2026-09-03T02:30:00Z",
      expectedResolutionDate: "2026-09-05",
      department: "Jharkhand Bijli Vitran Nigam Ltd (JBVNL)",
      assignedOfficerId: "off-2",
      assignedOfficerName: "Er. Amitesh Verma",
      status: "In Progress" as const,
      clusterId: "cluster-light-bokaro",
      supportersCount: 42,
      timeline: [
        { id: "t1", status: "Submitted", title: "Complaint Submitted", description: "Complaint lodged via Samadhan Didi conversational AI.", timestamp: "2026-09-02T18:40:00Z", actor: "Rameshwar Mahato", actorRole: "Citizen" },
        { id: "t2", status: "AI Classified", title: "AI Classified", description: "Classified under Electricity / Street Light Failure (Confidence: 94%).", timestamp: "2026-09-02T18:41:00Z", actor: "Samadhan Didi AI", actorRole: "AI Engine" },
        { id: "t3", status: "Assigned", title: "Department Assigned", description: "Routed to JBVNL Sub-Division Chas; assigned to Er. Amitesh Verma.", timestamp: "2026-09-02T19:00:00Z", actor: "System Routing Engine", actorRole: "Automated Router" },
        { id: "t4", status: "In Progress", title: "Officer Accepted & Team Dispatched", description: "Lineman team dispatched with replacement LED fixtures and ladder vehicle.", timestamp: "2026-09-03T02:30:00Z", actor: "Er. Amitesh Verma", actorRole: "Assistant Electrical Engineer" },
      ],
    },

    // Highlighted Demo Complaint 2 - Resolved awaiting citizen verification!
    {
      id: "JSV-2026-00412",
      citizenId: "cit-102",
      citizenName: "Anjali Kumari",
      citizenPhone: "9835123456",
      title: "Broken drinking water tap line leaking on public pathway",
      description: "Govt primary school ke bahar drinking water pipeline phoot gayi hai. Saara paani beh raha hai aur bacchon ko peene ka paani nahi mil raha.",
      aiSummary: "Main supply pipeline burst outside primary school; clean water wastage and hygiene risk for students.",
      category: "Water Supply",
      subcategory: "Pipeline Leakage / Burst",
      severity: "High" as const,
      severityReason: "Impacts drinking water supply of 220+ school students and surrounding neighborhood.",
      state: "Jharkhand",
      district: "Ranchi",
      block: "Kanke",
      village: "Sukhurhutu",
      coordinates: { lat: 23.3641, lng: 85.3200 },
      photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=600&auto=format&fit=crop&q=60",
      createdAt: "2026-08-30T10:15:00Z",
      updatedAt: "2026-09-02T16:00:00Z",
      expectedResolutionDate: "2026-09-02",
      department: "Drinking Water & Sanitation Department (DWSD)",
      assignedOfficerId: "off-1",
      assignedOfficerName: "Er. Rajesh Kumar Sharma",
      status: "Resolved" as const,
      supportersCount: 29,
      resolutionProof: {
        photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
        note: "Pipeline repaired with new HDPE joint collar and tested under full pressure. Supply restored seamlessly.",
        resolvedAt: "2026-09-02T16:00:00Z",
        officerName: "Er. Rajesh Kumar Sharma",
      },
      timeline: [
        { id: "t1", status: "Submitted", title: "Complaint Submitted", description: "Lodge by Anjali Kumari with photo evidence.", timestamp: "2026-08-30T10:15:00Z", actor: "Anjali Kumari", actorRole: "Citizen" },
        { id: "t2", status: "AI Classified", title: "AI Classified", description: "Category: Water Supply, Severity: High.", timestamp: "2026-08-30T10:16:00Z", actor: "Samadhan Didi AI", actorRole: "AI Engine" },
        { id: "t3", status: "Assigned", title: "Assigned to DWSD", description: "Assigned to Er. Rajesh Kumar Sharma.", timestamp: "2026-08-30T11:00:00Z", actor: "Auto Dispatch", actorRole: "Router" },
        { id: "t4", status: "In Progress", title: "Plumbing Crew Excavation", description: "Leak spot identified and excavated.", timestamp: "2026-09-01T09:30:00Z", actor: "Er. Rajesh Kumar Sharma", actorRole: "Executive Engineer" },
        { id: "t5", status: "Resolved", title: "Marked Resolved with Proof", description: "New HDPE collar installed. Photo uploaded.", timestamp: "2026-09-02T16:00:00Z", actor: "Er. Rajesh Kumar Sharma", actorRole: "Executive Engineer" },
      ],
    },

    // Highlighted Demo Complaint 3 - SLA Breached / Escalated
    {
      id: "JSV-2026-00388",
      citizenId: "cit-103",
      citizenName: "Budhram Munda",
      citizenPhone: "9431789012",
      title: "e-Kalyan post matric scholarship disbursement delayed over 4 months",
      description: "College mein admission liye 5 mahine ho gaye, document verification verified dikha raha hai par scholarship ka paisa bank account mein nahi aaya.",
      aiSummary: "Post-matric scholarship DBT pending after level-2 approval; risk of college debarment due to unpaid semester fee.",
      category: "Scholarship & Student Aid",
      subcategory: "e-Kalyan Disbursement Delay",
      severity: "High" as const,
      severityReason: "SLA breached by 8 days. Repeated issue affecting 42 students in Vinoba Bhave Univ zone.",
      state: "Jharkhand",
      district: "Hazaribagh",
      block: "Sadar Hazaribagh",
      village: "Matwari",
      coordinates: { lat: 23.9966, lng: 85.3644 },
      createdAt: "2026-08-15T09:20:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
      expectedResolutionDate: "2026-08-25",
      department: "Welfare Department / Higher & Technical Education",
      assignedOfficerId: "off-5",
      assignedOfficerName: "Shri Manoj Tirkey",
      status: "Escalated" as const,
      isEscalated: true,
      clusterId: "cluster-scholarship-hazaribagh",
      supportersCount: 88,
      timeline: [
        { id: "t1", status: "Submitted", title: "Complaint Submitted", description: "Lodged by student Budhram Munda.", timestamp: "2026-08-15T09:20:00Z", actor: "Budhram Munda", actorRole: "Student" },
        { id: "t2", status: "AI Classified", title: "AI Classified", description: "Education & Welfare Department routing.", timestamp: "2026-08-15T09:21:00Z", actor: "Samadhan Didi AI", actorRole: "AI Engine" },
        { id: "t3", status: "Assigned", title: "Assigned to DWO Hazaribagh", description: "Assigned to Shri Manoj Tirkey.", timestamp: "2026-08-16T10:00:00Z", actor: "System Router", actorRole: "Router" },
        { id: "t4", status: "Escalated", title: "Automatic SLA Breach Escalation", description: "Resolution deadline of 25 Aug 2026 exceeded by >7 days. Escalated to District Collectorate & State Welfare Nodal Officer.", timestamp: "2026-08-26T00:01:00Z", actor: "Automated Escalation Daemon", actorRole: "System" },
      ],
    },

    // Highlighted Demo Complaint 4 - Verified Resolved
    {
      id: "JSV-2026-00350",
      citizenId: "cit-104",
      citizenName: "Saraswati Devi",
      citizenPhone: "9771123890",
      title: "Old age pension payment stopped due to biometric mismatch",
      description: "Pichle 3 mahine se pension nahi mil rahi thi, bank wale bolte the ki biometric nahi match ho raha.",
      aiSummary: "Senior citizen pension halted due to iris/biometric mismatch; doorstep Aadhaar re-verification requested.",
      category: "Social Security & Pension",
      subcategory: "Annual Life Certificate / Biometric Failure",
      severity: "High" as const,
      severityReason: "Sole livelihood source for 68-year-old destitute widow.",
      state: "Jharkhand",
      district: "Latehar",
      block: "Latehar Sadar",
      village: "Sasang",
      coordinates: { lat: 23.7438, lng: 84.5029 },
      createdAt: "2026-08-10T11:00:00Z",
      updatedAt: "2026-08-18T15:30:00Z",
      expectedResolutionDate: "2026-08-15",
      department: "Department of Social Welfare & Social Security",
      assignedOfficerId: "off-6",
      assignedOfficerName: "Smt. Sunita Devi",
      status: "Verified" as const,
      supportersCount: 14,
      resolutionProof: {
        photoUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60",
        note: "Doorstep biometric verification conducted with handheld iris scanner. 3 months arrears (₹3,000) credited via DBT.",
        resolvedAt: "2026-08-17T14:00:00Z",
        officerName: "Smt. Sunita Devi",
      },
      citizenVerification: {
        verified: true,
        feedback: "Bohat dhanyawad Samadhan Didi aur sarkar! Block se officer ghar aaye aur meri pension chalu karwa di.",
        verifiedAt: "2026-08-18T15:30:00Z",
      },
      timeline: [
        { id: "t1", status: "Submitted", title: "Complaint Submitted", description: "Lodged via voice entry in Hindi.", timestamp: "2026-08-10T11:00:00Z", actor: "Saraswati Devi", actorRole: "Citizen" },
        { id: "t2", status: "AI Classified", title: "AI Classified", description: "Social Welfare / Pension Biometrics.", timestamp: "2026-08-10T11:01:00Z", actor: "Samadhan Didi AI", actorRole: "AI Engine" },
        { id: "t3", status: "Assigned", title: "Assigned to Block Officer", description: "Assigned to Smt. Sunita Devi.", timestamp: "2026-08-11T09:00:00Z", actor: "System Router", actorRole: "Router" },
        { id: "t4", status: "In Progress", title: "Field Visit Scheduled", description: "Doorstep iris scan biometric camp scheduled.", timestamp: "2026-08-14T10:00:00Z", actor: "Smt. Sunita Devi", actorRole: "Social Security Officer" },
        { id: "t5", status: "Resolved", title: "Arrears Credited & Marked Resolved", description: "Arrears credited and receipt uploaded.", timestamp: "2026-08-17T14:00:00Z", actor: "Smt. Sunita Devi", actorRole: "Social Security Officer" },
        { id: "t6", status: "Verified", title: "Citizen Confirmed Resolution (YES)", description: "Citizen Saraswati Devi confirmed issue is fully resolved.", timestamp: "2026-08-18T15:30:00Z", actor: "Saraswati Devi", actorRole: "Citizen" },
      ],
    },
  ];

  list.push(...baseSpecs);

  // Generate additional 105 realistic diverse complaints across 10 districts and categories
  const categoriesList = [
    { cat: "Water Supply", sub: "Handpump / Chapakal Breakdown", dept: "Drinking Water & Sanitation Department (DWSD)", sla: 3, sev: "Medium" as const },
    { cat: "Water Supply", sub: "Drinking Water Contamination", dept: "Drinking Water & Sanitation Department (DWSD)", sla: 2, sev: "Critical" as const },
    { cat: "Electricity", sub: "Transformer Burnout / Failure", dept: "Jharkhand Bijli Vitran Nigam Ltd (JBVNL)", sla: 2, sev: "Critical" as const },
    { cat: "Electricity", sub: "Street Light Failure", dept: "Jharkhand Bijli Vitran Nigam Ltd (JBVNL)", sla: 2, sev: "Medium" as const },
    { cat: "Roads & Bridges", sub: "Severe Potholes & Road Damage", dept: "Road Construction Department (RCD) / Rural Development", sla: 7, sev: "High" as const },
    { cat: "Roads & Bridges", sub: "Missing Manhole Cover", dept: "Road Construction Department (RCD) / Rural Development", sla: 1, sev: "Critical" as const },
    { cat: "Sanitation & Waste", sub: "Garbage Pile Overflow", dept: "Urban Local Bodies / Swachh Bharat Mission (Gramin)", sla: 2, sev: "High" as const },
    { cat: "Sanitation & Waste", sub: "Open Drain Overflow & Clogging", dept: "Urban Local Bodies / Swachh Bharat Mission (Gramin)", sla: 2, sev: "High" as const },
    { cat: "Scholarship & Student Aid", sub: "e-Kalyan Disbursement Delay", dept: "Welfare Department / Higher & Technical Education", sla: 5, sev: "High" as const },
    { cat: "Social Security & Pension", sub: "Old Age Pension Payment Stopped", dept: "Department of Social Welfare & Social Security", sla: 5, sev: "High" as const },
    { cat: "PDS & Food Security", sub: "Ration Dealer Refusal / Less Quantity", dept: "Food, Public Distribution & Consumer Affairs", sla: 3, sev: "High" as const },
    { cat: "Health & Medical Services", sub: "Doctor / Staff Absenteeism in PHC/CHC", dept: "Health, Medical Education & Family Welfare", sla: 1, sev: "Critical" as const },
    { cat: "Health & Medical Services", sub: "Essential Medicine Stock-Out", dept: "Health, Medical Education & Family Welfare", sla: 2, sev: "High" as const },
    { cat: "Agriculture & Farmers", sub: "PM-KISAN Instalment Delay", dept: "Agriculture, Animal Husbandry & Co-operative Department", sla: 5, sev: "Medium" as const },
    { cat: "Agriculture & Farmers", sub: "Fertilizer / Seed Black Marketing", dept: "Agriculture, Animal Husbandry & Co-operative Department", sla: 3, sev: "High" as const },
    { cat: "Government Schemes", sub: "PM Awas Yojana Instalment Delay", dept: "Planning & Development Department", sla: 5, sev: "High" as const },
    { cat: "Anganwadi & Child Welfare", sub: "Anganwadi Center Locked / Sewika Absent", dept: "Women, Child Development & Social Security", sla: 3, sev: "High" as const },
    { cat: "Public Infrastructure & Civic Assets", sub: "Panchayat Bhavan Dilapidated Condition", dept: "Urban Development & Housing Department", sla: 6, sev: "Medium" as const },
    { cat: "Environment & Pollution", sub: "Industrial Air / Coal Dust Pollution", dept: "Jharkhand State Pollution Control Board (JSPCB) / Forest", sla: 4, sev: "High" as const },
  ];

  const firstNames = ["Rajesh", "Pooja", "Vikram", "Sunita", "Amit", "Manish", "Kavita", "Sanjay", "Deepak", "Aarti", "Mukesh", "Anita", "Santosh", "Neelam", "Ajay", "Babita", "Rahul", "Shanti", "Gopal", "Urmila"];
  const lastNames = ["Mahato", "Munda", "Oraon", "Tirkey", "Sahu", "Singh", "Yadav", "Verma", "Kumari", "Devi", "Prasad", "Baski", "Kerketta", "Hansda", "Gupta", "Murmu", "Sharma"];

  const statuses: ComplaintStatus[] = [
    "Submitted",
    "Assigned",
    "In Progress",
    "In Progress",
    "Escalated",
    "Resolved",
    "Verified",
  ];

  let idCounter = 100;

  for (let i = 0; i < 105; i++) {
    const distInfo = JHARKHAND_DISTRICTS[i % JHARKHAND_DISTRICTS.length];
    const blockInfo = distInfo.blocks[i % distInfo.blocks.length];
    const village = blockInfo.villages[i % blockInfo.villages.length];
    const catInfo = categoriesList[i % categoriesList.length];
    const status: ComplaintStatus = statuses[i % statuses.length];
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const citizenName = `${fn} ${ln}`;
    const id = `JSV-2026-00${idCounter++}`;

    // slight coord offset for realistic dispersion
    const latOffset = ((i * 17) % 50 - 25) * 0.003;
    const lngOffset = ((i * 29) % 50 - 25) * 0.003;

    const daysAgo = (i % 25) + 1;
    const createdDate = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
    const expDate = new Date(createdDate.getTime() + catInfo.sla * 24 * 3600 * 1000);

    const isResolvedOrVerified = status === "Resolved" || status === "Verified";
    const isBreached = status === "Escalated" || (Date.now() > expDate.getTime() && !isResolvedOrVerified);
    const finalStatus: ComplaintStatus = isBreached && !isResolvedOrVerified ? "Escalated" : status;

    list.push({
      id,
      citizenId: `cit-${200 + i}`,
      citizenName,
      citizenPhone: `98${(35000000 + i * 1357).toString().slice(0, 8)}`,
      title: `${catInfo.sub} at ${village}, ${blockInfo.name}`,
      description: `Hamare gaon ${village} mein ${catInfo.sub.toLowerCase()} ki samasya hai. Kirpaya jaldi karwayi karein.`,
      aiSummary: `Issue reported concerning ${catInfo.sub.toLowerCase()} in ${village}, Block ${blockInfo.name}, District ${distInfo.name}.`,
      category: catInfo.cat,
      subcategory: catInfo.sub,
      severity: isBreached ? "Critical" : catInfo.sev,
      severityReason: isBreached ? "SLA deadline exceeded. Elevated to critical priority." : `Classified based on impact on local residents in ${blockInfo.name}.`,
      state: "Jharkhand",
      district: distInfo.name,
      block: blockInfo.name,
      village,
      coordinates: {
        lat: distInfo.coordinates.lat + latOffset,
        lng: distInfo.coordinates.lng + lngOffset,
      },
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + 3600 * 1000 * 4).toISOString(),
      expectedResolutionDate: expDate.toISOString().split("T")[0],
      department: catInfo.dept,
      assignedOfficerId: SAMPLE_OFFICERS[i % SAMPLE_OFFICERS.length].id,
      assignedOfficerName: SAMPLE_OFFICERS[i % SAMPLE_OFFICERS.length].name,
      status: finalStatus,
      isEscalated: isBreached && !isResolvedOrVerified,
      supportersCount: 5 + ((i * 7) % 65),
      timeline: [
        {
          id: `t1-${id}`,
          status: "Submitted",
          title: "Complaint Registered",
          description: `Lodged by citizen ${citizenName}.`,
          timestamp: createdDate.toISOString(),
          actor: citizenName,
          actorRole: "Citizen",
        },
        {
          id: `t2-${id}`,
          status: "AI Classified",
          title: "AI Analysis Complete",
          description: `Assigned to ${catInfo.dept}.`,
          timestamp: new Date(createdDate.getTime() + 60000).toISOString(),
          actor: "Samadhan Didi AI",
          actorRole: "AI Engine",
        },
      ],
    });
  }

  return list;
}

export const INITIAL_COMPLAINTS: Complaint[] = generateInitialComplaints();
