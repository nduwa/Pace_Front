const appPersmissions = [
  {
    group: "INSTITUTIONS",
    permissions: ["VIEW_INSTITUTIONS", "UPDATE_INSTITUTIONS"],
  },
  {
    group: "USERS",
    permissions: ["VIEW_USERS", "UPDATE_USERS"],
  },
  {
    group: "SUDO",
    permissions: ["ALL_PERMISSIONS", "IMPORT_MEDECINES"],
  },
  {
    group: "ADMIN",
    permissions: ["INSTITUTION_ADMIN"],
  },
  {
    group: "MEDECINES",
    permissions: [
      "VIEW_MEDECINES",
      "UPDATE_MEDECINES",
      "PURCHASE_MEDECINES",
      "SERVE_MEDECINES",
    ],
  },
  {
    group: "PATIENTS",
    permissions: ["VIEW_PATIENTS", "UPDATE_PATIENTS"],
  },
] as const;

export type GroupedPermissions = typeof appPersmissions;
export type PermissionsGroups = GroupedPermissions[number];
export type PermissionGroup = GroupedPermissions[number]["group"];
export type Permission = GroupedPermissions[number]["permissions"][number];

export default appPersmissions;
