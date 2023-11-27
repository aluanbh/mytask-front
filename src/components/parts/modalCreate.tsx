import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Chip from '@mui/material-next/Chip';
import { Textarea } from "@/components/ui/textarea"
import { TaskService } from '@/lib/services/tasks.service';
import { UserService } from '@/lib/services/users.service';



export function ModalCreate() {

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [userId, setUserId] = useState<number>(0);
    const [users, setUsers] = useState<any[]>([]);


    useEffect(() => {
        const resUsers = UserService.getUsers()
            .then((res) => {
                setUsers(res);
            });

    }, []);


    const handleDeleteTag = (tagToDelete: string) => {
        setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
    };

    const handleAddTag = () => {
        if (newTag.trim() !== '') {
            setTags((prevTags) => [...prevTags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };


    const handleSaveTask = async (title: string, description: string, tags: string[], userId: number) => {
        const res = await TaskService.createTask(title, description, tags, userId)
            .then((res) => {
                window.location.reload();
            }).catch((err) => {
                if (err.response.data) {
                    console.log('err.response.data', err.response.data.name);
                    if (err.response.data.name == "MissingParamError title") {
                        setError('O campo título é obrigatório.');
                    }
                    else if (err.response.data.name == "MissingParamError description") {
                        setError('O campo descrição é obrigatório.');
                    }
                }
            }
            );
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Nova Tarefa</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nova Tarefa</DialogTitle>
                    <DialogDescription>
                        Preencha os campos abaixo para criar uma nova tarefa.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="title"
                            placeholder='Título da tarefa'
                            className="col-span-3"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Descrição da tarefa
                        </Label>
                        <Textarea
                            id="description"
                            placeholder='Descrição da tarefa'
                            className="col-span-3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Responsável
                        </Label>
                        <select
                            id="responsible"
                            className="col-span-3"
                            value={userId}
                            placeholder='Selecione um responsável'
                            onChange={(e) => setUserId(parseInt(e.target.value))}
                        >
                            <option value="">Selecione um responsável</option>
                            {users.map((user, index) => (
                                <option key={index} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tags" className="text-right">
                            Tags
                        </Label>
                        <div className="col-span-3 space-x-2">
                            {tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleDeleteTag(tag)}
                                />
                            ))}
                        </div>
                        <Input
                            id="tags"
                            placeholder='Adicionar Tags'
                            className="col-span-3"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button onClick={handleAddTag}>Adicionar</Button>
                    </div>
                </div>

                <div className='flex flex-row justify-center gap-7'>
                    {error && <p className="text-red-500">{error}</p>}
                    <Button
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded '
                        onClick={() => handleSaveTask(title, description, tags, userId)}
                    >
                        Salvar
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}
