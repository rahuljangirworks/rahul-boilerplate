import { useState, useEffect, useCallback, type FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: "active" | "paused" | "done";
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSave?: (data: { name: string; description?: string; status: string }) => void;
}

export function ProjectDialog({
  open,
  onOpenChange,
  project = null,
  onSave,
}: ProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "paused" | "done">("active");
  const [isPending, setIsPending] = useState(false);

  const isEditMode = !!project;

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? "");
      setStatus(project.status);
    } else {
      setName("");
      setDescription("");
      setStatus("active");
    }
  }, [project, open]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!name.trim()) {
        toast.error("Project name is required.");
        return;
      }

      setIsPending(true);
      // Simulate save delay
      await new Promise((r) => setTimeout(r, 500));
      onSave?.({ name, description, status });
      toast.success(isEditMode ? "Project updated!" : "Project created!");
      setIsPending(false);
      onOpenChange(false);
    },
    [name, description, status, isEditMode, onSave, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Project" : "Create Project"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Modify your project's settings and properties."
                : "Add a new project to your workspace."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My Project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your project."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                className="resize-none"
              />
            </div>
            {isEditMode && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(val) =>
                    setStatus(val as "active" | "paused" | "done")
                  }
                  disabled={isPending}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="done">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
