export const rwandaProvinces = [
  "City of Kigali",
  "Eastern Province",
  "Northern Province",
  "Southern Province",
  "Western Province",
] as const;

export const rwandaDitsricts = {
  "City of Kigali": ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Eastern Province": [
    "Bugesera",
    "Gatsibo",
    "Kayonza",
    "Kirehe",
    "Ngoma",
    "Nyagatare",
    "Rwamagana",
  ],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Southern Province": [
    "Gisagara",
    "Huye",
    "Kamonyi",
    "Muhanga",
    "Nyaruguru",
    "Ruhango",
    "Karongi",
    "Ngororero",
  ],
  "Western Province": [
    "Karongi",
    "Ngororero",
    "Nyabihu",
    "Nyamasheke",
    "Rubavu",
    "Rusizi",
    "Rutsiro",
  ],
} as const;

export type IRwandaProvinces = typeof rwandaProvinces;
export type IProvince = keyof typeof rwandaDitsricts;
export type IDistrict = (typeof rwandaDitsricts)[IProvince][number];
