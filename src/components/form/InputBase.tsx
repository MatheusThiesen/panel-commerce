import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export const InputBase = ({ name, label, ...props }: Props) => {
  return (
    <div className="grid flex-1  items-center gap-1">
      {label && (
        <Label htmlFor={name} className="text-slate-700 text-sm font-normal">
          {label}
        </Label>
      )}

      <Input type="email" id={name} {...props} />
    </div>
  );
};
