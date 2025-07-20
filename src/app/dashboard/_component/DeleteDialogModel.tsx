"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/server/actions/product";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
const DeleteDialogModel = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(id);

      if (result?.message) {
        toast.success("Product deleted successfully");
        router.refresh()
        return;
      } else {
        toast.error(result?.error);
      }
    });
  };
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} disabled={isPending}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteDialogModel;
