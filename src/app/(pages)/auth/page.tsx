'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthService } from '@/lib/services/auth.service';
import Logo from '@/components/parts/logo';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [registrationAttempted, setRegistrationAttempted] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false);
    const [formCorrect, setFormCorrect] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [registerError, setRegisterError] = useState('');

    let validateEmail = (email: string) => {
        if (!email.trim()) {
            return 'Email is required';
        }

        const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            return 'Please enter a valid email address';
        }

        return null;
    };

    let validatePassword = (password: string) => {
        if (!password.trim()) {
            return 'Password is required';
        }

        const minLength = 6;
        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long`;
        }

        return null;
    };

    let validateConfirmPassword = (password: string, confirmPassword: string) => {
        if (confirmPassword !== password) {
            return 'Passwords do not match';
        }

        return null;
    };

    let validateName = (name: string) => {
        if (!name.trim()) {
            return 'Name is required';
        }

        return null;
    };

    useEffect(() => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(
            password,
            confirmPassword
        );
        const nameError = validateName(name);

        if (emailError || passwordError || confirmPasswordError || nameError) {
            console.error('Erros de validação no registro:', {
                email: emailError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
                name: nameError,
            });
            setLoading(false);
        }
        setFormCorrect(
            !emailError && !passwordError && !confirmPasswordError && !nameError
        );
    }, [registrationAttempted, email, password, confirmPassword, name]);

    const register = async (
        email: string,
        password: string,
        name: string,
        confirmPassword: string
    ) => {
        setRegistrationAttempted(true);
        if (!formCorrect) {
            return;
        }
        setLoading(true);

        console.log(email, password, name);

        await AuthService.signup(email, password, name)
            .then(async (response) => {
                console.log(response);
                if (response.success) {
                    console.log('sucesso');
                }
            })
            .catch(() => {
                alert('Erro ao cadastrar !');
            })
            .finally(() => {
                setLoading(false);
                window.location.href = '/auth';
            });
    };

    const login = async (email: string, password: string) => {
        setLoginAttempted(true);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        if (emailError || passwordError) {
            if (loginAttempted) {
                console.error('Login validation errors:', {
                    email: emailError,
                    password: passwordError,
                });
            }
            setLoading(false);
            return;
        }
        setLoading(true);

        await signIn('credentials', {
            email: email,
            password: password,
            callbackUrl: '/main',
            redirect: false,
        }).then((response) => {
            localStorage.setItem("loggedIn", "true");
            window.location.href = "/main";
        }
        ).catch((error) => {
            setLoginError(error.response.data.message);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <main className='flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'>
            <Logo width='280' height='90' />
            <Tabs
                defaultValue='login'
                className='w-full md:w-[400px] bg-white rounded-lg overflow-hidden mt-10'
            >
                <TabsList className='grid w-full grid-cols-2 bg-gray-100 p-2'>
                    <TabsTrigger value='login'>Fazer Login</TabsTrigger>
                    <TabsTrigger value='register'>Criar Conta</TabsTrigger>
                </TabsList>
                <TabsContent value='login'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Bem vindo(a)</CardTitle>
                            <CardDescription>
                                Digite suas credenciais para entrar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            <div className='space-y-1'>
                                <Label htmlFor='email'>E-mail</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='pedroduarte@gmail.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {loginAttempted && validateEmail(email) && (
                                    <p className='text-red-500 text-sm'>{validateEmail(email)}</p>
                                )}
                            </div>
                            <div className='space-y-1'>
                                <Label htmlFor='username'>Senha</Label>
                                <Input
                                    id='username'
                                    type='password'
                                    placeholder='********'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {loginAttempted && validatePassword(password) && (
                                    <p className='text-red-500 text-sm'>
                                        {validatePassword(password)}
                                    </p>
                                )}
                            </div>
                            {loginError && (
                                <p className='text-red-500 text-sm'>
                                    Seu email ou senha estão incorretos !
                                </p>
                            )}
                        </CardContent>
                        <CardFooter>
                            {!loading ? (
                                <Button onClick={() => login(email, password)}>Entrar</Button>
                            ) : (
                                <Button disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    carregando...
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value='register'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Bem vindo(a)</CardTitle>
                            <CardDescription>
                                Preencha as informações abaixo para criar sua conta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            <div className='space-y-1'>
                                <Label htmlFor='name'>Nome</Label>
                                <Input
                                    id='name'
                                    type='text'
                                    placeholder='Pedro Duarte'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {registrationAttempted && validateName(name) && (
                                    <p className='text-red-500 text-sm'>{validateName(name)}</p>
                                )}
                            </div>

                            <div className='space-y-1'>
                                <Label htmlFor='email'>E-mail</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='pedroduarte@gmail.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {registrationAttempted && validateEmail(email) && (
                                    <p className='text-red-500 text-sm'>{validateEmail(email)}</p>
                                )}
                            </div>

                            <div className='space-y-2 md:space-y-0 md:space-x-2 md:flex md:flex-row md:justify-between'>
                                <div className='space-y-1 md:w-1/2'>
                                    <Label htmlFor='password'>Senha</Label>
                                    <Input
                                        id='password'
                                        type='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {registrationAttempted && validatePassword(password) && (
                                        <p className='text-red-500 text-sm'>
                                            {validatePassword(password)}
                                        </p>
                                    )}
                                </div>
                                <div className='space-y-1 md:w-1/2'>
                                    <Label htmlFor='confirm_password'>Confirmação</Label>
                                    <Input
                                        id='confirm_password'
                                        type='password'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {registrationAttempted &&
                                        validateConfirmPassword(password, confirmPassword) && (
                                            <p className='text-red-500 text-sm'>
                                                {validateConfirmPassword(password, confirmPassword)}
                                            </p>
                                        )}
                                </div>
                            </div>
                            {registerError && (
                                <p className='text-red-500 text-sm'>{registerError}</p>
                            )}
                        </CardContent>
                        <CardFooter>
                            {!loading ? (
                                <Button
                                    onClick={() =>
                                        register(email, password, name, confirmPassword)
                                    }
                                >
                                    Registrar
                                </Button>
                            ) : (
                                <Button disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    carregando...
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}
