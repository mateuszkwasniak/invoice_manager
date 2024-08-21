import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreferencesCard from "../cards/PreferencesCard";

export default async function SettingsTabs() {
  return (
    <Tabs defaultValue="preferences" className="w-full">
      <TabsList>
        <TabsTrigger value="preferences">Preferencje</TabsTrigger>
        <TabsTrigger value="account">Konto</TabsTrigger>
      </TabsList>
      <TabsContent value="preferences">
        <PreferencesCard />
      </TabsContent>
      <TabsContent value="account">W trakcie realizacji...</TabsContent>
    </Tabs>
  );
}
