import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardScreenshot } from "@/components/screenshots/DashboardScreenshot"
import { TeamManagementScreenshot } from "@/components/screenshots/TeamManagementScreenshot"
import { AiToolsScreenshot } from "@/components/screenshots/AiToolsScreenshot"

export function FeatureTabs() {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="team">Team Management</TabsTrigger>
        <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard" className="mt-6">
        <DashboardScreenshot />
      </TabsContent>
      <TabsContent value="team" className="mt-6">
        <TeamManagementScreenshot />
      </TabsContent>
      <TabsContent value="ai-tools" className="mt-6">
        <AiToolsScreenshot />
      </TabsContent>
    </Tabs>
  )
}
