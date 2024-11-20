import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

const LogoutButton = () => {
  return (
    <div className="flex items-center justify-end space-x-2 p-2">
      <Button variant="outline">
        <LogOutIcon size={16} />
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
