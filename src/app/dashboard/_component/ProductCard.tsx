"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddSiteToDialogModel from "./AddSiteToDialogModel";
import DeleteDialogModel from "./DeleteDialogModel";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
}

const ProductCard = ({ id, name, description, url }: Product) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>
            <Link
              href={`/dashboard/products/${id}`}
              aria-label={`View details for ${name}`}
            >
              {name}
            </Link>
          </CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`More options for ${name}`}
              >
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/products/${id}/edit`}
                  role="menuitem"
                  aria-label={`Edit ${name}`}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Add to Site
                  </DropdownMenuItem>
                </DialogTrigger>
                <AddSiteToDialogModel id={id} />
              </Dialog>

              <DropdownMenuSeparator />

               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <DeleteDialogModel id={id} />
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-gray-600">
          <span className="font-medium">URL: </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label={`Visit ${name} website (opens in new tab)`}
          >
            {url}
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;