import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RoutesProvider from "./RoutesProvider";
import { AuthProvider } from "react-auth-kit";
import AuthContextProvider from "./AuthContextProvider";

const Providers = () => {
  const clientQuery = new QueryClient();
  return (
    <AuthContextProvider>
      <QueryClientProvider client={clientQuery}>
        <AuthProvider authType='cookie' authName='_auth'>
          <RoutesProvider />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthContextProvider>
  );
};
export default Providers;
