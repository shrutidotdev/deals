import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { env } from "@/lib/env/client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AddSiteToDialogModel = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);
  const code = `<script async src="${env.NEXT_PUBLIC_SERVER_URL}?id=${id}"></script>`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy");
    }
  }

  return (
    <DialogContent className="bg-black text-white max-w-3xl overflow-hidden">
      <DialogHeader>
        <DialogTitle>Start Earning PPP sale!</DialogTitle>
        <DialogDescription>
          All you need to do is add your site URL and start earning.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2 mt-2">
        <label className="text-sm font-medium ">
          ⬇️Copy this script to your website:
        </label>
        <div className="flex items-center gap-2">
          <Input
            value={code}
            className="bg-gray-900 border-gray-700 text-white font-mono text-sm"
            readOnly
          />
          <Button
            onClick={handleCopy}
            variant="outline"
            size="icon"
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {copied && (
          <p className="text-green-500 text-sm">✓ Copied to clipboard!</p>
        )}
      </div>
    </DialogContent>
  );
};

export default AddSiteToDialogModel;
