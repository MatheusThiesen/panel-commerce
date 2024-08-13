import { LucideIcon } from "lucide-react";
import { Loading } from "./loading";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AnalyticCardProps {
  icon: LucideIcon;
  title: string;
  value?: string;
  observation?: string;

  isLoading?: boolean;
}

export function AnalyticCard({
  icon: Icon,
  title,
  value = "-",
  observation,
  isLoading = false,
}: AnalyticCardProps) {
  return (
    <Card className="bg-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {observation && (
              <p className="text-xs text-muted-foreground">{observation}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
