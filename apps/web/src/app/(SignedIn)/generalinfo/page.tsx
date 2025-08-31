import { EnvironmentModuleForm } from '@/components/environmentmoduleform'

export default function GeneralInfoPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="aspect-video rounded-xl bg-muted/50">
          <h1 className="mb-4 font-semibold text-2xl">General Information</h1>
          <p className="text-muted-foreground">
            This is a basic general information page. You can add your content
            here.
          </p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="p-6">
          <EnvironmentModuleForm />
        </div>
      </div>
    </div>
  )
}
