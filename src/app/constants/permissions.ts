const appPersmissions = [
  {
    group: "INSTITUTIONS",
    permissions: ["VIEW_INSTITUTIONS", "UPDATE_INSTITUTIONS"],
  },
  {
    group: "USERS",
    permissions: ["VIEW_USERS", "UPDATE_USERS", "CHANGE_USERS_PERMISSIONS"],
  },
  {
    group: "SUDO",
    permissions: ["ALL_PERMISSIONS"],
  },
  {
    group: "ADMIN",
    permissions: ["INSTITUTION_ADMIN"],
  },
  {
    group: "MEDECINES",
    permissions: ["VIEW_MEDECINES", "UPDATE_MEDECINES"],
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
