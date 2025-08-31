import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function EnvironmentModuleForm() {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-heading">Environment Metrics</h1>
      </CardHeader>
      <CardContent className="px-6">
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium text-primary">B3 Energy & GHG</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                2
              </div>
              <span className="text-sm text-muted-foreground">B4 Pollution</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                3
              </div>
              <span className="text-sm text-muted-foreground">B5 Biodiversity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                4
              </div>
              <span className="text-sm text-muted-foreground">B6 Water</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                5
              </div>
              <span className="text-sm text-muted-foreground">B7 Resource Use</span>
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
                <h3 className="text-lg font-semibold">Energy Consumption</h3>
              </CardHeader>
              <CardContent className="px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Input id="renewable-sources" className="mt-1" placeholder="0.00" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Greenhouse Gas Emissions</h3>
              </CardHeader>
              <CardContent className="px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scope1">Scope 1 (tCO2eq)</Label>
                    <Input id="scope1" className="mt-1" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="scope2">Scope 2 (tCO2eq)</Label>
                    <Input id="scope2" className="mt-1" placeholder="0.00" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="scope3">Scope 3 (tCO2eq) - Optional</Label>
                    <Input id="scope3" className="mt-1" placeholder="0.00" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="energy-methodology">Methodology for Energy Data</Label>
                <Textarea
                  id="energy-methodology"
                  rows={4}
                  className="mt-1"
                  placeholder="Describe the methodology used for collecting energy data..."
                />
              </div>
              <div>
                <Label htmlFor="ghg-uncertainty">Uncertainty in GHG Data</Label>
                <Textarea
                  id="ghg-uncertainty"
                  rows={4}
                  className="mt-1"
                  placeholder="Describe the uncertainty factors in GHG emissions data..."
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
  );
}
