import React from 'react';
import { Button } from "@/components/ui/button";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TaskService } from '@/lib/services/tasks.service';

interface ModalProps {
    selectedRow: any;
}

export function ModalDelete({ selectedRow }: ModalProps) {

    const handleDelete = () => {
        if (selectedRow) {
            const res = TaskService.deleteTask(selectedRow.id)
                .then((res) => {
                    window.location.reload();
                }
                );

        }

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <DeleteIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Apagar Tarefa</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja apagar essa tarefa?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row justify-end gap-4 py-4">
                    <Button onClick={() => handleDelete()}>Confirmar</Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}