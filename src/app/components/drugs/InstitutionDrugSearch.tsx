import { useQuery } from "@tanstack/react-query";
import { INSTITUTION_DRUGS_GROUPED_NPAGED } from "../../utils/constants/queryKeys";
import ComboboxField from "../common/form/ComboboxField";
import { getInstitutionGroupedNPaged } from "../../apis/drug";
import { FC, useEffect, useState } from "react";

type searchProps = {
  searchFun?: (value: string) => void;
};

const SearchComponent: FC<searchProps> = ({ searchFun }) => {
  const [searchText, setSearchText] = useState<string>();

  const handleTableSearch = (searchq: string) => {
    setSearchText(searchq);
  };

  useEffect(() => {
    const handleSearch = setTimeout(() => {
      if (searchFun && searchText != undefined) {
        searchFun(searchText);
      }
    }, 300);
    return () => clearTimeout(handleSearch);
  }, [searchText]);

  const { data: drugsList } = useQuery({
    queryFn: () => getInstitutionGroupedNPaged(),
    queryKey: INSTITUTION_DRUGS_GROUPED_NPAGED,
  });

  return (
    <>
      {drugsList && (
        <div className='max-w-md'>
          <ComboboxField
            options={[{ label: "All drugs", value: "all" }].concat(
              drugsList.map((drug) => ({
                value: drug.drugId,
                label: `${drug.drug?.drug_code} ${drug.drug?.designation}`,
              })),
            )}
            onChange={(value: string) => handleTableSearch(value)}
          />
        </div>
      )}
    </>
  );
};

export default SearchComponent;
