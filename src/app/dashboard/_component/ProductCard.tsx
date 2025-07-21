"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Ellipsis,
  ExternalLink,
  Edit3,
  Plus,
  Trash2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import AddSiteToDialogModel from "./AddSiteToDialogModel";
import DeleteDialogModel from "./DeleteDialogModel";

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  status?: "active" | "inactive" | "draft";
  lastUpdated?: string;
}

const ProductCard = ({
  id,
  name,
  description,
  url,
  status = "draft",
  lastUpdated,
}: Product) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      console.log(urlObj);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  formatUrl(url);

  return (
    <Card className="group relative overflow-hidden transition-all duration-400 ease-in-out ">
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={`text-xs font-medium ${getStatusColor(status)}`}
              >
                {status}
              </Badge>
              {lastUpdated && (
                <span className="text-xs text-white bg-gray-800 rounded-full px-2 py-1">
                  Updated {lastUpdated}
                </span>
              )}
            </div>

            <CardTitle className="text-lg font-semibold leading-tight">
              <Link
                href={`/dashboard/products/${id}`}
                aria-label={`View details for ${name}`}
              >
                {name}
              </Link>
            </CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`More options for ${name} Product`}
              >
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/products/${id}/edit`}
                  className="flex items-center gap-2 cursor-pointer"
                  aria-label={`Edit ${name}`}
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Product
                </Link>
              </DropdownMenuItem>

              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Site
                  </DropdownMenuItem>
                </DialogTrigger>
                <AddSiteToDialogModel id={id} />
              </Dialog>

              <DropdownMenuSeparator className="bg-gray-700" />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    variant="destructive"
                    className="flex items-center gap-2 cursor-pointer "
                  >
                    <Trash2 className="h-4 w-4 text-white " /> Delete Product
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <DeleteDialogModel id={id} />
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardDescription className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="font-medium">Website:</span>
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm font-medium transition-colors duration-200"
              aria-label={`Visit ${name} website (opens in new tab)`}
            >
              {formatUrl(url)}
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${name} website (opens in new tab)`}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Action buttons - visible on hover */}
      </CardContent>

      <CardFooter className="flex items-center gap-5 absolute bottom-5 left-0 right-0 mt-60">
    
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 h-8 text-xs font-medium"
          >
            <Link href={`/dashboard/products/${id}`}>View Details</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 h-8 text-xs font-medium"
          >
            <Link href={`/dashboard/products/${id}/edit`}>Quick Edit</Link>
          </Button>
    
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
