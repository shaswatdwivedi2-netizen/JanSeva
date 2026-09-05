export interface DistrictInfo {
  name: string;
  hindiName: string;
  headquarters: string;
  coordinates: { lat: number; lng: number };
  blocks: {
    name: string;
    villages: string[];
  }[];
}

export const JHARKHAND_DISTRICTS: DistrictInfo[] = [
  {
    name: "Ranchi",
    hindiName: "राँची",
    headquarters: "Ranchi",
    coordinates: { lat: 23.3441, lng: 85.3096 },
    blocks: [
      { name: "Kanke", villages: ["Sukhurhutu", "Pithoria", "Boreya", "Arsande", "Choreya"] },
      { name: "Namkum", villages: ["Tatisilwai", "Rajaulatu", "Lali", "Sidroll", "Kupant"] },
      { name: "Ratu", villages: ["Pundag", "Simliya", "Tigra", "Bajra", "Kathitand"] },
      { name: "Ormanjhi", villages: ["Dungra", "Irba", "Gagari", "Kuchu", "Dhurwa"] },
      { name: "Mandar", villages: ["Bisrampur", "Karge", "Baghima", "Brambe"] },
      { name: "Bundu", villages: ["Barahatu", "Hapad", "Edalhatu", "Reladih"] },
    ],
  },
  {
    name: "Bokaro",
    hindiName: "बोकारो",
    headquarters: "Bokaro Steel City",
    coordinates: { lat: 23.6693, lng: 86.1511 },
    blocks: [
      { name: "Chas", villages: ["Kura", "Kandra", "Bhatua", "Pupunkee", "Pindrajora"] },
      { name: "Bermo", villages: ["Phusro", "Jarangdih", "Bhandaridah", "Dhori"] },
      { name: "Chandankiyari", villages: ["Batbinor", "Silfor", "Amlabad", "Bhojudih"] },
      { name: "Gumia", villages: ["Pichhri", "Hosir", "IEL Colony", "Lalpania"] },
      { name: "Jaridih", villages: ["Jainamore", "Tand Balidih", "Tupra", "Khetko"] },
    ],
  },
  {
    name: "Dhanbad",
    hindiName: "धनबाद",
    headquarters: "Dhanbad",
    coordinates: { lat: 23.7957, lng: 86.4304 },
    blocks: [
      { name: "Dhanbad Sadar", villages: ["Saraidhela", "Kusunda", "Bhuli", "Godhar", "Manaitand"] },
      { name: "Jharia", villages: ["Lodna", "Bhowra", "Tisra", "Bhaga", "Pathardih"] },
      { name: "Baghmara", villages: ["Katras", "Kharkharee", "Madhuban", "Barora"] },
      { name: "Govindpur", villages: ["Bagsumba", "Nagarmukhi", "Saharpura", "Kharkabad"] },
      { name: "Nirsa", villages: ["Chirkunda", "Mugma", "Kumardhubi", "Pandra"] },
    ],
  },
  {
    name: "East Singhbhum",
    hindiName: "पूर्वी सिंहभूम",
    headquarters: "Jamshedpur",
    coordinates: { lat: 22.8046, lng: 86.2029 },
    blocks: [
      { name: "Golmuri-cum-Jugsalai", villages: ["Bagbera", "Parsudih", "Karandih", "Gadhra"] },
      { name: "Ghatshila", villages: ["Moubhandar", "Dharambandh", "Kashida", "Rajstate"] },
      { name: "Potka", villages: ["Haldipokhar", "Kowali", "Jaduguda", "Sankh"] },
      { name: "Chakulia", villages: ["Bara Bambo", "Kendu", "Shampur", "Matiabandi"] },
      { name: "Baharagora", villages: ["Gamharia", "Kumardubi", "Chirasol", "Barasol"] },
    ],
  },
  {
    name: "West Singhbhum",
    hindiName: "पश्चिमी सिंहभूम",
    headquarters: "Chaibasa",
    coordinates: { lat: 22.5539, lng: 85.8087 },
    blocks: [
      { name: "Chaibasa Sadar", villages: ["Tambu", "Nimdih", "Pandarposi", "Gitilpi"] },
      { name: "Chakradharpur", villages: ["Toklo", "Bhartia", "Chainpur", "Potka"] },
      { name: "Jhinkpani", villages: ["Bara Jhinkpani", "Matkamhatu", "Choya"] },
      { name: "Noamundi", villages: ["Kiriburu", "Meghahatuburu", "Gua", "Bara Jamda"] },
      { name: "Manoharpur", villages: ["Anandpur", "Chiria", "Posoita", "Koilasuta"] },
    ],
  },
  {
    name: "Latehar",
    hindiName: "लातेहार",
    headquarters: "Latehar",
    coordinates: { lat: 23.7438, lng: 84.5029 },
    blocks: [
      { name: "Latehar Sadar", villages: ["Dengi", "Sasang", "Karamdih", "Duru", "Baresanr"] },
      { name: "Chandwa", villages: ["Kamta", "Torar", "Chakla", "Hardatta"] },
      { name: "Balumath", villages: ["Mahuamilan", "Ganeshpur", "Makar", "Bariyatu"] },
      { name: "Mahuadanr", villages: ["Orsa", "Kukurtola", "Lodha", "Netarhat"] },
      { name: "Barwadih", villages: ["Betla", "Chhipadohar", "Mangra", "Kechki"] },
    ],
  },
  {
    name: "Pakur",
    hindiName: "पाकुड़",
    headquarters: "Pakur",
    coordinates: { lat: 24.6334, lng: 87.8492 },
    blocks: [
      { name: "Pakur Sadar", villages: ["Naveen Nagar", "Rahamatpur", "Kalikapur", "Sitapahar"] },
      { name: "Hiranpur", villages: ["Mohanpur", "Durgapur", "Sundarpahar", "Torai"] },
      { name: "Littipara", villages: ["Bada Ghaghari", "Kusma", "Dharampur", "Paharpur"] },
      { name: "Amrapara", villages: ["Balki", "Dumarchir", "Panchuwara", "Singhasi"] },
      { name: "Maheshpur", villages: ["Arjunpur", "Bhalchuan", "Devpur", "Rolagram"] },
    ],
  },
  {
    name: "Sahebganj",
    hindiName: "साहेबगंज",
    headquarters: "Sahebganj",
    coordinates: { lat: 25.2425, lng: 87.6439 },
    blocks: [
      { name: "Sahebganj Sadar", villages: ["Sakrigali", "Samda", "Ganga Prasad", "Kalyanchak"] },
      { name: "Rajmahal", villages: ["Mangalhat", "Karanpura", "Nawada", "Kankjol"] },
      { name: "Barharwa", villages: ["Kotalpokhar", "Ratanpur", "Bindutola", "Patna"] },
      { name: "Taljhari", villages: ["Motijharna", "Maharajpur", "Kalyani", "Borio"] },
      { name: "Udhwa", villages: ["Patautola", "Fakirchand", "Amanat", "Radhanagar"] },
    ],
  },
  {
    name: "Hazaribagh",
    hindiName: "हज़ारीबाग़",
    headquarters: "Hazaribagh",
    coordinates: { lat: 23.9966, lng: 85.3644 },
    blocks: [
      { name: "Sadar Hazaribagh", villages: ["Matwari", "Korrah", "Silwar", "Demotand"] },
      { name: "Barkagaon", villages: ["Badam", "Chano", "Harli", "Sikri"] },
      { name: "Ichak", villages: ["Hadari", "Kura", "Barkikangoi", "Pundri"] },
      { name: "Katkamsandi", villages: ["Shahpur", "Romo", "Dhanwar", "Pelawal"] },
      { name: "Chauparan", villages: ["Danua", "Tajpur", "Pandeybara", "Chaubey"] },
    ],
  },
  {
    name: "Giridih",
    hindiName: "गिरिडीह",
    headquarters: "Giridih",
    coordinates: { lat: 24.1855, lng: 86.3096 },
    blocks: [
      { name: "Giridih Sadar", villages: ["Sirsiya", "Bhandaridih", "Maheshlundi", "Paharipur"] },
      { name: "Bengabad", villages: ["Motileda", "Karnpura", "Golgo", "Sonbad"] },
      { name: "Dumri", villages: ["Madhuban", "Parasnathtola", "Kudro", "Isri"] },
      { name: "Bagodar", villages: ["Atka", "Dhurve", "Hariharpur", "Hesla"] },
      { name: "Tisri", villages: ["Lokay", "Khatponk", "Gawan", "Singho"] },
    ],
  },
];
