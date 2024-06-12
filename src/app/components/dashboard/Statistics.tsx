import {
  BeakerIcon,
  DocumentCheckIcon,
  EyeDropperIcon,
  Square3Stack3DIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { FC, useEffect, useState } from "react";
import { IDashboard } from "../../types";
import Statistic from "./components/Statistic";
import Protected from "../auth/Protected";
import { BuildingOffice2Icon } from "@heroicons/react/20/solid";
import { IUserWithPermissions } from "../../types/common";

type props = {
  data: IDashboard;
  user: IUserWithPermissions;
};

const Statistics: FC<props> = ({ data, user }) => {
  const [isClinic, setIsClinic] = useState<boolean>();
  const [isPharmacy, setIsPharmacy] = useState<boolean>();
  const [isInstitution, setIsInstitution] = useState<boolean>();
  const [variablesSet, setVariablesSet] = useState<boolean>();

  useEffect(() => {
    if (variablesSet === undefined && user) {
      setIsInstitution(user.institution !== null);
      setIsClinic(
        user.institution !== null && user.institution.institutionType == "CLINIC",
      );
      setIsPharmacy(
        user.institution !== null && user.institution.institutionType == "PHARMACY",
      );

      setVariablesSet(true);
    }
  }, [user]);

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        <Protected permissions={["VIEW_MEDECINES"]}>
          <Statistic
            link='drugs'
            icon={<EyeDropperIcon className='text-white' />}
            label='Drugs'
            number={data.drugsCount as number}
            permission='MEDECINES'
          />
        </Protected>

        <Protected permissions={["PURCHASE_MEDECINES"]}>
          {(isClinic || isPharmacy) && (
            <Statistic
              link='stock'
              icon={<Square3Stack3DIcon className='text-white' />}
              label='Drugs in stock'
              number={data.drugsInStock as number}
              permission='MEDECINES'
            />
          )}
        </Protected>

        <Protected permissions={["VIEW_EXAMS"]}>
          <Statistic
            link='exams'
            icon={<BeakerIcon className='text-white' />}
            label='Exams'
            number={data.examsCount as number}
            permission='EXAMS'
          />
        </Protected>

        <Protected permissions={["VIEW_USERS"]}>
          <Statistic
            link='users'
            icon={<UserGroupIcon className='text-white' />}
            label='Users'
            number={data.usersCount as number}
            permission='USERS'
          />
        </Protected>

        {!isInstitution && (
          <Protected permissions={["VIEW_INSTITUTIONS"]}>
            <Statistic
              link='institutions'
              icon={<Square3Stack3DIcon className='text-white' />}
              label='Institutions'
              number={data.institutionsCount as number}
              permission='INSTITUTIONS'
            />

            <Statistic
              link='institutions'
              icon={<BuildingOffice2Icon className='text-white' />}
              label='Branches'
              number={data.institutionBranchesCount as number}
              permission='INSTITUTIONS'
            />
          </Protected>
        )}

        <Protected permissions={["INSTITUTION_ADMIN"]}>
          {isInstitution && (
            <Statistic
              link='branches'
              icon={<BuildingOffice2Icon className='text-white' />}
              label='Branches'
              number={user?.institution?.branches?.length as number}
              permission='ADMIN'
            />
          )}
        </Protected>

        <Protected
          permissions={[
            "CONSULTATION",
            "LABORATORY",
            "PHARMACY",
            "COUNTER",
            "RECEIPTION",
          ]}
        >
          {user?.institution && user.institution?.institutionType == "CLINIC" && (
            <Statistic
              link='forms'
              icon={<DocumentCheckIcon className='text-white' />}
              label='Open forms'
              number={data.openFormsCount as number}
              permission='CLINIC'
            />
          )}
        </Protected>
      </div>
    </>
  );
};

export default Statistics;
