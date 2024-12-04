import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EmployeeModalProps {
  isModalOpen: boolean;
  handelModalClose: (open: boolean) => void;
  employee: any;
}

function EmployeeModal({ isModalOpen, handelModalClose, employee }: EmployeeModalProps) {
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => handelModalClose(open)}>
      <DialogContent className="rounded-sm w-[97.5vw] max-w-[100vw] h-[97.5vh] bg-bg_primary">

      </DialogContent>
    </Dialog>
  );
}

export default EmployeeModal;
