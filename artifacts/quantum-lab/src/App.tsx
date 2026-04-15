import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import JoinPage from "@/pages/JoinPage";
import AppLayout from "@/components/AppLayout";

const queryClient = new QueryClient();

function AppRouter() {
  const { role } = useApp();
  return role ? <AppLayout /> : <JoinPage />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppProvider>
            <Switch>
              <Route path="/" component={AppRouter} />
              <Route path="*" component={AppRouter} />
            </Switch>
          </AppProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
