import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function EnvironmentModuleForm() {
  return (
    <Card className="mx-auto w-full max-w-6xl">
      <CardHeader>
        <h1 className="font-heading text-2xl">Environment Metrics</h1>
      </CardHeader>
      <CardContent className="px-6">
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
                1
              </div>
              <span className="font-medium text-primary text-sm">B3 Energy & GHG</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm">
                2
              </div>
              <span className="text-muted-foreground text-sm">B4 Pollution</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm">
                3
              </div>
              <span className="text-muted-foreground text-sm">B5 Biodiversity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm">
                4
              </div>
              <span className="text-muted-foreground text-sm">B6 Water</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm">
                5
              </div>
              <span className="text-muted-foreground text-sm">B7 Resource Use</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="not-material" />
            <Label htmlFor="not-material">Mark this topic as not material for our business</Label>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Energy Consumption</h3>
              </CardHeader>
              <CardContent className="px-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div />
                  <div className="text-center font-medium">Renewable (MWh)</div>
                  <div className="text-center font-medium">Non-renewable (MWh)</div>
                  <div className="font-medium">Electricity</div>
                  <Input placeholder="0.00" />
                  <Input placeholder="0.00" />
                  <div className="font-medium">Fuels</div>
                  <Input placeholder="0.00" />
                  <Input placeholder="0.00" />
                </div>
                <div className="mt-4">
                  <Label htmlFor="renewable-sources">
                    Energy from own renewable sources (MWh) - Optional
                  </Label>
                  <Input className="mt-1" id="renewable-sources" placeholder="0.00" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Greenhouse Gas Emissions</h3>
              </CardHeader>
              <CardContent className="px-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="scope1">Scope 1 (tCO2eq)</Label>
                    <Input className="mt-1" id="scope1" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="scope2">Scope 2 (tCO2eq)</Label>
                    <Input className="mt-1" id="scope2" placeholder="0.00" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="scope3">Scope 3 (tCO2eq) - Optional</Label>
                    <Input className="mt-1" id="scope3" placeholder="0.00" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="energy-methodology">Methodology for Energy Data</Label>
                <Textarea
                  className="mt-1"
                  id="energy-methodology"
                  placeholder="Describe the methodology used for collecting energy data..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="ghg-uncertainty">Uncertainty in GHG Data</Label>
                <Textarea
                  className="mt-1"
                  id="ghg-uncertainty"
                  placeholder="Describe the uncertainty factors in GHG emissions data..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Save and Exit</Button>
        <Button>Save and Continue</Button>
      </CardFooter>
    </Card>
  )
}
