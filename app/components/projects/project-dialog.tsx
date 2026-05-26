import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/providers/trpc-provider";
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
  project?: Project | null; // If provided, we are in edit mode
}

export function ProjectDialog({
  open,
  onOpenChange,
  project = null,
}: ProjectDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "paused" | "done">("active");

  const isEditMode = !!project;

  // Pre-fill form if editing
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

  const createMutation = useMutation({
    ...trpc.project.create.mutationOptions(),
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: trpc.project.pathKey() });
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create project");
    },
  });

  const updateMutation = useMutation({
    ...trpc.project.update.mutationOptions(),
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: trpc.project.pathKey() });
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update project");
    },
  });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!name.trim()) {
        toast.error("Project name is required.");
        return;
      }

      if (isEditMode && project) {
        updateMutation.mutate({
          id: project.id,
          name,
          description: description || undefined,
          status,
        });
      } else {
        createMutation.mutate({
          name,
          description: description || undefined,
          status,
        });
      }
    },
    [name, description, status, isEditMode, project, createMutation, updateMutation]
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Project" : "Create Project"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Modify your project's settings and properties."
                : "Add a new generic project container to your boilerplate."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My Boilerplate App"
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
                placeholder="A reusable Next-Gen Full-Stack scaffolding."
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
