import sytemPermissions, {
  Permission,
  PermissionGroup,
} from "../constants/permissions";

export const getUserPermissionGroups = (
  permissions: Permission[],
): PermissionGroup[] => {
  return sytemPermissions
    .filter((group) =>
      group.permissions.some((permission) => permissions.includes(permission)),
    )
    .map((group) => group.group);
};
