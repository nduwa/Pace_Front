import { useNavigate } from "react-router-dom";
import PageContent from "../../components/common/PageContent";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getGroupedPermissions, getRoles } from "../../apis/roles";
import { ALL_GROUPED_PERMISSIONS, ALL_ROLES } from "../../utils/constants/queryKeys";
import RoleActions from "../../components/roles/RolesActions";

const ActionsComponent = () => {
  const navigate = useNavigate();
  const gotToCreateRolePage = () => {
    navigate("/roles/create");
  };
  return (
    <Protected permissions={["INSTITUTION_ADMIN"]}>
      <Button onClick={gotToCreateRolePage} label='Add role' />
    </Protected>
  );
};

const RolesPage = () => {
  const { data, isLoading } = useQuery({ queryFn: getRoles, queryKey: ALL_ROLES });

  const { data: permissionWithGroup, isLoading: permissionLoading } = useQuery({
    queryKey: ALL_GROUPED_PERMISSIONS,
    queryFn: getGroupedPermissions,
  });

  return (
    <PageContent
      isLoading={isLoading || permissionLoading}
      title='Roles'
      actionsComponent={<ActionsComponent />}
    >
      {data && permissionWithGroup && (
        <>
          <div className='grid xss:grid-cols-2 grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {data?.map((role) => (
              <div
                key={role.id}
                className='rounded space-y-1 border border-[rgba(108,171,60,0.11)]'
              >
                <div className='role-icon flex justify-center pt-3'>
                  <ShieldCheckIcon className=' text-green w-14' />
                </div>
                <div className='px-1 pb-2'>
                  <div className='font-bold text-center capitalize'>
                    {role.label}
                  </div>
                </div>
                <RoleActions role={role} permissionWithGroup={permissionWithGroup} />
              </div>
            ))}
          </div>
        </>
      )}
    </PageContent>
  );
};

export default RolesPage;
