import PageContent from "../../components/common/PageContent";
import RoleForm from "../../components/roles/RoleForm";
import { useState } from "react";

const CreateRolePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <PageContent isLoading={isLoading} title='Create new role'>
      <RoleForm setIsLoading={setIsLoading} />
    </PageContent>
  );
};

export default CreateRolePage;
